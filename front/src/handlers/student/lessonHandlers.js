import socket from '../../socket';
import ACTIONS from "../../socket/actions.js";
import axios from "../../axiosInstance.js";
import {handleError} from "../handleError.js";

export const handleGetLessonRoom = (lessonId) => {
    if (!socket.connected) {
        alert('Нет соединения с сервером. Попробуйте позже.');
        return;
    }

    socket.emit(ACTIONS.IS_TEACHER_ONLINE, {
        roomID: String(lessonId)
    });

    socket.once(ACTIONS.TEACHER_ONLINE_STATUS, ({ roomID, online }) => {
        if (!online) {
            alert('Учитель ещё не подключился к уроку.');
            return;
        }

        window.open(`/room/${roomID}`, '_blank');
    });
};

export const handleGetLessonTasks = async (studentId, lessonId, setLessonTasks, setActiveTab) => {
    try {
        const request = {
            studentId: studentId,
            lessonId: lessonId
        };
        const response = await axios.get(`/student/tasks`, {
            params: request
        });
        setLessonTasks(response.data);
        setActiveTab("tasks");
    } catch (error) {
        handleError(error, "Error fetching lesson");
    }
};

export const handleCheckTask = async (studentId, task) => {
    try {
        const response = await axios.patch(`/student/${studentId}/check`, task);
        return response.data;
    } catch (error) {
        handleError(error, "Error checking task");
    }
}
