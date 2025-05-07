const LessonTasksTable = ({ tasks }) => (
    <div className="table">
        <div className="table-row header">
            <div className="table-cell">ID</div>
            <div className="table-cell">Level</div>
            <div className="table-cell">Topic</div>
            <div className="table-cell">Actions</div>
        </div>
        {tasks?.map((task) => (
            <div key={task.id} className="table-row">
                <div className="table-cell">{task.id}</div>
                <div className="table-cell">{task.level}</div>
                <div className="table-cell">{task.topic}</div>
                <div className="table-cell actions">
                    <button className="btn btn-delete" onClick={() => alert("do not work")}>
                        <i className="fas fa-trash"></i>Check
                    </button>
                </div>
            </div>
        ))}
    </div>
);

export default LessonTasksTable;
