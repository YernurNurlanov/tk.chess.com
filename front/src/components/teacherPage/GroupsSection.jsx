import React from 'react';
import {faCircleInfo, faUsers} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const GroupsSection = ({groups, handleGetGroupPage, setSelectedGroup, setDeleteGroupModalOpen }) => {

    return (
        <>
            {groups?.length === 0 ? (
                <div className="empty-state">
                    <FontAwesomeIcon icon={faCircleInfo} className="empty-icon" />
                    <span>There are no groups yet. Click <strong>Add Group</strong> to create one.</span>
                </div>
            ) : (
                <section className="groups-list">
                    <div className="group-cards">
                        {groups.map((group) => (
                            <div
                                key={group.id}
                                className="group-card"
                                onClick={() =>
                                    handleGetGroupPage(group.id)
                                }
                            >
                                <h2><FontAwesomeIcon icon={faUsers} style={{marginRight: "10px"}}/>{group.groupName}</h2>
                                <div className="delete-btn-wrapper">
                                    <button
                                        className="delete-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedGroup(group);
                                            setDeleteGroupModalOpen(true);
                                        }}
                                    >
                                        &times;
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </>

    );
};

export default GroupsSection;
