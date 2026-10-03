import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentService } from '../services/studentService';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  Key, 
  CheckCircle2, 
  AlertCircle,
  Save,
  Shield
} from 'lucide-react';

const DEPARTMENTS = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI & DS', 'Other'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Faculty'];

const Profile = () => {
  const { currentUser, updateProfile, isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    department: 'CSE',
    year: '1st Year',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      try {
        const data = await studentService.getProfile(currentUser.id);
        setFormData({
          name: data.name || '',
          department: data.department || 'CSE',
          year: data.year || '1st Year',
          phoneNumber: data.phoneNumber || '',
          password: '',
          confirmPassword: '',
        });
      } catch (err) {
        setAlert({ type: 'danger', message: err.message });
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) {
      fetchCurrentProfile();
    }
  }, [currentUser]);

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

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Phone number must be a valid 10-digit number';
    }

    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'New password must be at least 6 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        department: formData.department,
        year: formData.year,
        phoneNumber: formData.phoneNumber.trim(),
        password: formData.password ? formData.password : null,
      };

      const updated = await studentService.updateProfile(currentUser.id, payload);
      updateProfile({
        name: updated.name,
        department: updated.department,
        year: updated.year,
        phoneNumber: updated.phoneNumber,
      });

      setAlert({
        type: 'success',
        message: 'Profile details updated successfully!',
      });

      // Clear password inputs
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      setAlert({ type: 'danger', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="portal-layout">
      <Sidebar role={isAdmin ? 'ADMIN' : 'STUDENT'} />

      <main className="portal-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Profile Settings</h1>
            <p className="page-subtitle">
              Manage your student profile information and security credentials.
            </p>
          </div>
        </div>

        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{alert.message}</span>
            <button
              onClick={() => setAlert(null)}
              className="alert-close-btn"
              style={{ marginLeft: 'auto', background: 'none' }}
            >
              ×
            </button>
          </div>
        )}

        {loading ? (
          <LoadingSpinner message="Loading profile..." />
        ) : (
          <div className="profile-grid">
            {/* Profile Overview Card */}
            <div className="card profile-overview-card">
              <div className="profile-avatar-large">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h3>{currentUser?.name}</h3>
              <p className="profile-email">{currentUser?.email}</p>
              <div className="profile-badges-row">
                <span className={`badge ${isAdmin ? 'badge-cancelled' : 'badge-registered'}`}>
                  {currentUser?.role}
                </span>
                <span className="badge badge-category">{currentUser?.department}</span>
              </div>

              <div className="profile-info-list">
                <div className="profile-info-row">
                  <span className="profile-info-label">Student ID:</span>
                  <span className="profile-info-val">#{currentUser?.id}</span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Academic Year:</span>
                  <span className="profile-info-val">{currentUser?.year}</span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Phone:</span>
                  <span className="profile-info-val">{currentUser?.phoneNumber}</span>
                </div>
              </div>
            </div>

            {/* Profile Edit Form Card */}
            <div className="card profile-edit-card">
              <div className="profile-card-header">
                <h3>Update Personal Details</h3>
                <p className="text-muted">Keep your contact and departmental details current.</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="input-with-icon">
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.name && <p className="form-error">{errors.name}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Email (Cannot be modified)</label>
                  <div className="input-with-icon">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      className="form-control"
                      value={currentUser?.email || ''}
                      disabled
                      style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
                    />
                  </div>
                </div>

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

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div className="input-with-icon">
                    <Phone size={18} className="input-icon" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      className="form-control"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      maxLength="10"
                    />
                  </div>
                  {errors.phoneNumber && <p className="form-error">{errors.phoneNumber}</p>}
                </div>

                <hr style={{ margin: '1.5rem 0', borderColor: '#e2e8f0' }} />

                <div className="form-group">
                  <h4>Change Password</h4>
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                    Leave blank if you do not wish to change your current password.
                  </p>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <div className="input-with-icon">
                      <Key size={18} className="input-icon" />
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Leave blank to keep current"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.password && <p className="form-error">{errors.password}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <div className="input-with-icon">
                      <Key size={18} className="input-icon" />
                      <input
                        type="password"
                        name="confirmPassword"
                        className="form-control"
                        placeholder="Re-enter new password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="form-error">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    <Save size={16} />
                    <span>{isSubmitting ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
