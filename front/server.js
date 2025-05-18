import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import ACTIONS from './src/socket/actions.js';
import {Chess} from "chess.js";

const PORT = 3001;
const HOST = process.env.VITE_SERVER_URL || "localhost";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: `http://${HOST}:5173`,
        methods: ["GET", "POST"]
    }
});
const roomStates = {};

io.on('connection', socket => {

    socket.on(ACTIONS.JOIN, config => {
        const { room: roomID, role } = config;
        socket.role = role;

        const joinedRooms = socket.rooms;

        if (joinedRooms.has(roomID)) {
            return console.warn(`Already joined to ${roomID}`);
        }

        const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);

        clients.forEach(clientID => {
            io.to(clientID).emit(ACTIONS.ADD_PEER, {
                peerID: socket.id,
                createOffer: false
            });

            socket.emit(ACTIONS.ADD_PEER, {
                peerID: clientID,
                createOffer: true,
            });
        });

        socket.join(roomID);

        if (roomStates[roomID]) {
            const fen = roomStates[roomID].game.fen();
            socket.emit(ACTIONS.CHESS_STATE, { fen });
        }
    });

    function leaveRoom() {
        const joinedRooms = socket.rooms;

        Array.from(joinedRooms)
            .forEach(roomID => {
                const clients = Array.from(io.sockets.adapter.rooms.get(roomID.toString()) || []);

                clients.forEach(clientID => {
                    io.to(clientID).emit(ACTIONS.REMOVE_PEER, {
                        peerID: socket.id,
                    });

                    socket.emit(ACTIONS.REMOVE_PEER, {
                        peerID: clientID,
                    });
                });

                socket.leave(roomID);
            });
    }

    socket.on(ACTIONS.LEAVE, leaveRoom);
    socket.on('disconnecting', leaveRoom);

    socket.on(ACTIONS.RELAY_SDP, ({ peerID, sessionDescription }) => {
        io.to(peerID).emit(ACTIONS.SESSION_DESCRIPTION, {
            peerID: socket.id,
            sessionDescription,
        });
    });

    socket.on(ACTIONS.RELAY_ICE, ({ peerID, iceCandidate }) => {
        io.to(peerID).emit(ACTIONS.ICE_CANDIDATE, {
            peerID: socket.id,
            iceCandidate,
        });
    });

    socket.on(ACTIONS.IS_TEACHER_ONLINE, ({ roomID }) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);
        const hasTeacher = clients.some(id => {
            const clientSocket = io.sockets.sockets.get(id);
            return clientSocket?.role === 'ROLE_TEACHER';
        });
        socket.emit(ACTIONS.TEACHER_ONLINE_STATUS, { roomID, online: hasTeacher });
    });

    socket.on(ACTIONS.CHESS_MOVE, ({ roomID, from, to, promotion }) => {
        const state = roomStates[roomID] || { game: new Chess() };

        const move = state.game.move({ from, to, promotion });

        if (move) {
            const fen = state.game.fen();
            roomStates[roomID] = { game: state.game };
            socket.to(roomID).emit('chess-move', { from, to, promotion, fen });
        }
    });

    socket.on(ACTIONS.CHESS_RESET, ({ roomID, fen }) => {
        const game = new Chess(fen);
        roomStates[roomID] = { game };
        io.to(roomID).emit(ACTIONS.CHESS_STATE, { fen });
    });

    socket.on(ACTIONS.CHESS_GAME_OVER, ({ roomID, message }) => {
        console.log(`[GAME OVER] Room: ${roomID}, Message: ${message}`);
        io.to(roomID).emit('chess-game-over', { message });
    });
});


server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started on port ${PORT}`);
});
