import React from 'react';

const GroupsSection = ({groups, handleGetGroupPage, setSelectedGroup, setDeleteGroupModalOpen }) => {

    return (
        <section className="groups-list">
            <h1>All Groups</h1>
            <div className="group-cards">
                {groups.map((group) => (
                    <div
                        key={group.id}
                        className="group-card"
                        onClick={() =>
                            handleGetGroupPage(group.id)
                        }
                    >
                        <h2>{group.groupName}</h2>
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
