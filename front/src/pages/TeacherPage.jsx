import React, {useEffect, useState} from "react";
import Sidebar from "../components/TeacherSidebar";
import Modal from "../components/Modal";
import Table from "../components/UsersTable";
import "../styles.css"
import axios from "axios";

const TeacherPage = () => {
    const url = import.meta.env.VITE_API_URL;
    const [currentUser, setCurrentUser] = useState(null);

    const [activeTab, setActiveTab] = useState("lessons");

    const [selectedLesson, setSelectedLesson] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [isAddLessonModalOpen, setAddLessonModalOpen] = useState(false);
    const [isDeleteLessonModalOpen, setDeleteLessonModalOpen] = useState(false);
    const [isUpdateLessonModalOpen, setUpdateLessonModalOpen] = useState(false);
    const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false);

    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isAddStudentToGroupModalOpen, setAddStudentToGroupModalOpen] = useState(false);
    const [isDeleteStudentFromGroupModalOpen, setDeleteStudentFromGroupModalOpen] = useState(false);

    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groups, setGroups] = useState([]);
    const [isAddGroupModalOpen, setAddGroupModalOpen] = useState(false);
    const [isDeleteGroupModalOpen, setDeleteGroupModalOpen] = useState(false);
    const [isUpdateGroupNameModalOpen, setUpdateGroupNameModalOpen] = useState(false);

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

    const handleAddLesson = async (newLesson) => {
        try {
            const response = await axios.post(`${url}/teacher/lessons`, newLesson, {
                withCredentials: true,
            })
            alert("Lesson added successfully");
            setLessons([...lessons, response.data]);
        } catch (error) {
            console.error("Error adding lesson: ", error);
            alert(error.response.data);
        } finally {
            setAddLessonModalOpen(false);
        }
    };

    const handleDeleteLesson = async () => {
        try {
            const response = await axios.delete(`${url}/teacher/lessons/${selectedLesson.id}`, {
                withCredentials: true,
            });
            alert(response.data);
            setLessons(lessons.filter((lesson) => lesson.id !== selectedLesson.id));
        } catch (error) {
            console.error("Error deleting lesson: ", error);
            alert(error.response.data);
        } finally {
            setDeleteLessonModalOpen(false);
        }
    };

    const handleUpdateLesson = async (request) => {
        try {
            const response = await axios.put(`${url}/teacher/lessons`, request, {
                withCredentials: true,
            })
            alert("Lesson updated successfully");
            setSelectedLesson(response.data);
        } catch (error) {
            console.error("Error updating lesson: ", error);
            alert(error.response.data);
        } finally {
            setUpdateLessonModalOpen(false);
        }
    }

    const handleGetLessonPage = async (lessonId) => {
        try {
            const response = await axios.get(`${url}/teacher/lessons/${lessonId}`, {
                withCredentials: true,
            });
            setSelectedLesson(response.data);
            setActiveTab("lesson");
        } catch (error) {
            console.error("Error fetching lesson: ", error);
            alert(error.response.data);
        }
    };

    const handleSubmitAttendance = async (request) => {
        try {
            await axios.post(`${url}/teacher/attendance`, request, {
                withCredentials: true,
            });
            alert("Attendance submitted successfully");
        } catch (error) {
            console.error("Error submitting attendance: ", error);
            alert(error.response.data);
        }
    }

    const handleAddTask = async (request) => {
        try {
            const response = await axios.post(`${url}/teacher/tasks`,request ,{
                withCredentials: true,
            });
            alert("Task added successfully");
            setSelectedLesson((lesson) => ({
                ...lesson,
                tasks: response.data.tasks
            }));
        } catch (error) {
            console.error("Error adding task: ", error);
            alert(error.response.data);
        } finally {
            setAddTaskModalOpen(false);
        }
    }


    const handleAddGroup = async (newGroup) => {
        try {
            const response = await axios.post(`${url}/teacher/groups`, newGroup, {
                withCredentials: true,
            })
            alert("Group added successfully");
            setGroups([...groups, { id: response.data.id, ...response.data }]);
        } catch (error) {
            console.error("Error adding group: ", error);
            alert(error.response.data);
        } finally {
            setAddGroupModalOpen(false);
        }
    };

    const handleDeleteGroup = async () => {
        try {
            const response = await axios.delete(`${url}/teacher/groups/${selectedGroup.id}`, {
                withCredentials: true,
            });
            alert(response.data);
            setGroups(groups.filter((group) => group.id !== selectedGroup.id));
        } catch (error) {
            console.error("Error deleting group: ", error);
            alert(error.response.data);
        } finally {
            setDeleteGroupModalOpen(false);
        }
    };

    const handleGetGroupPage = async (groupId) => {
        try {
            const response = await axios.get(`${url}/teacher/groups/${groupId}`, {
                withCredentials: true,
            });
            setSelectedGroup(response.data);
            setActiveTab("group");
        } catch (error) {
            console.error("Error fetching group: ", error);
            alert(error.response.data);
        }
    };

    const handleUpdateGroupName = async (newGroup) => {
        try {
            const response = await axios.put(`${url}/teacher/groups`, newGroup, {
                withCredentials: true,
            })
            setSelectedGroup((group) => ({
                ...group,
                groupName: response.data.groupName
            }));
            alert("Group name updated successfully");
        } catch (error) {
            console.error("Error updating group", error);
            alert(error.response.data);
        } finally {
            setUpdateGroupNameModalOpen(false);
        }
    }

    const handleAddStudentToGroup = async (request) => {
        try {
            const response = await axios.patch(`${url}/teacher/students`, request, {
                withCredentials: true,
            });
            // setSelectedGroup((prevGroup) => ({  вернуть когда исправлю в backend возврат правильной сущности
            //     ...prevGroup,
            //     studentInfos: [...prevGroup.studentInfos, response.data]
            // }));
            alert("Student added successfully");
        } catch (error) {
            console.error("Error adding student: ", error);
            alert(error.response?.data || "Error");
        } finally {
            setAddStudentToGroupModalOpen(false);
        }
    }

    const handleDeleteStudentFromGroup = async() => {
        try {
            const request = {
                groupId: selectedGroup.id,
                studentId: selectedStudent.studentId,
            };
              const response = await axios.delete(`${url}/teacher/students`, {
                data: request,
                withCredentials: true,
            });
            setSelectedGroup((prevGroup) => ({
                ...prevGroup,
                studentInfos: prevGroup.studentInfos.filter((student) => student.studentId !== selectedStudent.studentId)
            }));
            alert(response.data);
        } catch (error) {
            console.error("Error deleting student: ", error);
            alert(error.response?.data || "Error");
        } finally {
            setDeleteStudentFromGroupModalOpen(false);
        }
    }

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
                    <section className="groups-list">
                        <h1>All Lessons</h1>
                        <div className="group-cards">
                            {lessons.map((lesson) => (
                                <div key={lesson.id} className="group-card" onClick={() => handleGetLessonPage(lesson.id)}>
                                    <button
                                        className="delete-btn"
                                        onClick={() => {
                                            setSelectedLesson(lesson);
                                            setDeleteLessonModalOpen(true);
                                        }}
                                    >
                                        &times;
                                    </button>
                                    <h2>
                                        {lesson.groupName}
                                    </h2>
                                    <ul className="group-students">
                                        <li>
                                            Start time: {new Date(lesson.startTime).toLocaleDateString()} {new Date(lesson.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </li>
                                        <li>
                                            End time: {new Date(lesson.endTime).toLocaleDateString()} {new Date(lesson.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </li>
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {activeTab === "students" && (
                    <section className="students-list">
                        <h1>All Students</h1>
                        <Table
                            data={students}
                            // Don't pass onAttach or onUpdate to hide these buttons
                        />
                    </section>
                )}

                {activeTab === "groups" && (
                    <section className="groups-list">
                        <h1>All Groups</h1>
                        <div className="group-cards">
                            {groups.map((group) => (
                                <div key={group.id} className="group-card" onClick={() => handleGetGroupPage(group.id)}>
                                    <button
                                        className="delete-btn"
                                        onClick={() => {
                                            setSelectedGroup(group);
                                            setDeleteGroupModalOpen(true);
                                        }}
                                    >
                                        &times;
                                    </button>
                                    <h2>
                                        {group.groupName}
                                    </h2>
                                    {/*<ul className="group-students">*/}
                                    {/*    {group.students.map((student) => (*/}
                                    {/*        <li key={student.id}>*/}
                                    {/*            {student.name} ({student.email})*/}
                                    {/*        </li>*/}
                                    {/*    ))}*/}
                                    {/*    {group.students.length === 0 && <li>No students in this group</li>}*/}
                                    {/*</ul>*/}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {activeTab === "group" && (
                    <div className="table">
                        <div className="table-row header">
                            <div className="table-cell">ID</div>
                            <div className="table-cell">Name</div>
                            <div className="table-cell">Performance</div>
                            <div className="table-cell">Actions</div>
                        </div>
                        {selectedGroup.studentInfos?.map((student) => (
                                <div key={student.studentId} className="table-row">
                                    <div className="table-cell">{student.studentId}</div>
                                    <div className="table-cell">{student.lastName} {student.firstName}</div>
                                    <div className="table-cell">{student.performance}</div>
                                    <div className="table-cell actions">
                                        <button className="btn btn-delete" onClick={() => {
                                            setSelectedStudent(student);
                                            setDeleteStudentFromGroupModalOpen(true);
                                        }}>
                                            <i className="fas fa-trash"></i>Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}

                {activeTab === "lesson" && (
                    <>
                        {/* Таблица заданий */}
                        <div style={{display: "flex"}}>
                            <h3>Tasks</h3>
                            <button className="btn" onClick={() => setAddTaskModalOpen(true)}>
                                Add Task
                            </button>
                        </div>

                        <div className="table">
                            <div className="table-row header">
                                <div className="table-cell">ID</div>
                                <div className="table-cell">Level</div>
                                <div className="table-cell">Topic</div>
                                <div className="table-cell">Actions</div>
                            </div>
                            {selectedLesson.tasks?.map((task) => (
                                <div key={task.id} className="table-row">
                                    <div className="table-cell">{task.id}</div>
                                    <div className="table-cell">{task.level}</div>
                                    <div className="table-cell">{task.topic}</div>
                                    <div className="table-cell actions">
                                        <button className="btn btn-delete" onClick={() => alert("do not work")}>
                                            <i className="fas fa-trash"></i>Check
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Таблица посещаемости */}
                        <h3>Attendance</h3>
                        <div className="table">
                            <div className="table-row header">
                                <div className="table-cell">Student</div>
                                <div className="table-cell">Attended</div>
                            </div>
                            {selectedLesson.studentInfoDTOs?.map((student) => (
                                <div key={student.studentId} className="table-row">
                                    <div className="table-cell">{student.lastName} {student.firstName}</div>
                                    <div className="table-cell">
                                        <input
                                            type="checkbox"
                                            checked={student.attended}
                                            onChange={(e) => {
                                                const updated = selectedLesson.studentInfoDTOs.map(s =>
                                                    s.studentId === student.studentId
                                                        ? {...s, attended: e.target.checked}
                                                        : s
                                                );
                                                setSelectedLesson({...selectedLesson, studentInfoDTOs: updated});
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn" onClick={() => {
                            const attendedStudentIds = selectedLesson.studentInfoDTOs
                                .filter(student => student.attended)
                                .map(student => student.studentId);

                            const request = {
                                lessonId: selectedLesson.id,
                                studentIds: attendedStudentIds,
                            };

                            handleSubmitAttendance(request).then();
                        }}>Submit Attendance</button>

                        {/* Таблица успеваемости */}
                        <h3>Performance</h3>
                        <div className="table">
                            <div className="table-row header">
                                <div className="table-cell">Student</div>
                                <div className="table-cell">Task ID</div>
                                <div className="table-cell">Attempt</div>
                                <div className="table-cell">Completed</div>
                                <div className="table-cell">Completed At</div>
                            </div>
                            {/*{selectedLesson.studentInfoDTOs?.flatMap((student) =>*/}
                            {/*    student.performance.map((p) => (*/}
                            {/*        <div key={`${student.studentId}-${p.taskId}-${p.attemptNumber}`}*/}
                            {/*             className="table-row">*/}
                            {/*            <div className="table-cell">{student.lastName} {student.firstName}</div>*/}
                            {/*            <div className="table-cell">{p.taskId}</div>*/}
                            {/*            <div className="table-cell">{p.attemptNumber}</div>*/}
                            {/*            <div className="table-cell">{p.completed ? "Yes" : "No"}</div>*/}
                            {/*            <div className="table-cell">{new Date(p.completedAt).toLocaleString()}</div>*/}
                            {/*        </div>*/}
                            {/*    ))*/}
                            {/*)}*/}
                        </div>
                    </>
                )}

                {/* Footer */}
                <footer className="footer">
                    <p>Terms of Service | Privacy Policy | Contacts</p>
                    <p>© 2025 ChessMaster. All rights reserved.</p>
                </footer>
            </main>

            {isAddLessonModalOpen && (
                <Modal onClose={() => setAddLessonModalOpen(false)}>
                    <h2>Add New Lesson</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const newLesson = {
                                teacherId: currentUser.id,
                                groupId: formData.get("groupId"),
                                startTime: formData.get("startTime"),
                                endTime: formData.get("endTime"),
                                taskIds: [],
                                presentStudentIds: [],
                            };
                            handleAddLesson(newLesson).then();
                        }}
                    >
                        <label htmlFor="groupId">Group:</label>
                        <select id="groupId" name="groupId" required>
                            {groups.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {group.groupName}
                                </option>
                            ))}
                        </select>

                        {/* Время начала урока */}
                        <label htmlFor="startTime">Start Time:</label>
                        <input type="datetime-local" id="startTime" name="startTime" required/>

                        {/* Время окончания урока */}
                        <label htmlFor="endTime">End Time:</label>
                        <input type="datetime-local" id="endTime" name="endTime" required/>

                        <button type="submit" className="btn">
                            Save Lesson
                        </button>
                    </form>
                </Modal>
            )}

            {isDeleteLessonModalOpen && (
                <Modal onClose={() => setDeleteLessonModalOpen(false)}>
                    <h2>Are you sure you want to delete this lesson?</h2>
                    <div className="modal-actions">
                        <button className="btn" onClick={handleDeleteLesson}>
                            Yes, Delete
                        </button>
                        <button
                            className="btn"
                            onClick={() => setDeleteLessonModalOpen(false)}
                        >
                            No, Cancel
                        </button>
                    </div>
                </Modal>
            )}

            {isUpdateLessonModalOpen && (
                <Modal onClose={() => setUpdateLessonModalOpen(false)}>
                    <h2>Add New Lesson</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const request = {
                                lessonId: selectedLesson.id,
                                groupId: formData.get("groupId"),
                                startTime: formData.get("startTime"),
                                endTime: formData.get("endTime"),
                            };
                            handleUpdateLesson(request).then();
                        }}
                    >
                        <label htmlFor="groupId">Group:</label>
                        <select id="groupId" name="groupId" required>
                            {groups.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {group.groupName}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="startTime">Start Time:</label>
                        <input type="datetime-local" defaultValue={selectedLesson.startTime} id="startTime" name="startTime" required/>

                        <label htmlFor="endTime">End Time:</label>
                        <input type="datetime-local" defaultValue={selectedLesson.endTime} id="endTime" name="endTime" required/>

                        <button type="submit" className="btn">
                            Update Lesson
                        </button>
                    </form>
                </Modal>
            )}

            {isAddTaskModalOpen && (
                <Modal onClose={() => setAddTaskModalOpen(false)}>
                    <h2>Add Task</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const request = {
                                lessonId: selectedLesson.id,
                                taskIds: [formData.get("taskId")],
                            };
                            handleAddTask(request).then();
                        }}
                    >
                        <label htmlFor="taskId">Task:</label>
                        <input type="text" id="taskId" name="taskId" required />
                        <button type="submit" className="btn">
                            Save Task
                        </button>
                    </form>
                </Modal>
            )}

            {isAddGroupModalOpen && (
                <Modal onClose={() => setAddGroupModalOpen(false)}>
                    <h2>Add New Group</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const newGroup = {
                                teacherId: currentUser.id,
                                groupName: formData.get("groupName"),
                                studentIds: [],
                            };
                            handleAddGroup(newGroup).then();
                        }}
                    >
                        <label htmlFor="groupName">Group Name:</label>
                        <input type="text" id="groupName" name="groupName" required />
                        <button type="submit" className="btn">
                            Save Group
                        </button>
                    </form>
                </Modal>
            )}

            {isDeleteGroupModalOpen && (
                <Modal onClose={() => setDeleteGroupModalOpen(false)}>
                    <h2>Are you sure you want to delete this group?</h2>
                    <div className="modal-actions">
                        <button className="btn" onClick={handleDeleteGroup}>
                            Yes, Delete
                        </button>
                        <button
                            className="btn"
                            onClick={() => setDeleteGroupModalOpen(false)}
                        >
                            No, Cancel
                        </button>
                    </div>
                </Modal>
            )}

            {isUpdateGroupNameModalOpen && (
                <Modal onClose={() => setUpdateGroupNameModalOpen(false)}>
                    <h2>Update Group</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const newGroup = {
                                id: selectedGroup.id,
                                groupName: formData.get("groupName"),
                            };
                            handleUpdateGroupName(newGroup).then();
                        }}
                    >
                        <label htmlFor="groupName">Group Name:</label>
                        <input type="text" id="groupName" name="groupName" required />
                        <button type="submit" className="btn">
                            Save Group
                        </button>
                    </form>
                </Modal>
            )}

            {isAddStudentToGroupModalOpen && (
                <Modal onClose={() => setAddStudentToGroupModalOpen(false)}>
                    <h2>Add New Student</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const newStudent = {
                                groupId: selectedGroup.id,
                                studentId: formData.get("studentId"),
                            };
                            handleAddStudentToGroup(newStudent).then();
                        }}
                    >
                        <label htmlFor="studentId">Id:</label>
                        <input type="number" id="studentId" name="studentId" required />
                        <button type="submit" className="btn">
                            Save Student
                        </button>
                    </form>
                </Modal>
            )}

            {isDeleteStudentFromGroupModalOpen && (
                <Modal onClose={() => setDeleteStudentFromGroupModalOpen(false)}>
                    <h2>Are you sure you want to delete this student from group?</h2>
                    <div className="modal-actions">
                        <button className="btn" onClick={handleDeleteStudentFromGroup}>
                            Yes, Delete
                        </button>
                        <button
                            className="btn"
                            onClick={() => setDeleteStudentFromGroupModalOpen(false)}
                        >
                            No, Cancel
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default TeacherPage;