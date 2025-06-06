import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleInfo, faEdit, faLink, faTrash, faUnlink} from "@fortawesome/free-solid-svg-icons";

const UsersTable = ({ data, searchTerm, onUpdate, onDelete, onAttach, onDetach }) => {
    const isStudent = (row) => row.hasOwnProperty("teacherId");

    const filteredData = data?.filter(row => {
        const fullName = `${row.user.lastName} ${row.user.firstName}`.toLowerCase();
        const email = row.user.email.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
    });

  return (
      <>
          {filteredData?.length === 0 ? (
              <div className="empty-state">
                  <FontAwesomeIcon icon={faCircleInfo} className="empty-icon" />
                  <span>There are no {isStudent ? "students" : "teachers"} yet.</span>
              </div>
          ) : (
              <div className="table">
                  <div className="table-row header">
                      <div className="table-cell">ID</div>
                      <div className="table-cell">Name</div>
                      <div className="table-cell">Email</div>
                      {data.some(isStudent) && <div className="table-cell">Teacher ID</div>}
                      {onDelete && <div className="table-cell">Actions</div>}
                  </div>
                  {filteredData.map((row) => (
                      <div key={row.id} className="table-row">
                          <div className="table-cell">{row.id}</div>
                          <div className="table-cell">{row.user.lastName} {row.user.firstName}</div>
                          <div className="table-cell">{row.user.email}</div>
                          {isStudent(row) && (
                              <div className="table-cell">{row.teacherId || "—"}</div>
                          )}
                          {onDelete && (
                              <div className="table-cell actions">
                                  {onAttach && row.teacherId === null && (
                                      <button className="btn btn-attach" onClick={() => onAttach(row)}>
                                          <FontAwesomeIcon icon={faLink} /> Attach to Teacher
                                      </button>
                                  )}
                                  {onDetach && row.teacherId !== null && (
                                      <button className="btn btn-delete" onClick={() => onDetach(row)}>
                                          <FontAwesomeIcon icon={faUnlink} /> Detach
                                      </button>
                                  )}

                                  {onUpdate && (
                                      <button className="btn btn-update" onClick={() => onUpdate(row)}>
                                          <FontAwesomeIcon icon={faEdit} /> Update
                                      </button>
                                  )}
                                  <button className="btn btn-delete" onClick={() => onDelete(row)}>
                                      <FontAwesomeIcon icon={faTrash} /> Delete
                                  </button>
                              </div>
                          )}
                      </div>
                  ))}
              </div>
          )}
      </>

  );
};

export default UsersTable;