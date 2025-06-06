import React, {useEffect, useState} from "react";
import Sidebar from "../components/teacherPage/TeacherSidebar.jsx";
import Table from "../components/UsersTable";
import axios from "../axiosInstance.js";

import {
    LessonModal, DeleteLessonModal, AddTaskModal, AddGroupModal, DeleteGroupModal,
    UpdateGroupNameModal, AddStudentToGroupModal, DeleteStudentFromGroupModal
} from "../components/modals/teacher";
import useTeacherPageState from "../hooks/teacher/useTeacherPageState.js";
import {
    handleAddLesson,
    handleSubmitAttendance,
    handleUpdateLesson
} from "../handlers/teacher/lessonHandlers.js";
import {handleGetGroupPage} from "../handlers/teacher/groupHandlers.js";
import GroupsSection from "../components/teacherPage/GroupsSection.jsx";
import GroupDetails from "../components/teacherPage/GroupDetails.jsx";
import Footer from "../components/Footer.jsx";
import LessonTasksTable from "../components/teacherPage/LessonTasksTable.jsx";
import LessonAttendanceTable from "../components/teacherPage/LessonAttendanceTable.jsx";
import LessonPerformanceTable from "../components/teacherPage/LessonPerformanceTable.jsx";
import TasksTable from "../components/TasksTable.jsx";
import CheckTaskModal from "../components/modals/teacher/lesson/CheckTaskModal.jsx";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faPen, faPlus} from "@fortawesome/free-solid-svg-icons";
import WeeklySchedule from "../components/teacherPage/WeeklySchedule.jsx";
import {handleLogout} from "../handlers/handleLogout.jsx";
import {useNavigate} from "react-router-dom";

