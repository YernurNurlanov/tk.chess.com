import React, {useEffect} from "react";
import {useLocation, useParams} from 'react-router';
import useWebRTC from '../hooks/server/useWebRTC.jsx';
import ChessBoardSection from "../components/roomPage/ChessBoardSection.jsx";
import styles from "../styles/roomPage.module.css"
import MaterialsModal from "../components/modals/room/MaterialsModal.jsx";
import NewPositionModal from "../components/modals/room/NewPositionModal.jsx";
import axios from "../axiosInstance.js";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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

    const mainClientID = clients[0];
    const secondaryClients = clients.slice(1);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`/teacher/lessons/tasks`);
                setTasks(response.data);
                console.log("Tasks received")
            } catch (error) {
                console.error("Error fetching tasks", error);
            }
        };

        if (role === "ROLE_TEACHER") {
            fetchTasks().then();
        }
    }, []);

    return (
        <div className={styles["page-container"]}>
            <header className={styles["header"]}>
                {role === "ROLE_TEACHER" ? (
                    <>
                        <button className="btn" onClick={() => window.location.href = "/teacher"}>
                            <FontAwesomeIcon icon={faArrowLeft}/>
                        </button>
                        <button className="btn" onClick={() => setMaterialsModalOpen(true)}>
                            Materials
                        </button>
                        <button className="btn" onClick={() => setNewPositionModalOpen(true)}>
                            Set your position
                        </button>
                    </>
                ) : (
                    <button className="btn" onClick={() => window.location.href = "/student"}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                )}
            </header>
            <ChessBoardSection
                roomID={roomID}
                mainClientID={mainClientID}
                secondaryClients={secondaryClients}
                provideMediaRef={provideMediaRef}
                toggleAudio={toggleAudio}
                toggleVideo={toggleVideo}
                isMicOn={isMicOn}
                isCameraOn={isCameraOn}
            />
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