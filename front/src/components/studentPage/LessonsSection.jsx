import React from 'react';
import {handleGetLessonRoom} from "../../handlers/student/lessonHandlers.js";

const LessonsSection = ({ lessons, onTasks }) => (

    <section className="groups-list">
        <h1>All Lessons</h1>
        {lessons && lessons.length > 0 ? (
            <div className="group-cards">
                {lessons.map((lesson) => (
                    <div key={lesson.id} className="group-card">
                        <h2>{lesson.groupName}</h2>
                        <ul className="group-info">
                            <li>Start: {new Date(lesson.startTime).toLocaleString()}</li>
                            <li>End: {new Date(lesson.endTime).toLocaleString()}</li>
                        </ul>
                        <button onClick={() => handleGetLessonRoom(lesson.id)}>
                            Go to lesson
                        </button>
                        <button
                            style={{
                                background: "yellow",
                                color: "black",
                                marginLeft: "1rem",
                                borderColor: "black",
                            }}
                            onClick={() => onTasks(lesson)}
                        >
                            Tasks
                        </button>
                    </div>
                ))}
            </div>
        ) : (
            <p style={{color: "gray", fontStyle: "italic"}}>
                There are no scheduled lessons yet.
            </p>
        )}
    </section>
);

export default LessonsSection;
