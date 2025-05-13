import {useState} from "react";

const useStudentPageState = () => {
    const [activeTab, setActiveTab] = useState("lessons");
    const [currentUser, setCurrentUser] = useState(null);
    const [lessons, setLessons] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [lessonTasks, setLessonTasks] = useState(null);

    return {
        activeTab, setActiveTab,
        currentUser, setCurrentUser,
        lessons,setLessons,
        selectedLesson, setSelectedLesson,
        lessonTasks, setLessonTasks
    }
}

export default useStudentPageState;