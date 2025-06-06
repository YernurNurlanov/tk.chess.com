import React, { useState } from "react";
import styles from "../../styles/weeklySchedule.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
    addDays, startOfWeek, format, isSameDay, getHours, getMinutes, addWeeks, subWeeks, parseISO, isToday
} from "date-fns";
import { enGB } from "date-fns/locale";
import {handleGetLessonPage} from "../../handlers/teacher/lessonHandlers.js";

const WeeklySchedule = ({ onAddLesson, scheduleData = [], setSelectedLesson, setActiveTab, setDeleteLessonModalOpen }) => {
    const [currentWeekStart, setCurrentWeekStart] = useState(
        startOfWeek(new Date(), { weekStartsOn: 1 })
    );
    const hours = Array.from({ length: 15 }, (_, i) => i + 8);
    const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

    const getLessonsForDayHour = (day, hour) => {
        const dayLessons = scheduleData.find(daySchedule => {
            try {
                const lessonDay = parseISO(daySchedule.date);
                return isSameDay(lessonDay, day);
            } catch (e) {
                return false;
            }
        });

        if (!dayLessons || !dayLessons.lessons) return [];

        return dayLessons.lessons.filter(lesson => {
            try {
                const lessonTime = parseISO(lesson.startTime);
                return getHours(lessonTime) === hour;
            } catch (e) {
                console.error("Ошибка обработки времени урока:", lesson.startTime, e);
                return false;
            }
        }).sort((a, b) => parseISO(a.startTime) - parseISO(b.startTime));
    };

    const handlePrevWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));
    const handleNextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));

    return (
        <div className={styles.weeklySchedule}>
            <div className={styles.scheduleHeader}>
                <h1 className={styles.scheduleTitle}>Schedule</h1>
                <div className={styles.weekNavigation}>
                    <button onClick={handlePrevWeek} className={styles.navButton}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>

                    <span className={styles.weekRange}>
                        {format(currentWeekStart, "dd.MM.yyyy")} - {format(addDays(currentWeekStart, 6), "dd.MM.yyyy")}
                    </span>

                    <button onClick={handleNextWeek} className={styles.navButton}>
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>

                <button onClick={onAddLesson} className="btn">
                    <FontAwesomeIcon icon={faPlus} /> Add Lesson
                </button>
            </div>

            <div className={styles.scheduleGrid}>
                <div className={styles.timeColumn}>Time</div>

                {days.map(day => (
                    <div
                        key={day.toString()}
                        className={`${styles.dayHeader} ${isToday(day) ? styles.today : ""}`}
                    >
                        <div>{format(day, "EEE", { locale: enGB }).toUpperCase()}</div>
                        <div>{format(day, "dd.MM")}</div>
                    </div>
                ))}

                {hours.map(hour => (
                    <React.Fragment key={hour}>
                        <div className={styles.timeCell}>{hour}:00</div>

                        {days.map(day => {
                            const lessons = getLessonsForDayHour(day, hour);
                            return (
                                <div
                                    key={day.toString()}
                                    className={`${styles.timeSlot} ${isToday(day) ? styles.today : ""}`}
                                >
                                    {lessons.map(lesson => {
                                        const start = parseISO(lesson.startTime);
                                        const end = parseISO(lesson.endTime);
                                        const top = getMinutes(start);
                                        const height = (end - start) / (1000 * 60);

                                        return (
                                            <div
                                                key={lesson.id}
                                                className={styles.lesson}
                                                style={{
                                                    top: `${top}px`,
                                                    height: `${height}px`
                                                }}
                                                onClick={() => handleGetLessonPage(lesson.id,
                                                    setSelectedLesson, setActiveTab)}
                                            >
                                                <span className={styles.lessonTitle}>{lesson.groupName} </span>
                                                <span className={styles.lessonTime}>
                                                    {format(start, "HH:mm")}-{format(end, "HH:mm")}
                                                </span>
                                                <div className="delete-btn-wrapper">
                                                    <button
                                                        className="delete-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedLesson(lesson);
                                                            setDeleteLessonModalOpen(true);
                                                        }}
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default WeeklySchedule;