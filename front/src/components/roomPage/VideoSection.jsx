import React from "react";
import { LOCAL_VIDEO } from "../../hooks/useWebRTC.jsx";

export default function VideoSection({ mainClientID, secondaryClients, provideMediaRef,
                                         toggleAudio, toggleVideo, isMicOn, isCameraOn }) {
    return (
        <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '45%',
            height: '50%',
            display: 'flex',
            background: '#000',
            padding: '1rem',
            boxSizing: 'border-box',
            borderRadius: '8px',
        }}>
            {/* Главное видео слева */}
            <div style={{
                flex: 1,
                height: '100%',
                marginRight: '1rem'
            }}>
                {mainClientID && (
                    <div key={mainClientID} style={{ width: '100%', height: '100%' }}>
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
                {/* 🔘 Кнопки под главным видео */}
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                    <button onClick={toggleAudio}>
                        {isMicOn ? '🔇 Выкл. микрофон' : '🎤 Вкл. микрофон'}
                    </button>
                    <button onClick={toggleVideo}>
                        {isCameraOn ? '📷 Выкл. камеру' : '🎥 Вкл. камеру'}
                    </button>
                </div>
            </div>

            {/* Второстепенные видео */}
            <div style={{
                width: '160px',
                height: '100%',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
            }}>
                {secondaryClients.map(clientID => (
                    <div key={clientID} style={{ width: '100%', aspectRatio: '4 / 3' }}>
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
    );
}