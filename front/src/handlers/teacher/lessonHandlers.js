import axios from "../../axiosInstance.js";
import {handleError} from "../handleError.js";

export const handleAddLesson = async (newLesson, setLessons, setAddLessonModalOpen) => {
    try {
        const response = await axios.post(`/teacher/lessons`, newLesson);
        const addedLesson = response.data;
        setLessons((prev) => {
            const lessonDate = addedLesson.startTime.split("T")[0];
            const existingDay = prev.find((d) => d.date === lessonDate);

            if (existingDay) {
                return prev.map((d) =>
                    d.date === lessonDate
                        ? { ...d, lessons: [...d.lessons, addedLesson] }
                        : d
                );
            } else {
                return [...prev, { date: lessonDate, lessons: [addedLesson] }];
            }
        });
        alert("Lesson added successfully");
        setAddLessonModalOpen(false);
    } catch (error) {
        handleError(error, "Error adding lesson");
    }
};

export const handleDeleteLesson = async (selectedLesson, setLessons, setDeleteLessonModalOpen) => {
    try {
        const response = await axios.delete(`/teacher/lessons/${selectedLesson.id}`);
        alert(response.data);

        setLessons((prevLessons) =>
            prevLessons
                .map((day) => ({
                    ...day,
                    lessons: day.lessons.filter((l) => l.id !== selectedLesson.id)
                }))
                .filter((day) => day.lessons.length > 0)
        );
    } catch (error) {
        handleError(error, "Error deleting lesson");
    } finally {
        setDeleteLessonModalOpen(false);
    }
};

export const handleUpdateLesson = async (request, setSelectedLesson, setUpdateLessonModalOpen) => {
    try {
        const response = await axios.put(`/teacher/lessons`, request);
        alert("Lesson updated successfully");
        setSelectedLesson(response.data);
        setUpdateLessonModalOpen(false);
    } catch (error) {
        handleError(error, "Error updating lesson");
    }
};

export const handleGetLessonPage = async (lessonId, setSelectedLesson, setActiveTab) => {
    try {
        const response = await axios.get(`/teacher/lessons/${lessonId}`);
        setSelectedLesson(response.data);
        setActiveTab("lesson");
    } catch (error) {
        handleError(error, "Error fetching lesson");
    }
};

export const handleSubmitAttendance = async (request) => {
    try {
        await axios.post(`/teacher/attendance`, request);
        alert("Attendance submitted successfully");
    } catch (error) {
        handleError(error, "Error submitting attendance");
    }
};

export const handleAddTask = async (request, setSelectedLesson, setAddTaskModalOpen) => {
    try {
        const response = await axios.post(`/teacher/tasks`, request);
        alert("Task added successfully");
        setSelectedLesson((lesson) => ({
            ...lesson,
            tasks: response.data.tasks,
        }));
    } catch (error) {
        handleError(error, "Error adding task");
    } finally {
        setAddTaskModalOpen(false);
    }
};
