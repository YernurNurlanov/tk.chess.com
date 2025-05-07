import axios from "axios";

const url = import.meta.env.VITE_API_URL;

export const handleAddLesson = async (newLesson, setLessons, setAddLessonModalOpen) => {
    try {
        const response = await axios.post(`${url}/teacher/lessons`, newLesson, {
            withCredentials: true,
        });
        alert("Lesson added successfully");
        setLessons((prevLessons) => [...prevLessons, response.data]);
    } catch (error) {
        console.error("Error adding lesson: ", error);
        alert(error.response?.data || "Error adding lesson");
    } finally {
        setAddLessonModalOpen(false);
    }
};

export const handleDeleteLesson = async (selectedLesson, setLessons, setDeleteLessonModalOpen) => {
    try {
        const response = await axios.delete(`${url}/teacher/lessons/${selectedLesson.id}`, {
            withCredentials: true,
        });
        alert(response.data);
        setLessons((prevLessons) => prevLessons.filter((lesson) => lesson.id !== selectedLesson.id));
    } catch (error) {
        console.error("Error deleting lesson: ", error);
        alert(error.response?.data || "Error deleting lesson");
    } finally {
        setDeleteLessonModalOpen(false);
    }
};

export const handleUpdateLesson = async (request, setSelectedLesson, setUpdateLessonModalOpen) => {
    try {
        const response = await axios.put(`${url}/teacher/lessons`, request, {
            withCredentials: true,
        });
        alert("Lesson updated successfully");
        setSelectedLesson(response.data);
    } catch (error) {
        console.error("Error updating lesson: ", error);
        alert(error.response?.data || "Error updating lesson");
    } finally {
        setUpdateLessonModalOpen(false);
    }
};

export const handleGetLessonPage = async (lessonId, setSelectedLesson, setActiveTab) => {
    try {
        const response = await axios.get(`${url}/teacher/lessons/${lessonId}`, {
            withCredentials: true,
        });
        setSelectedLesson(response.data);
        setActiveTab("lesson");
    } catch (error) {
        console.error("Error fetching lesson: ", error);
        alert(error.response?.data || "Error fetching lesson");
    }
};

export const handleSubmitAttendance = async (request) => {
    try {
        await axios.post(`${url}/teacher/attendance`, request, {
            withCredentials: true,
        });
        alert("Attendance submitted successfully");
    } catch (error) {
        console.error("Error submitting attendance: ", error);
        alert(error.response?.data || "Error submitting attendance");
    }
};

export const handleAddTask = async (request, setSelectedLesson, setAddTaskModalOpen) => {
    try {
        const response = await axios.post(`${url}/teacher/tasks`, request, {
            withCredentials: true,
        });
        alert("Task added successfully");
        setSelectedLesson((lesson) => ({
            ...lesson,
            tasks: response.data.tasks,
        }));
    } catch (error) {
        console.error("Error adding task: ", error);
        alert(error.response?.data || "Error adding task");
    } finally {
        setAddTaskModalOpen(false);
    }
};
