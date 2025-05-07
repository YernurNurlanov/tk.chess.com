import React from 'react';
import Modal from "../Modal.jsx"

const AddStudentModal = ({onClose, onSubmit}) => {
    <Modal onClose={onClose}>
        <h2>Add New Student</h2>
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newStudent = {
                    fullName: formData.get("fullName"),
                    email: formData.get("email"),
                    phone: formData.get("phone"),
                    password: formData.get("password"),
                    lastPayment: formData.get("lastPayment"),
                    role: "ROLE_STUDENT"
                };
                handleAddStudent(newStudent);
            }}
        >
            <label htmlFor="fullName">Full Name:</label>
            <input type="text" id="fullName" name="fullName" required/>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required/>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required/>
            <label htmlFor="phone">Phone:</label>
            <input type="phone" id="phone" name="phone" required/>
            <label htmlFor="lastPayment">Last Payment:</label>
            <input type="datetime-local" id="lastPayment" name="lastPayment" required/>
            <button type="submit" className="btn">
                Save Student
            </button>
        </form>
    </Modal>
}

export default AddStudentModal;