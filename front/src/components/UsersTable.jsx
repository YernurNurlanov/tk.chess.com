import React from "react";


const UsersTable = ({ data, onUpdate, onDelete, onAttach, onDetach }) => {
    const isStudent = (row) => row.hasOwnProperty("teacherId");

  return (
    <div className="table">
        <div className="table-row header">
            <div className="table-cell">ID</div>
            <div className="table-cell">Name</div>
            <div className="table-cell">Email</div>
            {data.some(isStudent) && <div className="table-cell">Teacher ID</div>}
            <div className="table-cell">Actions</div>
        </div>
        {data.map((row) => (
            <div key={row.id} className="table-row">
                <div className="table-cell">{row.id}</div>
                <div className="table-cell">{row.user.lastName} {row.user.firstName}</div>
                <div className="table-cell">{row.user.email}</div>
                {isStudent(row) && (
                    <div className="table-cell">{row.teacherId || "—"}</div>
                )}
                <div className="table-cell actions">
                    {/* Conditionally render Attach button if onAttach is provided */}
                    {onAttach && row.teacherId === null && (
                        <button className="btn btn-attach" onClick={() => onAttach(row)}>
                            <i className="fas fa-link"></i> Attach to Teacher
                        </button>
                    )}
                    {onDetach && row.teacherId !== null && (
                        <button className="btn btn-delete" onClick={() => onDetach(row)}>
                            <i className="fas fa-unlink"></i> Detach
                        </button>
                    )}
                    {/* Conditionally render Update button if onUpdate is provided */}
                    {onUpdate && (
                        <button className="btn btn-update" onClick={() => onUpdate(row)}>
                            <i className="fas fa-edit"></i>Update
                        </button>
                    )}
                    {/* Always render Delete button */}
                    <button className="btn btn-delete" onClick={() => onDelete(row)}>
                        <i className="fas fa-trash"></i>Delete
                    </button>
                </div>
            </div>
        ))}
    </div>
  );
};

export default UsersTable;