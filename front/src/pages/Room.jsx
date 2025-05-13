import React from "react";
import {useLocation, useParams} from 'react-router';
import useWebRTC from '../hooks/useWebRTC.jsx';
import VideoSection from "../components/roomPage/VideoSection.jsx";
import ChessBoardSection from "../components/roomPage/ChessBoardSection.jsx";

// function layout(clientsNumber = 1) {
//     const pairs = Array.from({length: clientsNumber})
//         .reduce((acc, next, index, arr) => {
//             if (index % 2 === 0) {
//                 acc.push(arr.slice(index, index + 2));
//             }
//
//             return acc;
//         }, []);
//
//     const rowsNumber = pairs.length;
//     const height = `${100 / rowsNumber}%`;
//
//     return pairs.map((row, index, arr) => {
//
//         if (index === arr.length - 1 && row.length === 1) {
//             return [{
//                 width: '100%',
//                 height,
//             }];
//         }
//
//         return row.map(() => ({
//             width: '50%',
//             height,
//         }));
//     }).flat();
// }

export default function Room() {
    const {id: roomID} = useParams();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const role = query.get('role') || 'ROLE_STUDENT';

    const {
        clients, provideMediaRef, toggleAudio, toggleVideo, isMicOn, isCameraOn
    } = useWebRTC(roomID, role);
    //const videoLayout = layout(clients.length);

    const mainClientID = clients[0]; // Первый — основной
    const secondaryClients = clients.slice(1);

    return (
        <>
            <ChessBoardSection
                roomID={roomID}
            />
            <VideoSection
                mainClientID={mainClientID}
                secondaryClients={secondaryClients}
                provideMediaRef={provideMediaRef}
                toggleAudio={toggleAudio}
                toggleVideo={toggleVideo}
                isMicOn={isMicOn}
                isCameraOn={isCameraOn}
            />
        </>

    );
}