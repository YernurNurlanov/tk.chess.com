import React, {useEffect} from "react";
import axios from "../axiosInstance.js";
import LessonsSection from "../components/studentPage/LessonsSection.jsx";
import Footer from "../components/Footer.jsx";
import StudentSidebar from "../components/studentPage/StudentSidebar.jsx";
import useStudentPageState from "../hooks/useStudentPageState.js";
import {handleGetLessonTasks} from "../handlers/student/lessonHandlers.js";
import TasksSection from "../components/studentPage/TasksSection.jsx";
import {handleLogout} from "../handlers/handleLogout.jsx";
import {useNavigate} from "react-router-dom";

const StudentPage = () => {
    const navigate = useNavigate();

    const {
        activeTab, setActiveTab,
        currentUser, setCurrentUser,
        lessons,setLessons,
        selectedLesson, setSelectedLesson,
        lessonTasks, setLessonTasks
    } = useStudentPageState();

    useEffect(() => {
        const fetchCurrentStudent = async () => {
            try {
                const response = await axios.get("/me");
                setCurrentUser(response.data);

                if (response.data.passwordTemporary) {
                    navigate("/force-password-change");
                }

                console.log("Current user received")
            } catch (error) {
                console.error("Error fetching current user", error);
            }
        };
        fetchCurrentStudent().then();
    }, []);

    useEffect(() => {
        if (!currentUser?.id) return;

        const fetchLessons = async () => {
            try {
                const response = await axios.get(`/student/${currentUser.id}/lessons`);
                setLessons(response.data);
                console.log("Lessons received");
            } catch (error) {
                console.error("Error fetching lessons", error);
            }
        };

        fetchLessons().then();
    }, [currentUser]);

    return (
        <div className={"container"}>
            <StudentSidebar
                currentUser={currentUser}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={() =>
                    handleLogout().then()
                }
                userId={currentUser?.id}
            />
            <main className={"main-content"}>
                {activeTab === "lessons" && (
                    <LessonsSection
                        lessons={lessons}
                        onTasks={(lesson) => {
                            setSelectedLesson(lesson)
                            handleGetLessonTasks( currentUser.id, lesson.id, setLessonTasks, setActiveTab).then();
                        }}
                    />
                )}

                {activeTab === "tasks" && (
                    <TasksSection
                        studentId={currentUser.id}
                        selectedLesson={selectedLesson}
                        lessonTasks={lessonTasks}
                        setLessonTasks={setLessonTasks}
                    />
                )}
            </main>
            <Footer />
        </div>

    )
}

export default StudentPage;