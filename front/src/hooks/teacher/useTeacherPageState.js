import { useState } from "react";

const useTeacherPageState = () => {
    const [activeTab, setActiveTab] = useState("lessons");

    const [selectedLesson, setSelectedLesson] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [isAddLessonModalOpen, setAddLessonModalOpen] = useState(false);
    const [isDeleteLessonModalOpen, setDeleteLessonModalOpen] = useState(false);
    const [isUpdateLessonModalOpen, setUpdateLessonModalOpen] = useState(false);
    const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false);

    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isAddStudentToGroupModalOpen, setAddStudentToGroupModalOpen] = useState(false);
    const [isDeleteStudentFromGroupModalOpen, setDeleteStudentFromGroupModalOpen] = useState(false);

    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groups, setGroups] = useState([]);
    const [isAddGroupModalOpen, setAddGroupModalOpen] = useState(false);
    const [isDeleteGroupModalOpen, setDeleteGroupModalOpen] = useState(false);
    const [isUpdateGroupNameModalOpen, setUpdateGroupNameModalOpen] = useState(false);

    return {
        activeTab, setActiveTab,
        selectedLesson, setSelectedLesson,
        lessons, setLessons,
        isAddLessonModalOpen, setAddLessonModalOpen,
        isDeleteLessonModalOpen, setDeleteLessonModalOpen,
        isUpdateLessonModalOpen, setUpdateLessonModalOpen,
        isAddTaskModalOpen, setAddTaskModalOpen,
        students, setStudents,
        selectedStudent, setSelectedStudent,
        isAddStudentToGroupModalOpen, setAddStudentToGroupModalOpen,
        isDeleteStudentFromGroupModalOpen, setDeleteStudentFromGroupModalOpen,
        selectedGroup, setSelectedGroup,
        groups, setGroups,
        isAddGroupModalOpen, setAddGroupModalOpen,
        isDeleteGroupModalOpen, setDeleteGroupModalOpen,
        isUpdateGroupNameModalOpen, setUpdateGroupNameModalOpen
    };
};

export default useTeacherPageState;
