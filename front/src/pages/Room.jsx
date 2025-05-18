import React, {useEffect} from "react";
import {useLocation, useParams} from 'react-router';
import useWebRTC from '../hooks/server/useWebRTC.jsx';
import VideoSection from "../components/roomPage/VideoSection.jsx";
import ChessBoardSection from "../components/roomPage/ChessBoardSection.jsx";
import styles from "../styles/roomPage.module.css"
import MaterialsModal from "../components/modals/room/MaterialsModal.jsx";
import NewPositionModal from "../components/modals/room/NewPositionModal.jsx";
import axios from "../axiosInstance.js";

export default function Room() {
    const {id: roomID} = useParams();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const role = query.get('role') || 'ROLE_STUDENT';

    const {
        clients, provideMediaRef, toggleAudio, toggleVideo, isMicOn, isCameraOn
    } = useWebRTC(roomID, role);

    const [tasks, setTasks] = React.useState(null);
    const [isMaterialsModalOpen, setMaterialsModalOpen] = React.useState(false);
    const [isNewPositionModalOpen, setNewPositionModalOpen] = React.useState(false);

    const mainClientID = clients[0]; // Первый — основной
    const secondaryClients = clients.slice(1);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`/teacher/tasks`);
                setTasks(response.data);
                console.log("Tasks received")
            } catch (error) {
                console.error("Error fetching tasks", error);
            }
        };

        fetchTasks().then();
    }, []);

    return (
        <div className={styles["page-container"]}>
            {role === "ROLE_TEACHER" && (
                <header className={styles["header"]}>
                    <button onClick={() => setMaterialsModalOpen(true)}>
                        Materials
                    </button>
                    <button onClick={() => setNewPositionModalOpen(true)}>
                        Set your position
                    </button>
                </header>
            )}
            <div className={styles["main-content"]}>
                <div className={styles["chessboard-section"]}>
                    <ChessBoardSection
                        roomID={roomID}
                    />
                </div>
                <div>
                    <VideoSection
                        mainClientID={mainClientID}
                        secondaryClients={secondaryClients}
                        provideMediaRef={provideMediaRef}
                        toggleAudio={toggleAudio}
                        toggleVideo={toggleVideo}
                        isMicOn={isMicOn}
                        isCameraOn={isCameraOn}
                    />
                </div>
            </div>
            {isMaterialsModalOpen && (
                <MaterialsModal
                    onClose={() => setMaterialsModalOpen(false)}
                    materials={tasks}
                    roomId={roomID}
                />
            )}

            {isNewPositionModalOpen && (
                <NewPositionModal
                    onClose={() => setNewPositionModalOpen(false)}
                    roomId={roomID}
                />
            )}
        </div>

    );
}