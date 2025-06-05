import React from 'react';
import {faUsers} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const GroupsSection = ({groups, handleGetGroupPage, setSelectedGroup, setDeleteGroupModalOpen }) => {

    return (
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
                        <h2><FontAwesomeIcon icon={faUsers} style={{marginRight: "10px"}} />{group.groupName}</h2>
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
    );
};

export default GroupsSection;
