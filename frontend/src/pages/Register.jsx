import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { studentService } from '../services/studentService';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Key, User, Phone, BookOpen, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';

const DEPARTMENTS = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI & DS', 'Other'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'CSE',
    year: '1st Year',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

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
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
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
        department: formData.department,
        year: formData.year,
        phoneNumber: formData.phoneNumber.trim(),
        password: formData.password,
      });

      setSuccessMessage('Registration successful! Logging you in...');
      // Automatically log the new student in
      setTimeout(async () => {
        try {
          await login(formData.email.trim().toLowerCase(), formData.password);
          navigate('/student/dashboard');
        } catch (err) {
          navigate('/login');
        }
      }, 1000);
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
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">College Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="e.g. john.doe@campus.edu"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          {/* Department & Year Grid */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Department</label>
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
            </div>

            <div className="form-group">
              <label className="form-label">Academic Year</label>
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
            </div>
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label className="form-label">Phone Number (10 digits)</label>
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

          {/* Password & Confirm Password */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Password</label>
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
              <label className="form-label">Confirm Password</label>
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
