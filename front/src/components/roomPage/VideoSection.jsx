import React from "react";
import { LOCAL_VIDEO } from "../../hooks/server/useWebRTC.jsx";
import styles from "../../styles/roomPage.module.css";

export default function VideoSection({ mainClientID, secondaryClients, provideMediaRef,
                                         toggleAudio, toggleVideo, isMicOn, isCameraOn }) {
    return (
        <>
            <div className={styles["video-section"]}>
                <div style={{
                    flex: 1,
                    height: '100%',
                    marginRight: '1rem'
                }}>
                    {mainClientID && (
                        <div key={mainClientID} style={{width: '100%', height: '100%'}}>
                            <video
                                ref={instance => provideMediaRef(mainClientID, instance)}
                                autoPlay
                                playsInline
                                muted={mainClientID === LOCAL_VIDEO}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '8px'
                                }}
                            />
                        </div>
                    )}

                </div>
                <div style={{
                    width: '160px',
                    height: '100%',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                }}>
                    {secondaryClients.map(clientID => (
                        <div key={clientID} style={{width: '100%', aspectRatio: '4 / 3'}}>
                            <video
                                ref={instance => provideMediaRef(clientID, instance)}
                                autoPlay
                                playsInline
                                muted={clientID === LOCAL_VIDEO}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    background: '#444'
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div style={{marginTop: "10px", marginBottom: "10px"}}>
                <button className="btn" style={{marginRight: "10px"}} onClick={toggleAudio}>
                    {isMicOn ? '🔇 Microphone off' : '🎤 Microphone on'}
                </button>
                <button className="btn" onClick={toggleVideo}>
                    {isCameraOn ? '📷 Camera off' : '🎥 Camera on'}
                </button>
            </div>
        </>
    );
}