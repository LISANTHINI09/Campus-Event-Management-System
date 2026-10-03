import React, { useState, useEffect } from 'react';
import { studentService } from '../services/studentService';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Users, Mail, Phone, Building, AlertCircle, CheckCircle2 } from 'lucide-react';

const DEPARTMENTS = ['All', 'CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI & DS', 'Other'];

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await studentService.getAllStudents();
        setStudents(data);
      } catch (err) {
        setAlert({ type: 'danger', message: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase()) ||
      s.phoneNumber.includes(search);

    const matchesDept = department === 'All' || s.department === department;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="portal-layout">
      <Sidebar role="ADMIN" />

      <main className="portal-content">
        <div className="admin-page-header">
          <div>
            <h1 className="page-title">Registered Students Directory</h1>
            <p className="page-subtitle">
              Browse student accounts across departments and their contact profiles.
            </p>
          </div>
          <div className="admin-registrations-badge">
            <Users size={16} />
            <span>Total Students: <strong>{students.length}</strong></span>
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

        {/* Search & Department Filter */}
        <div className="admin-filter-bar card">
          <div className="admin-search-wrapper">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by student name, email, department, or phone..."
            />
          </div>

          <div className="admin-filter-dropdowns">
            <div className="admin-filter-item">
              <label>Department:</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="form-control"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Student Table */}
        {loading ? (
          <LoadingSpinner message="Loading registered students..." />
        ) : filteredStudents.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No Students Found"
            message="No students match the current filter criteria."
          />
        ) : (
          <div className="card admin-students-table-card">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Email Address</th>
                    <th>Department</th>
                    <th>Academic Year</th>
                    <th>Phone Number</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <span className="text-muted">#{s.id}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="table-avatar">
                            {s.name ? s.name.charAt(0).toUpperCase() : 'S'}
                          </div>
                          <strong>{s.name}</strong>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Mail size={14} className="text-muted" />
                          <span>{s.email}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-category">{s.department}</span>
                      </td>
                      <td>{s.year}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={14} className="text-muted" />
                          <span>{s.phoneNumber}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-registered">{s.role}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageStudents;
