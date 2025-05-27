import React, { useState } from "react";
import Modal from "../../Modal.jsx";

const AddTeacherModal = ({ onClose, onSubmit }) => {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        hourlyRate: '',
        schedule: '',
        bio: '',
        experienceYears: '',
        chessRating: ''
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        hourlyRate: '',
        schedule: '',
        bio: '',
        experienceYears: '',
        chessRating: ''
    });

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
                if (value.length < 10 || value.length > 100) return '10–100 characters required';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
                break;
            case 'phone':
                if (!/^87[0-9]{9}$/.test(value)) return 'Must start with 87 and have 11 digits';
                break;
            case 'password':
                if (!value.trim()) return 'Field is required';
                if (value.length < 8 || value.length > 255) return '8–255 characters required';
                break;
            case 'hourlyRate':
                const hr = Number(value);
                if (!value.trim()) return 'Field is required';
                if (hr < 1000 || hr > 100000) return 'Must be 1000–100000';
                break;
            case 'schedule':
                if (!value.trim()) return 'Field is required';
                break;
            case 'bio':
                if (!value.trim()) return 'Field is required';
                break;
            case 'experienceYears':
                const exp = Number(value);
                if (!value.trim()) return 'Field is required';
                if (exp < 0 || exp > 50) return 'Must be 0–50';
                break;
            case 'chessRating':
                const rating = Number(value);
                if (!value.trim()) return 'Field is required';
                if (rating < 1000 || rating > 3500) return 'Must be 1000–3500';
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

    const isFormValid = Object.values(errors).every(err => err === '') &&
        Object.values(formData).every(value => value !== '');

    return (
        <Modal onClose={onClose}>
            <h2>Add New Teacher</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();

                    const formData = new FormData(e.target);
                    const newTeacherRequest = {
                        user: {
                            firstName: formData.get("firstName"),
                            lastName: formData.get("lastName"),
                            email: formData.get("email"),
                            phone: formData.get("phone"),
                            password: formData.get("password"),
                        },
                        teacher: {
                            hourlyRate: parseInt(String(formData.get("hourlyRate"))),
                            schedule: formData.get("schedule"),
                            bio: formData.get("bio"),
                            experienceYears: parseInt(String(formData.get("experienceYears"))),
                            chessRating: parseInt(String(formData.get("chessRating"))),
                        }
                    };
                    onSubmit(newTeacherRequest);
                }}
            >
                <div className="form-field">
                    {[
                        ['firstName', 'First Name'],
                        ['lastName', 'Last Name'],
                        ['email', 'Email'],
                        ['password', 'Password'],
                        ['phone', 'Phone'],
                        ['hourlyRate', 'Hourly Rate'],
                        ['schedule', 'Schedule'],
                        ['bio', 'Bio', 'textarea'],
                        ['experienceYears', 'Experience Years'],
                        ['chessRating', 'Chess Rating']
                    ].map(([name, label, type]) => (
                        <div key={name} className="form-grid">
                            <label htmlFor={name}>{label}:</label>
                            {type === 'textarea' ? (
                                <textarea id={name} name={name} value={formData[name]} onChange={handleChange} required />
                            ) : (
                                <input
                                    type={name === 'password' ? 'password' : (name.includes('Rate') || name.includes('Years') || name.includes('Rating')) ? 'number' : 'text'}
                                    id={name}
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    required
                                />
                            )}
                            {errors[name] && <span className="error-text">{errors[name]}</span>}
                        </div>
                    ))}
                </div>
                <button type="submit" className="btn" disabled={!isFormValid}>
                    Save Teacher
                </button>
            </form>
        </Modal>
    )
}

export default AddTeacherModal;