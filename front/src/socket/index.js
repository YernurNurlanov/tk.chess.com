import {io} from 'socket.io-client';

const URL = import.meta.env.VITE_VIDEO_URL;

const options = {
    forceNew: true,
    reconnectionAttempts: Infinity,
    timeout : 10000,
    transports : ["websocket"]
}

const socket = io(URL, options);

export default socket;