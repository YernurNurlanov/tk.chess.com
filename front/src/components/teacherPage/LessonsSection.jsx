const LessonsSection = ({ lessons, setSelectedLesson, setDeleteLessonModalOpen, handleGetLessonPage }) => (

    <section className="groups-list">
        <h1>All Lessons</h1>
        <div className="group-cards">
            {lessons.map((lesson) => (
                <div key={lesson.id} className="group-card" onClick={() => handleGetLessonPage(lesson.id)}>
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
                    <h2>{lesson.groupName}</h2>
                    <ul className="group-students">
                        <li>Start: {new Date(lesson.startTime).toLocaleString()}</li>
                        <li>End: {new Date(lesson.endTime).toLocaleString()}</li>
                    </ul>
                </div>
            ))}
        </div>
    </section>
);

export default LessonsSection;
