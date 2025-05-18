import React, {useEffect, useState} from "react";
import AdminSidebar from "../components/AdminSidebar";
import Modal from "../components/Modal";
import UsersTable from "../components/UsersTable";
import TasksTable from "../components/TasksTable";
import axios from "../axiosInstance.js";
import CheckTaskModal from "../components/modals/teacher/lesson/CheckTaskModal.jsx";
import Footer from "../components/Footer.jsx";

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
            await axios.post(`/admin/students`, newStudent);
            setStudents([...students, {id: students.length + 1, ...newStudent}]);
            alert("Student added successfully!")
            setAddStudentModalOpen(false);
        } catch (error) {
            const validationErrors = error.response.data;
            const message = Object.entries(validationErrors)
                .map(([field, msg]) => `${field}: ${msg}`)
                .join('\n');

            alert('Validation errors:\n' + message);
            throw error;
        }
    };

    const handleUpdateStudent = async (updatedStudent) => {
        try {
            await axios.put(`http://localhost:8080/admin/`, updatedStudent, {
                withCredentials: true,
            });
            // After successful deletion, update the state to remove the teacher from the list
            setStudents(
                students.map((student) =>
                    student.id === updatedStudent.id ? updatedStudent : student
                )
            );
            setUpdateStudentModalOpen(false);
        } catch (error) {
            if (error.response) {
                // Ошибка от сервера
                console.error('Server responded with error:', error.response.data);
                alert('Validation errors: ' + error.response.data.join(', ')); // Печать ошибок
            } else if (error.request) {
                // Ошибка запроса (например, отсутствие соединения)
                console.error('Request error:', error.request);
            } else {
                // Ошибка, возникшая при настройке запроса
                console.error('Error', error.message);
            }
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
            await axios.post(`/admin/teachers`, newTeacher);
            setTeachers([...teachers, {id: teachers.length + 1, ...newTeacher}]);
            setAddTeacherModalOpen(false);
        } catch (error) {
                const validationErrors = error.response.data;
                const message = Object.entries(validationErrors)
                    .map(([field, msg]) => `${field}: ${msg}`)
                    .join('\n');

                alert('Validation errors:\n' + message);
                throw error;
        }
    };

    const handleUpdateTeacher = async (updatedTeacher) => {
        try {
            await axios.put(`http://localhost:8080/admin/`, updatedTeacher,{
                withCredentials: true,
            });
            // After successful deletion, update the state to remove the teacher from the list
            setTeachers(
                teachers.map((teacher) =>
                    teacher.id === updatedTeacher.id ? updatedTeacher : teacher
                )
            );
            setUpdateTeacherModalOpen(false);
        } catch (error) {
            if (error.response) {
                // Ошибка от сервера
                console.error('Server responded with error:', error.response.data);
                alert('Validation errors: ' + error.response.data.join(', ')); // Печать ошибок
            } else if (error.request) {
                // Ошибка запроса (например, отсутствие соединения)
                console.error('Request error:', error.request);
            } else {
                // Ошибка, возникшая при настройке запроса
                console.error('Error', error.message);
            }
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

    const handleDeleteTask = async () => {
        try {
            const response = await axios.delete(`/admin/tasks/${selectedTask.id}`);
            alert(response.data);
            setTasks(tasks.filter((task) => task.id !== selectedTask.id));
            setDeleteTaskModalOpen(false);
        } catch (error) {
            console.error("Error deleting task", error);
        }
    };

    const handleAddTask = async (newTask) => {
        try {
            await axios.post(`/admin/tasks`, newTask);
            setTasks([...tasks, {id: tasks.length + 1, ...newTask}]);
            setAddTaskModalOpen(false);
        } catch (error) {
            const validationErrors = error.response.data;
            const message = Object.entries(validationErrors)
                .map(([field, msg]) => `${field}: ${msg}`)
                .join('\n');

            alert('Validation errors:\n' + message);
            throw error;
        }
    };

    return (
        <div className="container">
            <AdminSidebar
                onTabChange={(tab) => setActiveTab(tab)}
                onLogout={() =>
                    window.location.href = "/auth"
                }
            />
            <div className="content-wrapper">
                <main className="main-content">
                    <header className="header">
                        <h2>
                            {activeTab === "students" ? "Students"
                                : activeTab === "teachers" ? "Teachers"
                                    : activeTab === "tasks" ? "Tasks" : ""}
                        </h2>
                        {activeTab === "students" && (
                            <button className="btn" onClick={() => setAddStudentModalOpen(true)}>
                            Add Student
                            </button>
                        )}
                        {activeTab === "teachers" && (
                            <button className="btn" onClick={() => setAddTeacherModalOpen(true)}>
                                Add Teacher
                            </button>
                        )}
                        {activeTab === "tasks" && (
                            <button className="btn" onClick={() => setAddTaskModalOpen(true)}>
                                Add Task
                            </button>
                        )}
                    </header>

                    {activeTab === "students" && (
                        <UsersTable
                            data={students}
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
                    )}

                    {activeTab === "teachers" && (
                        <UsersTable
                            data={teachers}
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
                    )}

                    {activeTab === "tasks" && (
                        <TasksTable
                            data={tasks}
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
            </div>
            {/* Add Student Modal */}
            {isAddStudentModalOpen && (
                <Modal onClose={() => setAddStudentModalOpen(false)}>
                    <h2>Add New Student</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const newStudent = {
                                user: {
                                    firstName: formData.get("firstName"),
                                    lastName: formData.get("lastName"),
                                    email: formData.get("email"),
                                    phone: formData.get("phone"),
                                    password: formData.get("password"),
                                },
                                student: {
                                    lastPayment: formData.get("lastPayment")
                                }
                            };
                            handleAddStudent(newStudent).then();
                        }}
                    >
                        <label htmlFor="firstName">First Name:</label>
                        <input type="text" id="firstName" name="firstName" required/>

                        <label htmlFor="lastName">Last Name:</label>
                        <input type="text" id="lastName" name="lastName" required/>

                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" required/>

                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" required/>

                        <label htmlFor="phone">Phone:</label>
                        <input type="text" id="phone" name="phone" required/>

                        <label htmlFor="lastPayment">Last Payment:</label>
                        <input type="datetime-local" id="lastPayment" name="lastPayment" required/>

                        <button type="submit" className="btn">
                            Save Student
                        </button>
                    </form>
                </Modal>
            )}

            {/* Update Student Modal не сделано*/}
            {isUpdateStudentModalOpen && (
                <Modal onClose={() => setUpdateStudentModalOpen(false)}>
                    <h2>Update Student</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const updatedStudent = {
                                id: selectedStudent.id,
                                email: formData.get("updateEmail"),
                                fullName: formData.get("updateFullName"),
                                phone: formData.get("updatePhone"),
                                hourlyRate: selectedStudent.hourlyRate,
                                lastPayment: formData.get("updateLastPayment")
                            };
                            handleUpdateStudent(updatedStudent).then();
                        }}
                    >
                        <label htmlFor="updateFullName">Full Name:</label>
                        <input
                            type="text"
                            id="updateFullName"
                            name="updateFullName"
                            defaultValue={selectedStudent.fullName}
                            required
                        />
                        <label htmlFor="updateEmail">Email:</label>
                        <input
                            type="email"
                            id="updateEmail"
                            name="updateEmail"
                            defaultValue={selectedStudent.email}
                            required
                        />
                        <label htmlFor="updatePhone">Phone:</label>
                        <input type="phone" id="updatePhone" name="updatePhone" defaultValue={selectedStudent.phone}
                               required/>
                        <label htmlFor="updateLastPayment">Last payment:</label>
                        <input id="updateLastPayment" name="updateLastPayment"
                               defaultValue={selectedStudent.lastPayment} required/>
                        <button type="submit" className="btn">
                            Save Changes
                        </button>
                    </form>
                </Modal>
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
                        <label htmlFor="teacherID">Teacher Name:</label>
                        <select id="teacherID" name="teacherID" required>
                            {teachers.map((teacher) => (
                                <option key={teacher.id} value={teacher.id}>
                                    {teacher.user.firstName} {teacher.user.lastName}
                                </option>
                            ))}
                        </select>
                        <button type="submit" className="btn">
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
                <Modal onClose={() => setAddTeacherModalOpen(false)}>
                    <h2>Add New Teacher</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const newTeacherRequest = {
                                user: {
                                    firstName: formData.get("firstName"),
                                    lastName: formData.get("lastName"),
                                    email: formData.get("email"),
                                    phone: formData.get("phone"),
                                    password: formData.get("password"),
                                },
                                teacher: {
                                    hourlyRate: parseInt(String(formData.get("hourlyRate"))),
                                    schedule: formData.get("schedule"),
                                    bio: formData.get("bio"),
                                    experienceYears: parseInt(String(formData.get("experienceYears"))),
                                    chessRating: parseInt(String(formData.get("chessRating"))),
                                }
                            };
                            handleAddTeacher(newTeacherRequest)
                                .then(() => alert("Teacher added successfully!"))
                                .catch((error) => {
                                    console.error("Failed to add teacher:", error);
                                });
                        }}
                    >
                        <label htmlFor="firstName">First Name:</label>
                        <input type="text" id="firstName" name="firstName" required/>

                        <label htmlFor="lastName">Last Name:</label>
                        <input type="text" id="lastName" name="lastName" required/>

                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" required/>

                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" required/>

                        <label htmlFor="phone">Phone:</label>
                        <input type="text" id="phone" name="phone" required/>

                        <label htmlFor="hourlyRate">Hourly Rate:</label>
                        <input type="number" id="hourlyRate" name="hourlyRate" required/>

                        <label htmlFor="schedule">Schedule:</label>
                        <input type="text" id="schedule" name="schedule" required/>

                        <label htmlFor="bio">Bio:</label>
                        <textarea id="bio" name="bio" required></textarea>

                        <label htmlFor="experienceYears">Experience Years:</label>
                        <input type="number" id="experienceYears" name="experienceYears" required/>

                        <label htmlFor="chessRating">Chess Rating:</label>
                        <input type="number" id="chessRating" name="chessRating" required/>

                        <button type="submit" className="btn">
                            Save Teacher
                        </button>
                    </form>
                </Modal>
            )}

            {/* Update Teacher Modal не сделано*/}
            {isUpdateTeacherModalOpen && (
                <Modal onClose={() => setUpdateTeacherModalOpen(false)}>
                    <h2>Update Teacher</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const updatedTeacher = {
                                id: selectedTeacher.id,
                                fullName: formData.get("updateFullName"),
                                email: formData.get("updateEmail"),
                                phone: formData.get("updatePhone"),
                                hourlyRate: formData.get("updateHourlyRate"),
                                lastPayment: selectedTeacher.lastPayment
                            };
                            handleUpdateTeacher(updatedTeacher).then();
                        }}
                    >
                        <label htmlFor="updateFullName">Full Name:</label>
                        <input
                            type="text"
                            id="updateFullName"
                            name="updateFullName"
                            defaultValue={selectedTeacher.fullName}
                            required
                        />
                        <label htmlFor="updateEmail">Email:</label>
                        <input
                            type="email"
                            id="updateEmail"
                            name="updateEmail"
                            defaultValue={selectedTeacher.email}
                            required
                        />
                        <label htmlFor="updatePhone">Phone:</label>
                        <input type="phone" id="updatePhone" name="updatePhone" defaultValue={selectedTeacher.phone}
                               required/>
                        <label htmlFor="updateHourlyRate">Hourly rate:</label>
                        <input id="updateHourlyRate" name="updateHourlyRate" defaultValue={selectedTeacher.hourlyRate} required/>
                        <button type="submit" className="btn">
                            Save Changes
                        </button>
                    </form>
                </Modal>
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
                            const newTask = {
                                level: formData.get("level"),
                                topic: formData.get("topic"),
                                startFin: formData.get("startFin"),
                                endFin: formData.get("endFin")
                            };
                            handleAddTask(newTask)
                                .then(() => alert("Task added successfully!"))
                                .catch((error) => {
                                    console.error("Failed to add task:", error);
                                });
                        }}
                    >
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

                        <label htmlFor="startFin">startFin:</label>
                        <input type="text" id="startFin" name="startFin" required/>

                        <label htmlFor="endFin">endFin:</label>
                        <input type="text" id="endFin" name="endFin" />

                        <button type="submit" className="btn">
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