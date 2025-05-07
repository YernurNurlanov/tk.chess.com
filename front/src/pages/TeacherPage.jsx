import React, {useEffect, useState} from "react";
import Sidebar from "../components/TeacherSidebar";
import Table from "../components/UsersTable";
import "../styles.css"
import axios from "axios";

import {
    AddLessonModal, UpdateLessonModal, DeleteLessonModal, AddTaskModal, AddGroupModal,
    DeleteGroupModal, UpdateGroupNameModal, AddStudentToGroupModal, DeleteStudentFromGroupModal
} from "../components/modals/teacher";
import useTeacherPageState from "../hooks/teacher/useTeacherPageState.js";
import {handleGetLessonPage, handleSubmitAttendance} from "../handlers/teacher/lessonHandlers.js";
import {handleGetGroupPage} from "../handlers/teacher/groupHandlers.js";
import LessonsSection from "../components/teacherPage/LessonsSection.jsx";
import GroupsSection from "../components/teacherPage/GroupsSection.jsx";
import GroupDetails from "../components/teacherPage/GroupDetails.jsx";
import Footer from "../components/Footer.jsx";
import LessonTasksTable from "../components/teacherPage/LessonTasksTable.jsx";
import LessonAttendanceTable from "../components/teacherPage/LessonAttendanceTable.jsx";
import LessonPerformanceTable from "../components/teacherPage/LessonPerformanceTable.jsx";

const TeacherPage = () => {
    const url = import.meta.env.VITE_API_URL;
    const [currentUser, setCurrentUser] = useState(null);

    const {
        activeTab, setActiveTab,
        selectedLesson, setSelectedLesson,
        lessons, setLessons,
        isAddLessonModalOpen, setAddLessonModalOpen,
        isDeleteLessonModalOpen, setDeleteLessonModalOpen,
        isUpdateLessonModalOpen, setUpdateLessonModalOpen,
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
                const response = await axios.get(`${url}/me`, {
                    withCredentials: true,
                });
                setCurrentUser(response.data);
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
                const response = await axios.get(`${url}/${currentUser.id}/students`, {
                    withCredentials: true,
                });
                setStudents(response.data);
                console.log("Students received");
            } catch (error) {
                console.error("Error fetching students", error);
            }
        };

        const fetchGroups = async () => {
            try {
                const response = await axios.get(`${url}/teacher/${currentUser.id}/groups`, {
                    withCredentials: true,
                });
                setGroups(response.data);
                console.log("Groups received");
            } catch (error) {
                console.error("Error fetching groups", error);
            }
        };

        const fetchLessons = async () => {
            try {
                const response = await axios.get(`${url}/teacher/${currentUser.id}/lessons`, {
                    withCredentials: true,
                });
                setLessons(response.data);
                console.log("Lessons received");
            } catch (error) {
                console.error("Error fetching groups", error);
            }
        };

        fetchStudents().then();
        fetchGroups().then();
        fetchLessons().then();
    }, [currentUser]);

    return (
        <div className="container">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={() =>
                    window.location.href = "/auth"
                }
            />

            <main className="main-content">

                <header className="header">
                    {activeTab === "lessons" && (
                        <button className="btn" onClick={() => setAddLessonModalOpen(true)}>
                            Add New Lesson
                        </button>
                    )}
                    {activeTab === "groups" && (
                        <button className="btn" onClick={() => setAddGroupModalOpen(true)}>
                            Add Group
                        </button>
                    )}

                    {activeTab === "group" && (
                        <>
                            <h2>
                                {selectedGroup.groupName}
                            </h2>
                            <button className="btn" onClick={() => setUpdateGroupNameModalOpen(true)}>
                                Rename
                            </button>
                            <h3>
                                All Students
                            </h3>
                            <button className="btn" onClick={() => setAddStudentToGroupModalOpen(true)}>
                                Add Student
                            </button>
                        </>
                    )}

                    {activeTab === "lesson" && (
                        <>
                            <h2>
                                {selectedLesson.groupName}
                                ( Start: {new Date(selectedLesson.startTime).toLocaleDateString()} {new Date(selectedLesson.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},
                                End: {new Date(selectedLesson.endTime).toLocaleDateString()} {new Date(selectedLesson.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} )
                            </h2>
                            <button className="btn" onClick={() => setUpdateLessonModalOpen(true)}>
                                Update lesson
                            </button>
                        </>
                    )}

                </header>

                {activeTab === "lessons" && (
                    <LessonsSection
                        lessons={lessons}
                        setSelectedLesson={setSelectedLesson}
                        setDeleteLessonModalOpen={setDeleteLessonModalOpen}
                        handleGetLessonPage={(id) => handleGetLessonPage(id, setSelectedLesson, setActiveTab)}
                    />
                )}

                {activeTab === "lesson" && (
                    <>
                        <div style={{ display: "flex" }}>
                            <h3>Tasks</h3>
                            <button className="btn" onClick={() => setAddTaskModalOpen(true)}>
                                Add Task
                            </button>
                        </div>

                        <LessonTasksTable tasks={selectedLesson.tasks} />

                        <h3>Attendance</h3>
                        <LessonAttendanceTable
                            studentInfoDTOs={selectedLesson.studentInfoDTOs}
                            selectedLesson={selectedLesson}
                            setSelectedLesson={setSelectedLesson}
                            handleSubmitAttendance={handleSubmitAttendance}
                        />

                        <h3>Performance</h3>
                        <LessonPerformanceTable studentInfoDTOs={selectedLesson.studentInfoDTOs} />
                    </>
                )}

                {activeTab === "students" && (
                    <section className="students-list">
                        <h1>All Students</h1>
                        <Table
                            data={students}
                        />
                    </section>
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
                    />
                )}

                <Footer />
            </main>

            {isAddLessonModalOpen && (
                <AddLessonModal
                    onClose={() => setAddLessonModalOpen(false)}
                    currentUser={currentUser}
                    groups={groups}
                    setLessons={setLessons}
                    setAddLessonModalOpen={setAddLessonModalOpen}
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
                <UpdateLessonModal
                    onClose={() => setUpdateLessonModalOpen(false)}
                    selectedLesson={selectedLesson}
                    groups={groups}
                    setSelectedLesson={setSelectedLesson}
                    setUpdateLessonModalOpen={setUpdateLessonModalOpen}
                />
            )}

            {isAddTaskModalOpen && (
                <AddTaskModal
                    onClose={() => setAddTaskModalOpen(false)}
                    selectedLesson={selectedLesson}
                    setSelectedLesson={setSelectedLesson}
                    setAddTaskModalOpen={setAddTaskModalOpen}
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
            {/*--------------------------------------------------------*/}
            {isAddStudentToGroupModalOpen && (
                <AddStudentToGroupModal
                    onClose={() => setAddStudentToGroupModalOpen(false)}
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