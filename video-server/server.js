import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import ACTIONS from './actions.js';
import {Chess} from "chess.js";
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3001;
const URL = process.env.FRONT_URL || "https://localhost:5173";
console.log(`Frontend URL allowed via CORS: ${URL}`);

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: URL,
        methods: ["GET", "POST"]
    }
});
const roomStates = {};

io.on('connection', socket => {

    socket.on(ACTIONS.JOIN, config => {
        const { room: roomID, role } = config;
        socket.role = role;

        if (socket.rooms.has(roomID)) {
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
            const { game, history, fenHistory } = roomStates[roomID];
            socket.emit(ACTIONS.CHESS_STATE, {
                fen: game.fen(),
                history,
                fenHistory,
                currentMoveIndex: history.length - 1
            });
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
        let state = roomStates[roomID];
        if (!state) {
            state = {
                game: new Chess(),
                history: [],
                fenHistory: ['start'],
                currentMoveIndex: -1
            };
            roomStates[roomID] = state;
        }

        try {
            if (state.currentMoveIndex < state.history.length - 1) {
                state.history = state.history.slice(0, state.currentMoveIndex + 1);
                state.fenHistory = state.fenHistory.slice(0, state.currentMoveIndex + 2);
            }

            const moveObj = { from, to };
            const piece = state.game.get(from);
            if (piece && piece.type === 'p' &&
                ((piece.color === 'w' && to[1] === '8') ||
                    (piece.color === 'b' && to[1] === '1'))) {
                moveObj.promotion = promotion || 'q';
            }

            const move = state.game.move(moveObj);

            if (move) {
                state.history.push(move);
                state.fenHistory.push(state.game.fen());
                state.currentMoveIndex = state.history.length - 1;

                io.to(roomID).emit('chess-move', {
                    fen: state.game.fen(),
                    history: state.history,
                    fenHistory: state.fenHistory,
                    currentMoveIndex: state.currentMoveIndex
                });
            }
        } catch (err) {
            console.error("Invalid move attempted:", { from, to, promotion }, err.message);
        }
    });

    socket.on(ACTIONS.CHESS_RESET, ({ roomID, fen }) => {
        const game = new Chess(fen);
        roomStates[roomID] = { game, history: [], fenHistory: [fen] };
        io.to(roomID).emit(ACTIONS.CHESS_STATE, { fen, history: [], fenHistory: [fen] });
    });

    socket.on(ACTIONS.CHESS_GO_TO_MOVE, ({ roomID, moveIndex }) => {
        const state = roomStates[roomID];
        if (state && state.fenHistory[moveIndex + 1]) {
            state.currentMoveIndex = moveIndex;
            state.game = new Chess(state.fenHistory[moveIndex + 1]);

            io.to(roomID).emit(ACTIONS.CHESS_GO_TO_MOVE, {
                fen: state.fenHistory[moveIndex + 1],
                currentMoveIndex: moveIndex,
                history: state.history,
                fenHistory: state.fenHistory
            });
        }
    });

    socket.on(ACTIONS.CHESS_GAME_OVER, ({ roomID, message }) => {
        console.log(`[GAME OVER] Room: ${roomID}, Message: ${message}`);
        io.to(roomID).emit(ACTIONS.CHESS_GAME_OVER, { message });
    });
});


server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started on port ${PORT}`);
});
