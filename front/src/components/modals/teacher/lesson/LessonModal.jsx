import React, { useState } from "react";
import Modal from "../../../Modal.jsx";

const LessonModal = ({
                         onClose,
                         mode = "add",
                         groups,
                         currentUser,
                         initialData = {},
                         onSubmit,
                         setModalOpen,
                     }) => {
    const formatDateTimeLocal = (date) => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60 * 1000);
        return localDate.toISOString().slice(0, 16);
    };

    const now = new Date();
    const nowStr = formatDateTimeLocal(now);

    const maxStart = new Date(now);
    maxStart.setMonth(maxStart.getMonth() + 1);
    const maxStartStr = formatDateTimeLocal(maxStart);

    const [startTime, setStartTime] = useState(
        initialData.startTime
            ? formatDateTimeLocal(new Date(initialData.startTime))
            : nowStr
    );

    const [endTime, setEndTime] = useState(
        initialData.endTime
            ? formatDateTimeLocal(new Date(initialData.endTime))
            : ""
    );

    const endTimeMin = startTime;
    const endTimeMax = formatDateTimeLocal(
        new Date(new Date(startTime).getTime() + 2 * 60 * 60 * 1000)
    );

    return (
        <Modal onClose={onClose}>
            <h2>{mode === "add" ? "Add New Lesson" : "Update Lesson"}</h2>
            <form noValidate
                  onSubmit={(e) => {
                    e.preventDefault();

                    if (!startTime || !endTime) {
                        alert("Please select both start and end times.", "error");
                        return;
                    }

                    const now = new Date();
                    const bufferTime = new Date(now.getTime() + 10 * 60 * 1000); // +10 минут
                    const start = new Date(startTime);
                    const end = new Date(endTime);

                    const startHour = start.getHours();
                    const endHour = end.getHours();
                    const durationInMinutes = (end - start) / (1000 * 60);

                    if (start < bufferTime) {
                        alert("Lesson must start at least 10 minutes from now.", "error");
                        return;
                    }

                    if (startHour < 8) {
                        alert("Lesson cannot start before 08:00.", "error");
                        return;
                    }

                    if (endHour >= 22 || (endHour === 21 && end.getMinutes() > 0)) {
                        alert("Lesson must end by 22:00.", "error");
                        return;
                    }

                    if (durationInMinutes < 20) {
                        alert("Lesson duration must be at least 20 minutes.", "error");
                        return;
                    }

                    if (durationInMinutes > 120) {
                        alert("Lesson duration cannot exceed 2 hours.", "error");
                        return;
                    }

                    const formData = new FormData(e.target);
                    const data = {
                        ...(mode === "update" && { lessonId: initialData.id }),
                        ...(mode === "add" && { teacherId: currentUser?.id }),
                        groupId: formData.get("groupId"),
                        startTime,
                        endTime,
                        taskIds: initialData.taskIds || [],
                        presentStudentIds: initialData.presentStudentIds || [],
                    };

                    onSubmit(data, setModalOpen).then();
                }}
            >
                <label htmlFor="groupId">Group:</label>
                <select
                    id="groupId"
                    name="groupId"
                    required
                    defaultValue={initialData.groupId || ""}
                >
                    {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                            {group.groupName}
                        </option>
                    ))}
                </select>

                <label htmlFor="startTime">Start Time:</label>
                <input
                    type="datetime-local"
                    id="startTime"
                    name="startTime"
                    required
                    min={nowStr}
                    max={maxStartStr}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    onKeyDown={(e) => e.preventDefault()}
                    onFocus={(e) => e.target.showPicker?.()}
                />

                <label htmlFor="endTime">End Time:</label>
                <input
                    type="datetime-local"
                    id="endTime"
                    name="endTime"
                    required
                    min={endTimeMin}
                    max={endTimeMax}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    onKeyDown={(e) => e.preventDefault()}
                    onFocus={(e) => e.target.showPicker?.()}
                />

                <button type="submit" className="btn">
                    {mode === "add" ? "Add" : "Update"} Lesson
                </button>
            </form>
        </Modal>
    );
};

export default LessonModal;
