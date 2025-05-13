import {io} from 'socket.io-client';

const HOST = import.meta.env.VITE_SERVER_URL;

const options = {
    forceNew: true,
    reconnectionAttempts: Infinity,
    timeout : 10000,
    transports : ["websocket"]
}

const socket = io(`http://${HOST}:3001`, options);

export default socket;