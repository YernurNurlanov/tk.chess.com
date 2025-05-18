import {useEffect, useRef, useCallback, useState} from 'react';
import freeice from 'freeice';
import useStateWithCallback from './useStateWithCallback.jsx';
import socket from '../../socket/index.js';
import Actions from '../../socket/actions.js';

export const LOCAL_VIDEO = 'LOCAL_VIDEO';


export default function UseWebRTC(roomID, role) {
    const [clients, updateClients] = useStateWithCallback([]);

    const addNewClient = useCallback((newClient, cb) => {
        updateClients(list => {
            if (!list.includes(newClient)) {
                return [...list, newClient]
            }

            return list;
        }, cb);
    }, [clients, updateClients]);

    const peerConnections = useRef({});
    const localMediaStream = useRef(null);
    const peerMediaElements = useRef({
        [LOCAL_VIDEO]: null,
    });

    const [isMicOn, setMicOn] = useState(true);
    const [isCameraOn, setCameraOn] = useState(true);

    const toggleAudio = () => {
        const audioTrack = localMediaStream.current?.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setMicOn(audioTrack.enabled);
        }
    };

    const toggleVideo = () => {
        const videoTrack = localMediaStream.current?.getVideoTracks()[0];
        if (!videoTrack) return;

        const isEnabled = !videoTrack.enabled;
        videoTrack.enabled = isEnabled;
        setCameraOn(isEnabled);

        const localVideoEl = peerMediaElements.current[LOCAL_VIDEO];
        if (localVideoEl) {
            if (!isEnabled) {
                localVideoEl.srcObject = null;
            } else {
                localVideoEl.srcObject = localMediaStream.current;
            }
        }
    };

    useEffect(() => {
        async function handleNewPeer({peerID, createOffer}) {
            if (peerID in peerConnections.current) {
                return console.warn(`Already connected to peer ${peerID}`);
            }

            peerConnections.current[peerID] = new RTCPeerConnection({
                iceServers: freeice(),
            });

            peerConnections.current[peerID].onicecandidate = event => {
                if (event.candidate) {
                    socket.emit(Actions.RELAY_ICE, {
                        peerID,
                        iceCandidate: event.candidate,
                    });
                }
            }

            let tracksNumber = 0;
            peerConnections.current[peerID].ontrack = ({streams: [remoteStream]}) => {
                tracksNumber++

                if (tracksNumber === 2) { // video & audio tracks received
                    tracksNumber = 0;
                    addNewClient(peerID, () => {
                        if (peerMediaElements.current[peerID]) {
                            peerMediaElements.current[peerID].srcObject = remoteStream;
                        } else {
                            // FIX LONG RENDER IN CASE OF MANY CLIENTS
                            let settled = false;
                            const interval = setInterval(() => {
                                if (peerMediaElements.current[peerID]) {
                                    peerMediaElements.current[peerID].srcObject = remoteStream;
                                    settled = true;
                                }

                                if (settled) {
                                    clearInterval(interval);
                                }
                            }, 1000);
                        }
                    });
                }
            }

            localMediaStream.current.getTracks().forEach(track => {
                peerConnections.current[peerID].addTrack(track, localMediaStream.current);
            });

            if (createOffer) {
                const offer = await peerConnections.current[peerID].createOffer();

                await peerConnections.current[peerID].setLocalDescription(offer);

                socket.emit(Actions.RELAY_SDP, {
                    peerID,
                    sessionDescription: offer,
                });
            }
        }

        socket.on(Actions.ADD_PEER, handleNewPeer);

        return () => {
            socket.off(Actions.ADD_PEER);
        }
    }, []);

    useEffect(() => {
        async function setRemoteMedia({peerID, sessionDescription: remoteDescription}) {
            await peerConnections.current[peerID]?.setRemoteDescription(
                new RTCSessionDescription(remoteDescription)
            );

            if (remoteDescription.type === 'offer') {
                const answer = await peerConnections.current[peerID].createAnswer();

                await peerConnections.current[peerID].setLocalDescription(answer);

                socket.emit(Actions.RELAY_SDP, {
                    peerID,
                    sessionDescription: answer,
                });
            }
        }

        socket.on(Actions.SESSION_DESCRIPTION, setRemoteMedia)

        return () => {
            socket.off(Actions.SESSION_DESCRIPTION);
        }
    }, []);

    useEffect(() => {
        socket.on(Actions.ICE_CANDIDATE, ({peerID, iceCandidate}) => {
            peerConnections.current[peerID]?.addIceCandidate(
                new RTCIceCandidate(iceCandidate)
            ).then();
        });

        return () => {
            socket.off(Actions.ICE_CANDIDATE);
        }
    }, []);

    useEffect(() => {
        const handleRemovePeer = ({peerID}) => {
            if (peerConnections.current[peerID]) {
                peerConnections.current[peerID].close();
            }

            delete peerConnections.current[peerID];
            delete peerMediaElements.current[peerID];

            updateClients(list => list.filter(c => c !== peerID));
        };

        socket.on(Actions.REMOVE_PEER, handleRemovePeer);

        return () => {
            socket.off(Actions.REMOVE_PEER);
        }
    }, []);

    useEffect(() => {
        async function startCapture() {
            localMediaStream.current = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: {
                    width: 1280,
                    height: 720,
                }
            });

            addNewClient(LOCAL_VIDEO, () => {
                const localVideoElement = peerMediaElements.current[LOCAL_VIDEO];

                if (localVideoElement) {
                    localVideoElement.volume = 0;
                    localVideoElement.srcObject = localMediaStream.current;
                }
            });
        }
        startCapture()
            .then(() => socket.emit(Actions.JOIN, {room: roomID, role}))
            .catch(e => console.error('Error getting userMedia:', e));

        return () => {
            if (!localMediaStream.current) {
                console.warn('Local media stream is not ready yet');
                return;
            }

            localMediaStream.current.getTracks().forEach(track => track.stop());

            socket.emit(Actions.LEAVE);
        };
    }, [roomID]);

    const provideMediaRef = useCallback((id, node) => {
        peerMediaElements.current[id] = node;
    }, []);

    return {
        clients,
        provideMediaRef,
        toggleAudio,
        toggleVideo,
        isMicOn,
        isCameraOn
    };
}