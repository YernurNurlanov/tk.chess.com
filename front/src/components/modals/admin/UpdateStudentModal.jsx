import React, { useState, useEffect } from "react";
import Modal from "../../Modal.jsx";

const UpdateStudentModal = ({ onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        lastPayment: ''
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        lastPayment: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                firstName: initialData.user.firstName || '',
                lastName: initialData.user.lastName || '',
                email: initialData.user.email || '',
                phone: initialData.user.phone || '',
                lastPayment: initialData.lastPayment || ''
            });
        }
    }, [initialData]);

    const nameRegex = /^[A-ZА-Я][a-zа-я]{1,19}$/;
    const isValidName = (name) => nameRegex.test(name);

    const validateField = (name, value) => {
        switch (name) {
            case 'firstName':
            case 'lastName':
                if (!value.trim()) return 'Field is required';
                if (!isValidName(value)) return 'Only letters, first uppercase, 2–20 characters';
                break;
            case 'email':
                if (!value.trim()) return 'Field is required';
                if (value.length < 10 || value.length > 100) return 'Must be between 10 and 100 characters';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
                break;
            case 'phone':
                if (!/^87[0-9]{9}$/.test(value)) return 'Must start with 87 and have 11 digits';
                break;
            case 'lastPayment':
                const now = new Date();
                const dateValue = new Date(value);
                const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                if (isNaN(dateValue.getTime())) return 'Invalid date';
                if (dateValue > now) return 'Date cannot be in the future';
                if (dateValue < oneMonthAgo) return 'Date cannot be more than 1 month ago';
                break;
        }
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        const errorMessage = validateField(name, value);
        setErrors((prev) => ({
            ...prev,
            [name]: errorMessage
        }));
    };

    const isFormValid =
        Object.values(errors).every(err => err === '') &&
        formData.firstName && formData.lastName && formData.email &&
        formData.phone && formData.lastPayment;

    return (
        <Modal onClose={onClose}>
            <h2>Edit Student</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const updatedStudent = {
                        user: {
                            id: initialData.id,
                            firstName: formData.firstName,
                            lastName: formData.lastName,
                            email: formData.email,
                            phone: formData.phone,
                        },
                        student: {
                            lastPayment: formData.lastPayment
                        }
                    };
                    onSubmit(updatedStudent);
                }}
            >
                <div className="form-field">
                    <div className="form-grid">
                        <label htmlFor="firstName">First Name:</label>
                        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                        {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                    </div>
                    <div className="form-grid">
                        <label htmlFor="lastName">Last Name:</label>
                        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                        {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                    </div>
                    <div className="form-grid">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>
                    <div className="form-grid">
                        <label htmlFor="phone">Phone:</label>
                        <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                    </div>
                    <div className="form-grid">
                        <label htmlFor="lastPayment">Last Payment:</label>
                        <input type="datetime-local" id="lastPayment" name="lastPayment" value={formData.lastPayment} onChange={handleChange} required />
                        {errors.lastPayment && <span className="error-text">{errors.lastPayment}</span>}
                    </div>
                </div>
                <button type="submit" className="btn btn-center" disabled={!isFormValid}>
                    Save Changes
                </button>
            </form>
        </Modal>
    );
};

export default UpdateStudentModal;
