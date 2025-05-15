import axios from "../../axiosInstance.js";
import {handleError} from "../handleError.js";

export const handleAddGroup = async (newGroup, setGroups, setAddGroupModalOpen) => {
    try {
        const response = await axios.post(`/teacher/groups`, newGroup);
        alert("Group added successfully");
        setGroups(prev => [...prev, { id: response.data.id, ...response.data }]);
    } catch (error) {
        console.error("Error adding group: ", error);
        alert(error.response?.data || "Error adding group");
    } finally {
        setAddGroupModalOpen(false);
    }
};

export const handleDeleteGroup = async (selectedGroup, setGroups, setDeleteGroupModalOpen) => {
    try {
        const response = await axios.delete(`/teacher/groups/${selectedGroup.id}`);
        alert(response.data);
        setGroups(prev => prev.filter(group => group.id !== selectedGroup.id));
    } catch (error) {
        console.error("Error deleting group: ", error);
        alert(error.response?.data || "Error deleting group");
    } finally {
        setDeleteGroupModalOpen(false);
    }
};

export const handleUpdateGroupName = async (newGroup, setSelectedGroup, setUpdateGroupNameModalOpen) => {
    try {
        const response = await axios.put(`/teacher/groups`, newGroup);
        setSelectedGroup(prev => ({
            ...prev,
            groupName: response.data.groupName
        }));
        alert("Group name updated successfully");
    } catch (error) {
        console.error("Error updating group", error);
        alert(error.response?.data || "Error updating group");
    } finally {
        setUpdateGroupNameModalOpen(false);
    }
};

export const handleGetGroupPage = async (groupId, setSelectedGroup, setActiveTab) => {
    try {
        const response = await axios.get(`/teacher/groups/${groupId}`);
        setSelectedGroup(response.data);
        setActiveTab("group");
    } catch (error) {
        console.error("Error fetching group: ", error);
        alert(error.response?.data || "Error fetching group");
    }
};

export const handleAddStudentToGroup = async (request, setAddStudentToGroupModalOpen, setSelectedGroup) => {

    try {
        const response = await axios.patch(`/teacher/students`, request);
        setSelectedGroup((prevGroup) => ({
            ...prevGroup,
            studentInfos: [...prevGroup.studentInfos, response.data]
        }));
        alert("Student added successfully");
    } catch (error) {
        handleError("Error adding student");
    } finally {
        setAddStudentToGroupModalOpen(false);
    }
};

export const handleDeleteStudentFromGroup = async ( selectedGroup, selectedStudent, setSelectedGroup,
                                                    setDeleteStudentFromGroupModalOpen) => {
    try {
        const request = {
            groupId: selectedGroup.id,
            studentId: selectedStudent.studentId,
        };
        const response = await axios.delete(`/teacher/students`, {
            data: request
        });
        setSelectedGroup((prevGroup) => ({
            ...prevGroup,
            studentInfos: prevGroup.studentInfos.filter(
                (student) => student.studentId !== selectedStudent.studentId
            ),
        }));
        alert(response.data);
    } catch (error) {
        console.error("Error deleting student: ", error);
        alert(error.response?.data || "Error");
    } finally {
        setDeleteStudentFromGroupModalOpen(false);
    }
};
