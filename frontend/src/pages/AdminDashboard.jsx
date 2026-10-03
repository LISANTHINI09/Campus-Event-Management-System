import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Calendar, 
  Users, 
  BookmarkCheck, 
  CheckCircle2, 
  Clock, 
  PlusCircle, 
  ArrowRight,
  ClipboardList,
  AlertCircle,
  Tag
} from 'lucide-react';

const AdminDashboard = () => {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin && currentUser) {
      navigate('/student/dashboard');
      return;
    }

    const fetchAdminStats = async () => {
      try {
        const data = await dashboardService.getAdminDashboard();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, [currentUser, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="portal-layout">
        <Sidebar role="ADMIN" />
        <main className="portal-content">
          <LoadingSpinner message="Loading admin dashboard analytics..." />
        </main>
      </div>
    );
  }

  return (
    <div className="portal-layout">
      <Sidebar role="ADMIN" />

      <main className="portal-content">
        {/* Admin Header */}
        <div className="admin-page-header">
          <div>
            <h1 className="page-title">Admin Event Dashboard</h1>
            <p className="page-subtitle">
              Overview of campus activities, student participations, and event registrations.
            </p>
          </div>
          <div className="admin-quick-actions">
            <Link to="/admin/events/new" className="btn btn-primary btn-sm">
              <PlusCircle size={16} />
              <span>Create New Event</span>
            </Link>
            <Link to="/admin/registrations" className="btn btn-secondary btn-sm">
              <ClipboardList size={16} />
              <span>Registrations</span>
            </Link>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginTop: '1rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* 5 KPI Metric Cards */}
        <div className="dashboard-metrics-grid-5">
          <DashboardCard
            title="Total Events"
            value={stats?.totalEvents || 0}
            icon={Calendar}
            subtitle="All scheduled"
            variant="blue"
          />
          <DashboardCard
            title="Upcoming Events"
            value={stats?.upcomingEvents || 0}
            icon={Clock}
            subtitle="Awaiting date"
            variant="emerald"
          />
          <DashboardCard
            title="Completed Events"
            value={stats?.completedEvents || 0}
            icon={CheckCircle2}
            subtitle="Concluded"
            variant="slate"
          />
          <DashboardCard
            title="Total Students"
            value={stats?.totalStudents || 0}
            icon={Users}
            subtitle="Enrolled accounts"
            variant="purple"
          />
          <DashboardCard
            title="Total Registrations"
            value={stats?.totalRegistrations || 0}
            icon={BookmarkCheck}
            subtitle="Active slots filled"
            variant="amber"
          />
        </div>

        {/* Dashboard 2-column Layout */}
        <div className="admin-dashboard-row">
          {/* Left Column: Upcoming Events & Live Capacities */}
          <div className="admin-dashboard-col-left">
            <div className="card admin-table-card">
              <div className="card-header-flex">
                <h3>Upcoming Scheduled Events</h3>
                <Link to="/admin/events" className="btn btn-secondary btn-sm">
                  <span>View All</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Capacity Filled</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.upcomingEventsList?.slice(0, 5).map((e) => (
                      <tr key={e.id}>
                        <td>
                          <Link to={`/admin/events/edit/${e.id}`}>
                            <strong>{e.eventName}</strong>
                          </Link>
                        </td>
                        <td>
                          <span className="badge badge-category">{e.category}</span>
                        </td>
                        <td>{e.eventDate}</td>
                        <td>
                          <div style={{ minWidth: '110px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                              <span>{e.currentRegisteredCount} / {e.maxParticipants}</span>
                              <span><strong>{e.availableSeats}</strong> left</span>
                            </div>
                            <div className="seat-progress-bar" style={{ height: '5px', marginTop: '3px' }}>
                              <div
                                className="seat-progress-fill"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (e.currentRegisteredCount / (e.maxParticipants || 1)) * 100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-upcoming">{e.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Category Breakdown & Quick Info */}
          <div className="admin-dashboard-col-right">
            <div className="card admin-breakdown-card">
              <div className="card-header-flex">
                <h3>Events by Category</h3>
                <Tag size={18} className="text-muted" />
              </div>

              <div className="category-breakdown-list">
                {stats?.categoryWiseEvents &&
                  Object.entries(stats.categoryWiseEvents).map(([cat, count]) => (
                    <div key={cat} className="category-breakdown-item">
                      <span className="cat-name">{cat}</span>
                      <div className="cat-bar-wrapper">
                        <div
                          className="cat-bar-fill"
                          style={{
                            width: `${Math.min(100, (count / (stats.totalEvents || 1)) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="cat-count-badge">{count}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Quick Admin Actions Box */}
            <div className="card admin-shortcut-card">
              <h4>Quick Coordinator Actions</h4>
              <p className="text-muted" style={{ fontSize: '0.88rem', marginBottom: '1rem' }}>
                Manage campus activities directly:
              </p>
              <div className="shortcut-btn-group">
                <Link to="/admin/events/new" className="btn btn-primary btn-sm full-width">
                  <PlusCircle size={16} />
                  <span>Create New Campus Event</span>
                </Link>
                <Link to="/admin/registrations" className="btn btn-secondary btn-sm full-width">
                  <ClipboardList size={16} />
                  <span>Verify Student Attendance</span>
                </Link>
                <Link to="/admin/students" className="btn btn-secondary btn-sm full-width">
                  <Users size={16} />
                  <span>View Registered Students</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
