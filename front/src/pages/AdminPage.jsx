import React, {useEffect, useState} from "react";
import AdminSidebar from "../components/AdminSidebar";
import Modal from "../components/Modal";
import UsersTable from "../components/UsersTable";
import TasksTable from "../components/TasksTable";
import axios from "../axiosInstance.js";
import CheckTaskModal from "../components/modals/teacher/lesson/CheckTaskModal.jsx";
import Footer from "../components/Footer.jsx";
import AddStudentModal from "../components/modals/admin/AddStudentModal.jsx";
import AddTeacherModal from "../components/modals/admin/AddTeacherModal.jsx";
import {handleLogout} from "../handlers/handleLogout.jsx";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {handleError} from "../handlers/handleError.js";
import UpdateStudentModal from "../components/modals/admin/UpdateStudentModal.jsx";
import UpdateTeacherModal from "../components/modals/admin/UpdateTeacherModal.jsx";

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState("students");
    const [isAddStudentModalOpen, setAddStudentModalOpen] = useState(false);
    const [isUpdateStudentModalOpen, setUpdateStudentModalOpen] = useState(false);
    const [isDeleteStudentModalOpen, setDeleteStudentModalOpen] = useState(false);
    const [isAssignTeacherModalOpen, setAssignTeacherModalOpen] = useState(false);
    const [isDetachStudentModalOpen, setDetachStudentModalOpen] = useState(false);
    const [isAddTeacherModalOpen, setAddTeacherModalOpen] = useState(false);
    const [isUpdateTeacherModalOpen, setUpdateTeacherModalOpen] = useState(false);
    const [isDeleteTeacherModalOpen, setDeleteTeacherModalOpen] = useState(false);
    const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false);
    const [isDeleteTaskModalOpen, setDeleteTaskModalOpen] = useState(false);

    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [tasks, setTasks] = useState([]);

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isCheckTaskModalOpen ,setCheckTaskModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        startFin: '',
        endFin: ''
    });

    const [errors, setErrors] = useState({
        startFin: '',
        endFin: ''
    });

    const [searchTerm, setSearchTerm] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        if ((name === "startFin" || name === "endFin")) {
            if (value.trim() === '') {
                setErrors((prev) => ({
                    ...prev,
                    [name]: ''
                }));
            } else {
                const isValid = isValidFEN(value);
                setErrors((prev) => ({
                    ...prev,
                    [name]: isValid ? '' : 'Invalid FEN'
                }));
            }
        }
    };

    const isValidFEN = (fen) => {
        if (!fen) return true; // пустая строка допустима
        const parts = fen.trim().split(/\s+/);
        if (parts.length !== 6) return false;

        const [placement, turn, castling, ep, halfMove, fullMove] = parts;

        const isValidPlacement = (s) => {
            const rows = s.split('/');
            if (rows.length !== 8) return false;
            return rows.every(row => {
                let count = 0;
                for (const ch of row) {
                    if (/[1-8]/.test(ch)) count += parseInt(ch);
                    else if (/[prnbqkPRNBQK]/.test(ch)) count += 1;
                    else return false;
                }
                return count === 8;
            });
        };

        const isTurn = turn === 'w' || turn === 'b';
        const isCastling = /^(-|[KQkq]{1,4})$/.test(castling);
        const isEp = /^(-|[a-h][36])$/.test(ep);
        const isNumber = (n) => /^\d+$/.test(n);

        return isValidPlacement(placement) && isTurn && isCastling && isEp && isNumber(halfMove) && isNumber(fullMove);
    };

    useEffect(() => {

        const fetchStudents = async () => {
            try {
                const response = await axios.get(`/admin/students`);
                setStudents(response.data);
                console.log("Students received");
            } catch (error) {
                console.error("Error fetching students", error);
            }
        };

        const fetchTeachers = async () => {
            try {
                const response = await axios.get(`/admin/teachers`);
                setTeachers(response.data);
                console.log("Teachers received");
            } catch (error) {
                console.error("Error fetching teachers", error);
            }
        };

        const fetchTasks = async () => {
            try {
                const response = await axios.get(`/tasks`);
                setTasks(response.data);
                console.log("Tasks received");
            }  catch(error) {
                 console.error("Error fetching tasks", error);
            }
        };

        fetchStudents().then();
        fetchTeachers().then();
        fetchTasks().then();
    }, []);

    const handleAddStudent = async (newStudent) => {
        try {
            const res = await axios.post(`/admin/students`, newStudent);
            const savedStudent = res.data;
            setStudents([...students, savedStudent]);
            alert("Student added successfully!")
            setAddStudentModalOpen(false);
        } catch (error) {
            handleError(error, "Error adding student");
        }
    };

    const handleUpdateStudent = async (updatedStudent) => {
        try {
            const res = await axios.put(`/admin/students`, updatedStudent);
            const savedStudent = res.data;
            alert("Student updated successfully")
            setStudents(
                students.map((student) =>
                    student.id === savedStudent.id ? savedStudent : student
                )
            );
            setUpdateStudentModalOpen(false);
        } catch (error) {
            handleError(error, "Error updating student");
        }
    };

    const handleDeleteStudent = async () => {
        try {
            const response = await axios.delete(`/admin/${selectedStudent.id}`);
            alert(response.data);
            setStudents(students.filter((student) => student.id !== selectedStudent.id));
            setDeleteStudentModalOpen(false);
        } catch (error) {
            console.error("Error deleting student", error);
        }
    };

    const handleAssignTeacher = async (request) => {
        try {
            await axios.put(`/admin/attach`, request);
            selectedStudent.teacherId = request.id;
            setAssignTeacherModalOpen(false);
        } catch (error) {
            const validationErrors = error.response.data;
            const message = Object.entries(validationErrors)
                .map(([field, msg]) => `${field}: ${msg}`)
                .join('\n');

            alert('Validation errors:\n' + message);
            setAssignTeacherModalOpen(false);
            throw error;
        }
    };

    const handleDetachStudent = async () => {
        try {
            await axios.put(`/admin/detach/${selectedStudent.id}`);
            alert("Student detached successfully");
            selectedStudent.teacherId = null;
            setDetachStudentModalOpen(false);
        } catch(error) {
            console.error("Error detaching student", error);
            alert("Error detaching student");
            setDetachStudentModalOpen(false);
        }
    };

    const handleAddTeacher = async (newTeacher) => {
        try {
            const res = await axios.post(`/admin/teachers`, newTeacher);
            const savedTeacher = res.data;
            setTeachers([...teachers, savedTeacher]);

            alert("Teacher added successfully!")
            setAddTeacherModalOpen(false);
        } catch (error) {
            handleError(error, "Error adding teacher");
        }
    };

    const handleUpdateTeacher = async (updatedTeacher) => {
        try {
            const res = await axios.put(`/admin/teachers`, updatedTeacher);
            const savedTeacher = res.data;
            alert("Teacher updated successfully")
            setTeachers(
                teachers.map((teacher) =>
                    teacher.id === savedTeacher.id ? savedTeacher : teacher
                )
            );
            setUpdateTeacherModalOpen(false);
        } catch (error) {
            handleError(error, "Error updating teacher");
        }
    };

    const handleDeleteTeacher = async () => {
        try {
            const response = await axios.delete(`/admin/${selectedTeacher.id}`);
            alert(response.data);
            setTeachers(teachers.filter((teacher) => teacher.id !== selectedTeacher.id));
            setDeleteTeacherModalOpen(false);
        } catch (error) {
            console.error("Error deleting teacher", error);
        }
    };

    const [selectedLevelName, setSelectedLevelName] = useState(null);
    const [selectedTopicName, setSelectedTopicName] = useState(null);

    const handleDeleteTask = async () => {
        try {
            const response = await axios.delete(`/admin/tasks/${selectedTask.id}`);
            alert(response.data);

            const updatedTasks = tasks.map((level) => {
                if (level.level !== selectedLevelName) return level;

                return {
                    ...level,
                    topics: level.topics.map((topic) => {
                        if (topic.topic !== selectedTopicName) return topic;

                        return {
                            ...topic,
                            tasks: topic.tasks.filter((task) => task.id !== selectedTask.id),
                        };
                    }),
                };
            });
            setTasks(updatedTasks);

            const updatedLevel = updatedTasks.find(l => l.level === selectedLevelName);
            const updatedTopic = updatedLevel?.topics.find(t => t.topic === selectedTopicName);

            setSelectedLevelName(updatedLevel ? updatedLevel.level : null);
            setSelectedTopicName(updatedTopic ? updatedTopic.topic : null);

            setDeleteTaskModalOpen(false);
        } catch (error) {
            handleError(error, "Error deleting task");
        }
    };

    const handleAddTask = async (newTask) => {
        try {
            const response = await axios.post(`/admin/tasks`, newTask);
            const savedTask = response.data;
            alert("Task added successfully");

            const updatedTasks = tasks.map((level) => {
                if (level.level !== savedTask.level) return level;

                return {
                    ...level,
                    topics: level.topics.map((topic) => {
                        if (topic.topic !== savedTask.topic) return topic;

                        return {
                            ...topic,
                            tasks: [...topic.tasks, savedTask],
                        };
                    }),
                };
            });
            setTasks(updatedTasks);

            if (selectedLevelName === savedTask.level && selectedTopicName === savedTask.topic) {
                setSelectedLevelName(savedTask.level);
                setSelectedTopicName(savedTask.topic);
            }

            setAddTaskModalOpen(false);
        } catch (error) {
            handleError(error, "Error adding task");
        }
    };

    return (
        <div className="container">
            <AdminSidebar
                onTabChange={(tab) => setActiveTab(tab)}
                onLogout={() =>
                    handleLogout().then()
                }
                activeTab={activeTab}
            />
            <main className="main-content">
                <header className="header">
                    <h1>
                        {activeTab === "students" ? "Students"
                            : activeTab === "teachers" ? "Teachers"
                                : activeTab === "tasks" ? "Tasks" : ""}
                    </h1>
                    {activeTab === "students" && (
                        <button className="btn" onClick={() => setAddStudentModalOpen(true)}>
                            <FontAwesomeIcon icon={faPlus} /> Add Student
                        </button>
                    )}
                    {activeTab === "teachers" && (
                        <button className="btn" onClick={() => setAddTeacherModalOpen(true)}>
                            <FontAwesomeIcon icon={faPlus} /> Add Teacher
                        </button>
                    )}
                    {activeTab === "tasks" && (
                        <button className="btn" onClick={() => setAddTaskModalOpen(true)}>
                            <FontAwesomeIcon icon={faPlus} /> Add Task
                        </button>
                    )}
                </header>

                {activeTab === "students" && (
                    <>
                        <input
                            type="text"
                            placeholder="Search by name or email"
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <UsersTable
                            data={students}
                            searchTerm={searchTerm}
                            onUpdate={(student) => {
                                setSelectedStudent(student);
                                setUpdateStudentModalOpen(true);
                            }}
                            onDelete={(student) => {
                                setSelectedStudent(student);
                                setDeleteStudentModalOpen(true);
                            }}
                            onAttach={(student) => {
                                setSelectedStudent(student);
                                setAssignTeacherModalOpen(true);
                            }}
                            onDetach={(student) => {
                                setSelectedStudent(student);
                                setDetachStudentModalOpen(true);
                            }}
                            showAttachButton={true}
                        />
                    </>
                )}

                {activeTab === "teachers" && (
                    <>
                        <input
                            type="text"
                            placeholder="Search by name or email"
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <UsersTable
                            data={teachers}
                            searchTerm={searchTerm}
                            onUpdate={(teacher) => {
                                setSelectedTeacher(teacher);
                                setUpdateTeacherModalOpen(true);
                            }}
                            onDelete={(teacher) => {
                                setSelectedTeacher(teacher);
                                setDeleteTeacherModalOpen(true);
                            }}
                            showAttachButton={false}
                        />
                    </>
                )}

                {activeTab === "tasks" && (
                    <TasksTable
                        data={tasks}
                        selectedLevelName={selectedLevelName}
                        setSelectedLevelName={(level) => setSelectedLevelName(level)}
                        selectedTopicName={selectedTopicName}
                        setSelectedTopicName={(topic) => setSelectedTopicName(topic)}
                        onDelete={(task) => {
                            setSelectedTask(task)
                            setDeleteTaskModalOpen(true);
                        }}
                        onCheck={(task) => {
                            setSelectedTask(task)
                            setCheckTaskModalOpen(true);
                        }}
                    />
                )}
            </main>
            <Footer />

            {isAddStudentModalOpen && (
                <AddStudentModal
                    onClose={() => setAddStudentModalOpen(false)}
                    onSubmit={(newStudent) => handleAddStudent(newStudent).then()}
                />
            )}

            {/* Update Student Modal не сделано*/}
            {isUpdateStudentModalOpen && (
                <UpdateStudentModal
                    onClose={() => setUpdateStudentModalOpen(false)}
                    onSubmit={(updatedStudent) => handleUpdateStudent(updatedStudent)}
                    initialData={selectedStudent}
                />
                // <Modal onClose={() => setUpdateStudentModalOpen(false)}>
                //     <h2>Update Student</h2>
                //     <form
                //         onSubmit={(e) => {
                //             e.preventDefault();
                //             const formData = new FormData(e.target);
                //             const updatedStudent = {
                //                 id: selectedStudent.id,
                //                 email: formData.get("updateEmail"),
                //                 fullName: formData.get("updateFullName"),
                //                 phone: formData.get("updatePhone"),
                //                 hourlyRate: selectedStudent.hourlyRate,
                //                 lastPayment: formData.get("updateLastPayment")
                //             };
                //             handleUpdateStudent(updatedStudent).then();
                //         }}
                //     >
                //         <div className="form-grid">
                //             <label htmlFor="updateFirstName">First Name:</label>
                //             <input
                //                 type="text"
                //                 id="updateFirstName"
                //                 name="updateFirstName"
                //                 defaultValue={selectedStudent.user.firstName}
                //                 required
                //             />
                //             <label htmlFor="updateEmail">Email:</label>
                //             <input
                //                 type="email"
                //                 id="updateEmail"
                //                 name="updateEmail"
                //                 defaultValue={selectedStudent.email}
                //                 required
                //             />
                //             <label htmlFor="updatePhone">Phone:</label>
                //             <input type="phone" id="updatePhone" name="updatePhone" defaultValue={selectedStudent.phone}
                //                    required/>
                //             <label htmlFor="updateLastPayment">Last payment:</label>
                //             <input id="updateLastPayment" name="updateLastPayment" type="datetime-local"
                //                    defaultValue={selectedStudent.lastPayment} required/>
                //         </div>
                //
                //         <button type="submit" className="btn btn-center">
                //             Save Changes
                //         </button>
                //     </form>
                // </Modal>
            )}

            {isDeleteStudentModalOpen && (
                <Modal onClose={() => setDeleteStudentModalOpen(false)}>
                    <h2>Are you sure you want to delete this student?</h2>
                    <div className="modal-actions">
                        <button className="btn" onClick={handleDeleteStudent}>
                            Yes, Delete
                        </button>
                        <button
                            className="btn"
                            onClick={() => setDeleteStudentModalOpen(false)}
                        >
                            No, Cancel
                        </button>
                    </div>
                </Modal>
            )}

            {isAssignTeacherModalOpen && (
                <Modal onClose={() => setAssignTeacherModalOpen(false)}>
                    <h2>Assign Teacher</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const request = {
                                id: formData.get("teacherID"),
                                studentId: selectedStudent.id,
                            };
                            handleAssignTeacher(request)
                                .then(() => alert("Student attached successfully!"))
                                .catch((error) => {
                                    console.error("Failed to attach student:", error);
                                });
                        }}
                    >
                        <div className="form-grid">
                            <label htmlFor="teacherID">Teacher Name:</label>
                            <select id="teacherID" name="teacherID" required>
                                {teachers.map((teacher) => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.user.firstName} {teacher.user.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-center">
                            Assign
                        </button>
                    </form>
                </Modal>
            )}

            {isDetachStudentModalOpen && (
                <Modal onClose={() => setDetachStudentModalOpen(false)}>
                    <h2>Are you sure you want to detach this student from teacher?</h2>
                    <div className="modal-actions">
                        <button className="btn" onClick={handleDetachStudent}>
                            Yes, Detach
                        </button>
                        <button
                            className="btn"
                            onClick={() => setDeleteStudentModalOpen(false)}
                        >
                            No, Cancel
                        </button>
                    </div>
                </Modal>
            )}

            {isAddTeacherModalOpen && (
                <AddTeacherModal
                    onClose={() => setAddTeacherModalOpen(false)}
                    onSubmit={(newTeacher) => handleAddTeacher(newTeacher).then()}
                />
            )}

            {/* Update Teacher Modal не сделано*/}
            {isUpdateTeacherModalOpen && (
                <UpdateTeacherModal
                    onClose={() => setUpdateTeacherModalOpen(false)}
                    onSubmit={(updatedTeacher) => handleUpdateTeacher(updatedTeacher)}
                    initialData={selectedTeacher}
                />
                // <Modal onClose={() => setUpdateTeacherModalOpen(false)}>
                //     <h2>Update Teacher</h2>
                //     <form
                //         onSubmit={(e) => {
                //             e.preventDefault();
                //             const formData = new FormData(e.target);
                //             const updatedTeacher = {
                //                 id: selectedTeacher.id,
                //                 fullName: formData.get("updateFullName"),
                //                 email: formData.get("updateEmail"),
                //                 phone: formData.get("updatePhone"),
                //                 hourlyRate: formData.get("updateHourlyRate"),
                //                 lastPayment: selectedTeacher.lastPayment
                //             };
                //             handleUpdateTeacher(updatedTeacher).then();
                //         }}
                //     >
                //         <label htmlFor="updateFullName">Full Name:</label>
                //         <input
                //             type="text"
                //             id="updateFullName"
                //             name="updateFullName"
                //             defaultValue={selectedTeacher.fullName}
                //             required
                //         />
                //         <label htmlFor="updateEmail">Email:</label>
                //         <input
                //             type="email"
                //             id="updateEmail"
                //             name="updateEmail"
                //             defaultValue={selectedTeacher.email}
                //             required
                //         />
                //         <label htmlFor="updatePhone">Phone:</label>
                //         <input type="phone" id="updatePhone" name="updatePhone" defaultValue={selectedTeacher.phone}
                //                required/>
                //         <label htmlFor="updateHourlyRate">Hourly rate:</label>
                //         <input id="updateHourlyRate" name="updateHourlyRate" defaultValue={selectedTeacher.hourlyRate} required/>
                //         <button type="submit" className="btn">
                //             Save Changes
                //         </button>
                //     </form>
                // </Modal>
            )}

            {isDeleteTeacherModalOpen && (
                <Modal onClose={() => setDeleteTeacherModalOpen(false)}>
                    <h2>Are you sure you want to delete this teacher?</h2>
                    <div className="modal-actions">
                        <button className="btn" onClick={handleDeleteTeacher}>
                            Yes, Delete
                        </button>
                        <button
                            className="btn"
                            onClick={() => setDeleteTeacherModalOpen(false)}
                        >
                            No, Cancel
                        </button>
                    </div>
                </Modal>
            )}

            {isAddTaskModalOpen && (
                <Modal onClose={() => setAddTaskModalOpen(false)}>
                    <h2>Add new task</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);

                            let hasError = false;
                            const newErrors = {...errors};

                            if (!isValidFEN(formData.startFin)) {
                                newErrors.startFin = 'Invalid FEN';
                                hasError = true;
                            }

                            if (formData.endFin && !isValidFEN(formData.endFin)) {
                                newErrors.endFin = 'Invalid FEN';
                                hasError = true;
                            }

                            if (hasError) {
                                setErrors(newErrors);
                                return;
                            }

                            const newTask = {
                                level: formData.get("level"),
                                topic: formData.get("topic"),
                                startFin: formData.get("startFin"),
                                endFin: formData.get("endFin")
                            };
                            handleAddTask(newTask).then();
                        }}
                    >
                        <div className="form-grid">
                            <label htmlFor="topic">Level:</label>
                            <select id="level" name="level" required>
                                <option value="">-- Select level --</option>
                                <option value="BEGINNER">Beginner</option>
                                <option value="FOURTH_CATEGORY">Fourth category</option>
                                <option value="THIRD_CATEGORY">Third category</option>
                                <option value="SECOND_CATEGORY">Second category</option>
                                <option value="FIRST_CATEGORY">First category</option>
                                <option value="CANDIDATE_MASTER">Candidate master</option>
                                <option value="FIDE_MASTER">Fide master</option>
                            </select>

                            <label htmlFor="topic">Topic:</label>
                            <input type="text" id="topic" name="topic" required/>
                            <div className="form-field">
                                <label htmlFor="startFin">startFin:</label>
                                <input type="text" id="startFin" name="startFin" value={formData.startFin}
                                       onChange={handleChange} required/>
                                {errors.startFin && <p className="error-text">{errors.startFin}</p>}
                            </div>

                            <div className="form-field">
                                <label htmlFor="endFin">endFin:</label>
                                <input type="text" id="endFin" name="endFin" value={formData.endFin}
                                       onChange={handleChange}/>
                                {errors.endFin && <p className="error-text">{errors.endFin}</p>}
                            </div>
                        </div>
                        <button type="submit" className="btn btn-center" disabled={!!errors.startFin || !!errors.endFin}>
                            Save Task
                        </button>
                    </form>
                </Modal>
            )}

            {isDeleteTaskModalOpen && (
                <Modal onClose={() => setDeleteTaskModalOpen(false)}>
                    <h2>Are you sure you want to delete this task?</h2>
                    <div className="modal-actions">
                        <button className="btn" onClick={handleDeleteTask}>
                            Yes, Delete
                        </button>
                        <button
                            className="btn"
                            onClick={() => setDeleteTaskModalOpen(false)}
                        >
                            No, Cancel
                        </button>
                    </div>
                </Modal>
            )}

            {isCheckTaskModalOpen && (
                <CheckTaskModal
                    onClose={() => setCheckTaskModalOpen(false)}
                    selectedTask={selectedTask}
                />
            )}
        </div>
    );
};

export default AdminPage;