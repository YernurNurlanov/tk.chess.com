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

    const [errors, setErrors] = useState({
        startTime: "",
        endTime: "",
    });

    const isFormValid = Object.values(errors).every((err) => err === "");

    function formatDateTimeLocal(date) {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60 * 1000);
        return localDate.toISOString().slice(0, 16);
    }

    const initialStart = initialData.startTime
        ? formatDateTimeLocal(new Date(initialData.startTime))
        : formatDateTimeLocal(new Date());

    const initialEnd = initialData.endTime
        ? formatDateTimeLocal(new Date(initialData.endTime))
        : "";

    const validateField = (name, value, otherValue = null) => {
        const now = new Date();
        const bufferTime = new Date(now.getTime() + 10 * 60 * 1000);
        const start = name === "startTime" ? new Date(value) : new Date(otherValue);
        const end = name === "endTime" ? new Date(value) : new Date(otherValue);

        switch (name) {
            case "startTime": {
                const val = new Date(value);
                if (isNaN(val.getTime())) return "Invalid date";
                if (val < bufferTime) return "Must be at least 10 minutes from now";
                if (val.getHours() < 8) return "Cannot start before 08:00";
                break;
            }
            case "endTime": {
                const val = new Date(value);
                if (isNaN(val.getTime())) return "Invalid date";
                if (val <= start) return "End must be after start";
                if (val.getHours() >= 22 || (val.getHours() === 21 && val.getMinutes() > 0))
                    return "Must end by 22:00";
                const duration = (val - start) / 60000;
                if (duration < 20) return "Minimum duration is 20 minutes";
                if (duration > 120) return "Maximum duration is 2 hours";
                break;
            }
        }
        return "";
    };

    const handleChange = (e) => {
        const { form } = e.target;

        const start = form.startTime.value;
        const end = form.endTime.value;

        setErrors((prev) => ({
            ...prev,
            startTime: validateField("startTime", start, end),
            endTime: validateField("endTime", end, start),
        }));
    };

    return (
        <Modal onClose={onClose}>
            <h2>{mode === "add" ? "Add New Lesson" : "Update Lesson"}</h2>
            <form noValidate className="form-field"
                  onSubmit={(e) => {
                      e.preventDefault();

                      const formData = new FormData(e.target);
                      const startTime = formData.get("startTime");
                      const endTime = formData.get("endTime");

                      const data = {
                          ...(mode === "update" && {lessonId: initialData.id}),
                          ...(mode === "add" && {teacherId: currentUser?.id}),
                          groupId: formData.get("groupId"),
                          startTime,
                          endTime,
                          taskIds: initialData.taskIds || [],
                          presentStudentIds: initialData.presentStudentIds || [],
                      };

                      onSubmit(data, setModalOpen).then();
                  }}
            >
                <div className="form-grid">
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
                </div>
                <div className="form-grid">
                    <label htmlFor="startTime">Start Time:</label>
                    <input
                        type="datetime-local"
                        id="startTime"
                        name="startTime"
                        required
                        defaultValue={initialStart}
                        onChange={handleChange}
                        onKeyDown={(e) => e.preventDefault()}
                        onFocus={(e) => e.target.showPicker?.()}
                    />
                    {errors.startTime && <span className="error-text">{errors.startTime}</span>}
                </div>
                <div className="form-grid">
                    <label htmlFor="endTime">End Time:</label>
                    <input
                        type="datetime-local"
                        id="endTime"
                        name="endTime"
                        required
                        defaultValue={initialEnd}
                        onChange={handleChange}
                        onKeyDown={(e) => e.preventDefault()}
                        onFocus={(e) => e.target.showPicker?.()}
                    />
                    {errors.endTime && <span className="error-text">{errors.endTime}</span>}
                </div>
                <button type="submit" className="btn" disabled={!isFormValid}>
                    {mode === "add" ? "Add" : "Update"} Lesson
                </button>
            </form>
        </Modal>
    );
};

export default LessonModal;
