import React, { useState, useEffect } from "react";
import Modal from "../../Modal.jsx";

const UpdateTeacherModal = ({ onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
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
        hourlyRate: '',
        schedule: '',
        bio: '',
        experienceYears: '',
        chessRating: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                firstName: initialData.user.firstName || '',
                lastName: initialData.user.lastName || '',
                email: initialData.user.email || '',
                phone: initialData.user.phone || '',
                hourlyRate: initialData.hourlyRate?.toString() || '',
                schedule: initialData.schedule || '',
                bio: initialData.bio || '',
                experienceYears: initialData.experienceYears?.toString() || '',
                chessRating: initialData.chessRating?.toString() || ''
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
                if (value.length < 10 || value.length > 100) return '10–100 characters required';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
                break;
            case 'phone':
                if (!/^87[0-9]{9}$/.test(value)) return 'Must start with 87 and have 11 digits';
                break;
            case 'hourlyRate':
                if (!value.trim()) return 'Field is required';
                const hr = Number(value);
                if (isNaN(hr) || hr < 1000 || hr > 100000) return 'Must be 1000–100000';
                break;
            case 'schedule':
                if (!value.trim()) return 'Field is required';
                break;
            case 'bio':
                if (!value.trim()) return 'Field is required';
                break;
            case 'experienceYears':
                if (!value.trim()) return 'Field is required';
                const exp = Number(value);
                if (isNaN(exp) || exp < 0 || exp > 50) return 'Must be 0–50';
                break;
            case 'chessRating':
                if (!value.trim()) return 'Field is required';
                const rating = Number(value);
                if (isNaN(rating) || rating < 1000 || rating > 3500) return 'Must be 1000–3500';
                break;
        }
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        const errorMessage = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: errorMessage
        }));
    };

    const isFormValid =
        Object.values(errors).every(err => err === '') &&
        formData.firstName &&
        formData.lastName &&
        formData.email &&
        formData.phone &&
        formData.hourlyRate &&
        formData.schedule &&
        formData.bio &&
        formData.experienceYears &&
        formData.chessRating;

    return (
        <Modal onClose={onClose}>
            <h2>Edit Teacher</h2>
            <form
                onSubmit={e => {
                    e.preventDefault();

                    const updatedTeacher = {
                        user: {
                            id: initialData.id,
                            firstName: formData.firstName,
                            lastName: formData.lastName,
                            email: formData.email,
                            phone: formData.phone
                        },
                        teacher: {
                            hourlyRate: parseInt(formData.hourlyRate, 10),
                            schedule: formData.schedule,
                            bio: formData.bio,
                            experienceYears: parseInt(formData.experienceYears, 10),
                            chessRating: parseInt(formData.chessRating, 10),
                        }
                    };
                    onSubmit(updatedTeacher);
                }}
            >
                <div className="form-field">
                    {[
                        ['firstName', 'First Name'],
                        ['lastName', 'Last Name'],
                        ['email', 'Email'],
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
                                <textarea
                                    id={name}
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    required
                                />
                            ) : (
                                <input
                                    type={
                                        name === 'hourlyRate' || name === 'experienceYears' || name === 'chessRating'
                                            ? 'number'
                                            : 'text'
                                    }
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
                <button type="submit" className="btn btn-center" disabled={!isFormValid}>
                    Save Changes
                </button>
            </form>
        </Modal>
    );
};

export default UpdateTeacherModal;
