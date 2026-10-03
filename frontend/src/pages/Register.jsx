import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { studentService } from '../services/studentService';
import { UserPlus, Mail, Key, User, Phone, Building, AlertCircle, CheckCircle2 } from 'lucide-react';

const DEPARTMENTS = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI & DS', 'Other'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    department: 'CSE',
    year: '1st Year',
    collegeName: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Phone number must be a valid 10-digit number';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.year) {
      newErrors.year = 'Academic year is required';
    }

    if (!formData.collegeName.trim()) {
      newErrors.collegeName = 'College name is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await studentService.register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber.trim(),
        department: formData.department,
        year: formData.year,
        collegeName: formData.collegeName.trim(),
        password: formData.password,
      });

      setSuccessMessage('Registration successful! Redirecting to login...');
      // Flow: Create Account -> Login -> Browse Events
      setTimeout(() => {
        navigate('/login', {
          state: { successMessage: 'Account created successfully! Please sign in with your credentials.' },
        });
      }, 1200);
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card card register-card">
        <div className="auth-header">
          <div className="auth-icon-circle">
            <UserPlus size={26} />
          </div>
          <h2>Student Registration</h2>
          <p className="text-muted">Create your campus event account</p>
        </div>

        {serverError && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{serverError}</span>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* 1. Full Name */}
          <div className="form-group">
            <label className="form-label">
              Full Name <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          {/* 2. Email */}
          <div className="form-group">
            <label className="form-label">
              College Email Address <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="e.g. rahul.sharma@campus.edu"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          {/* 3. Phone Number */}
          <div className="form-group">
            <label className="form-label">
              Phone Number (10 digits) <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <Phone size={18} className="input-icon" />
              <input
                type="tel"
                name="phoneNumber"
                className="form-control"
                placeholder="e.g. 9845123456"
                value={formData.phoneNumber}
                onChange={handleChange}
                maxLength="10"
              />
            </div>
            {errors.phoneNumber && <p className="form-error">{errors.phoneNumber}</p>}
          </div>

          {/* 4 & 5. Department & Year Grid */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">
                Department <span className="required-star">*</span>
              </label>
              <select
                name="department"
                className="form-control"
                value={formData.department}
                onChange={handleChange}
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && <p className="form-error">{errors.department}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Academic Year <span className="required-star">*</span>
              </label>
              <select
                name="year"
                className="form-control"
                value={formData.year}
                onChange={handleChange}
              >
                {YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
              {errors.year && <p className="form-error">{errors.year}</p>}
            </div>
          </div>

          {/* 6. College Name */}
          <div className="form-group">
            <label className="form-label">
              College Name <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <Building size={18} className="input-icon" />
              <input
                type="text"
                name="collegeName"
                className="form-control"
                placeholder="e.g. Campus Institute of Technology"
                value={formData.collegeName}
                onChange={handleChange}
              />
            </div>
            {errors.collegeName && <p className="form-error">{errors.collegeName}</p>}
          </div>

          {/* 7 & 8. Password & Confirm Password */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">
                Password <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <Key size={18} className="input-icon" />
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Min. 6 chars"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Confirm Password <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <Key size={18} className="input-icon" />
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              {errors.confirmPassword && (
                <p className="form-error">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg full-width auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="auth-footer-link">
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