const TeacherPage = () => {
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");

    const onAddLesson = (data, closeModal) =>
        handleAddLesson(data, setLessons, closeModal);

    const onUpdateLesson = (data, closeModal) =>
        handleUpdateLesson(data, setSelectedLesson, closeModal);

    const {
        activeTab, setActiveTab,
        selectedLesson, setSelectedLesson,
        lessons, setLessons,
        isAddLessonModalOpen, setAddLessonModalOpen,
        isDeleteLessonModalOpen, setDeleteLessonModalOpen,
        isUpdateLessonModalOpen, setUpdateLessonModalOpen,
        tasks, setTasks,
        selectedTask, setSelectedTask,
        isCheckTaskModalOpen ,setCheckTaskModalOpen,
        isAddTaskModalOpen, setAddTaskModalOpen,
        students, setStudents,
        selectedStudent, setSelectedStudent,
        isAddStudentToGroupModalOpen, setAddStudentToGroupModalOpen,
        isDeleteStudentFromGroupModalOpen, setDeleteStudentFromGroupModalOpen,
        selectedGroup, setSelectedGroup,
        groups, setGroups,
        isAddGroupModalOpen, setAddGroupModalOpen,
        isDeleteGroupModalOpen, setDeleteGroupModalOpen,
        isUpdateGroupNameModalOpen, setUpdateGroupNameModalOpen
    } = useTeacherPageState();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get(`/me`);
                setCurrentUser(response.data);

                if (response.data.passwordTemporary) {
                    navigate("/force-password-change");
                }

                console.log("Current user received")
            } catch (error) {
                console.error("Error fetching current user", error);
            }
        };

        fetchCurrentUser().then();
    }, []);

    useEffect(() => {
        if (!currentUser?.id) return;

        const fetchStudents = async () => {
            try {
                const response = await axios.get(`/${currentUser.id}/students`);
                setStudents(response.data);
                console.log("Students received");
            } catch (error) {
                console.error("Error fetching students", error);
            }
        };

        const fetchGroups = async () => {
            try {
                const response = await axios.get(`/teacher/${currentUser.id}/groups`);
                setGroups(response.data);
                console.log("Groups received");
            } catch (error) {
                console.error("Error fetching groups", error);
            }
        };

        const fetchLessons = async () => {
            try {
                const response = await axios.get(`/teacher/${currentUser.id}/lessons`);
                setLessons(response.data);
                console.log("Lessons received");
            } catch (error) {
                console.error("Error fetching groups", error);
            }
        };

        const fetchTasks = async () => {
            try {
                const response = await axios.get(`/teacher/tasks`);
                setTasks(response.data);
                console.log("Tasks received");
            }  catch(error) {
                console.error("Error fetching tasks", error);
            }
        };

        fetchStudents().then();
        fetchGroups().then();
        fetchLessons().then();
        fetchTasks().then();
    }, [currentUser]);

    const getStudyRoom = (lessonId) => {
        window.open(`/room/${lessonId}?role=${currentUser.role}`, "_blank");
    }

    return (
        <div className="container">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={() =>
                    handleLogout().then()
                }
                currentUser={currentUser}
            />
            <main className="main-content">

                <header className="header">
                    {activeTab === "groups" && (
                        <>
                            <h1>All Groups</h1>
                            <button className="btn" onClick={() => setAddGroupModalOpen(true)}>
                                <FontAwesomeIcon icon={faPlus} /> Add Group
                            </button>
                        </>
                    )}

                    {activeTab === "group" && (
                        <>
                            <button onClick={() => setActiveTab("groups")} className="btn-back">
                                <FontAwesomeIcon icon={faArrowLeft}/>
                            </button>
                            <h1>
                                {selectedGroup.groupName}
                            </h1>
                            <button className="btn-back" onClick={() => setUpdateGroupNameModalOpen(true)}>
                                <FontAwesomeIcon icon={faPen}/>
                            </button>
                        </>
                    )}

                    {activeTab === "lesson" && (
                        <>
                            <button onClick={() => setActiveTab("lessons")} className="btn-back">
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </button>
                            <button className="btn" onClick={() => getStudyRoom(selectedLesson.id)}>
                                Study room
                            </button>
                        </>
                    )}

                    {activeTab === "tasks" && (
                        <h1>All Tasks</h1>
                    )}

                </header>

                {activeTab === "lessons" && (
                    <WeeklySchedule
                        scheduleData={lessons}
                        onAddLesson={() => setAddLessonModalOpen(true)}
                        setSelectedLesson={setSelectedLesson}
                        setActiveTab={setActiveTab}
                        setDeleteLessonModalOpen={setDeleteLessonModalOpen}
                    />
                )}

                {activeTab === "lesson" && (
                    <>
                        <div className="header">
                            <h2>
                                {selectedLesson.groupName} (
                                {new Date(selectedLesson.startTime).toLocaleDateString()}&nbsp;
                                {new Date(selectedLesson.startTime).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                                &mdash;
                                {new Date(selectedLesson.endTime).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                                )
                            </h2>
                            <button className="btn-back" onClick={() => setUpdateLessonModalOpen(true)}>
                                <FontAwesomeIcon icon={faPen}/>
                            </button>
                        </div>

                        <LessonTasksTable
                            tasks={selectedLesson.tasks}
                            onCheck={(task) => {
                                setSelectedTask(task)
                                setCheckTaskModalOpen(true);
                            }}
                            onAddTask={() => setAddTaskModalOpen(true)}
                        />

                        <LessonAttendanceTable
                            studentInfoDTOs={selectedLesson.studentInfoDTOs}
                            selectedLesson={selectedLesson}
                            setSelectedLesson={setSelectedLesson}
                            handleSubmitAttendance={handleSubmitAttendance}
                        />

                        <LessonPerformanceTable studentInfoDTOs={selectedLesson.studentInfoDTOs} />
                    </>
                )}

                {activeTab === "students" && (
                    <>
                        <h1>All Students</h1>
                        <input
                            type="text"
                            placeholder="Search by name or email"
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Table
                            data={students}
                            searchTerm={searchTerm}
                        />
                    </>
                )}

                {activeTab === "groups" && (
                    <GroupsSection
                        groups={groups}
                        handleGetGroupPage={(id) =>
                            handleGetGroupPage(id, setSelectedGroup, setActiveTab)
                        }
                        setSelectedGroup={setSelectedGroup}
                        setDeleteGroupModalOpen={setDeleteGroupModalOpen}
                    />
                )}

                {activeTab === "group" && (
                    <GroupDetails
                        selectedGroup={selectedGroup}
                        setSelectedStudent={setSelectedStudent}
                        setDeleteStudentFromGroupModalOpen={setDeleteStudentFromGroupModalOpen}
                        onAddStudent={() => setAddStudentToGroupModalOpen(true)}
                    />
                )}

                {activeTab === "tasks" && (
                    <TasksTable
                        data={tasks}
                        onCheck={(task) => {
                            setSelectedTask(task)
                            setCheckTaskModalOpen(true);
                        }}
                    />
                )}
            </main>
            <Footer />
            {isAddLessonModalOpen && (
                <LessonModal
                    mode="add"
                    groups={groups}
                    currentUser={currentUser}
                    onSubmit={onAddLesson}
                    setModalOpen={setAddLessonModalOpen}
                    onClose={() => setAddLessonModalOpen(false)}
                />
            )}

            {isDeleteLessonModalOpen && (
                <DeleteLessonModal
                    onClose={() => setDeleteLessonModalOpen(false)}
                    selectedLesson={selectedLesson}
                    setLessons={setLessons}
                    setDeleteLessonModalOpen={setDeleteLessonModalOpen}
                />
            )}

            {isUpdateLessonModalOpen && (
                <LessonModal
                    mode="update"
                    groups={groups}
                    currentUser={currentUser}
                    initialData={selectedLesson}
                    onSubmit={onUpdateLesson}
                    setModalOpen={setUpdateLessonModalOpen}
                    onClose={() => setUpdateLessonModalOpen(false)}
                />
            )}

            {isAddTaskModalOpen && (
                <AddTaskModal
                    onClose={() => setAddTaskModalOpen(false)}
                    selectedLesson={selectedLesson}
                    setSelectedLesson={setSelectedLesson}
                    setAddTaskModalOpen={setAddTaskModalOpen}
                    tasks={tasks}
                />
            )}

            {isCheckTaskModalOpen && (
                <CheckTaskModal
                    onClose={() => setCheckTaskModalOpen(false)}
                    selectedTask={selectedTask}
                />
            )}

            {isAddGroupModalOpen && (
                <AddGroupModal
                    onClose={() => setAddGroupModalOpen(false)}
                    currentUser={currentUser}
                    setGroups={setGroups}
                    setAddGroupModalOpen={setAddGroupModalOpen}
                />
            )}

            {isDeleteGroupModalOpen && (
                <DeleteGroupModal
                    onClose={() => setDeleteGroupModalOpen(false)}
                    selectedGroup={selectedGroup}
                    setGroups={setGroups}
                    setDeleteGroupModalOpen={setDeleteGroupModalOpen}
                />
            )}

            {isUpdateGroupNameModalOpen && (
                <UpdateGroupNameModal
                    onClose={() => setUpdateGroupNameModalOpen(false)}
                    selectedGroup={selectedGroup}
                    setSelectedGroup={setSelectedGroup}
                    setUpdateGroupNameModalOpen={setUpdateGroupNameModalOpen}
                />
            )}

            {isAddStudentToGroupModalOpen && (
                <AddStudentToGroupModal
                    onClose={() => setAddStudentToGroupModalOpen(false)}
                    students={students}
                    selectedGroup={selectedGroup}
                    setAddStudentToGroupModalOpen={setAddStudentToGroupModalOpen}
                    setSelectedGroup={setSelectedGroup}
                />
            )}

            {isDeleteStudentFromGroupModalOpen && (
                <DeleteStudentFromGroupModal
                    onClose={() => setDeleteStudentFromGroupModalOpen(false)}
                    selectedGroup={selectedGroup}
                    selectedStudent={selectedStudent}
                    setSelectedGroup={setSelectedGroup}
                    setDeleteStudentFromGroupModalOpen={setDeleteStudentFromGroupModalOpen}
                />
            )}
        </div>
    );
};

export default TeacherPage;