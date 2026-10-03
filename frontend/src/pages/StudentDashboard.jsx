import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { 
  Calendar, 
  BookmarkCheck, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  MapPin
} from 'lucide-react';

const StudentDashboard = () => {
  const { currentUser, isStudent } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isStudent && currentUser) {
      navigate('/admin/dashboard');
      return;
    }

    const fetchStudentDashboard = async () => {
      try {
        const data = await dashboardService.getStudentDashboard(currentUser.id);
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) {
      fetchStudentDashboard();
    }
  }, [currentUser, isStudent, navigate]);

  if (loading) {
    return (
      <div className="portal-layout">
        <Sidebar role="STUDENT" />
        <main className="portal-content">
          <LoadingSpinner message="Loading student dashboard..." />
        </main>
      </div>
    );
  }

  return (
    <div className="portal-layout">
      <Sidebar role="STUDENT" />

      <main className="portal-content">
        {/* Welcome Banner */}
        <div className="dashboard-welcome-banner card">
          <div className="welcome-banner-text">
            <h2>Welcome back, {currentUser?.name}! 👋</h2>
            <p className="welcome-banner-sub">
              {currentUser?.department} Department • {currentUser?.year} • Student Portal
            </p>
          </div>
          <Link to="/events" className="btn btn-primary btn-sm welcome-banner-cta">
            <Sparkles size={16} />
            <span>Discover Events</span>
          </Link>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginTop: '1rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Metric Cards Row */}
        <div className="dashboard-metrics-grid">
          <DashboardCard
            title="Total Registered Events"
            value={dashboardData?.totalRegisteredEvents || 0}
            icon={BookmarkCheck}
            subtitle="Active participations"
            variant="blue"
          />
          <DashboardCard
            title="Upcoming Events"
            value={dashboardData?.upcomingRegisteredEvents || 0}
            icon={Calendar}
            subtitle="Scheduled ahead"
            variant="emerald"
          />
          <DashboardCard
            title="Department"
            value={currentUser?.department || 'N/A'}
            icon={Clock}
            subtitle={currentUser?.year}
            variant="purple"
          />
        </div>

        {/* Section 1: My Upcoming Registered Events */}
        <div className="dashboard-section">
          <div className="section-header-flex">
            <div>
              <h3 className="dashboard-section-title">My Registered Events (Upcoming)</h3>
              <p className="text-muted">Events you are currently confirmed to attend.</p>
            </div>
            <Link to="/student/registrations" className="btn btn-secondary btn-sm">
              <span>View All Registrations</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {dashboardData?.myUpcomingRegistrations?.length > 0 ? (
            <div className="registered-events-table-card card">
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Event Name</th>
                      <th>Category</th>
                      <th>Date & Time</th>
                      <th>Venue</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.myUpcomingRegistrations.map((reg) => (
                      <tr key={reg.id}>
                        <td>
                          <strong>{reg.eventName}</strong>
                        </td>
                        <td>
                          <span className="badge badge-category">{reg.eventCategory}</span>
                        </td>
                        <td>
                          {reg.eventDate} ({reg.eventStartTime})
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={14} className="text-muted" />
                            <span>{reg.eventVenue}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-registered">{reg.status}</span>
                        </td>
                        <td>
                          <Link to={`/events/${reg.eventId}`} className="btn btn-secondary btn-sm">
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="No Upcoming Events"
              message="You haven't registered for any upcoming events yet. Explore events and reserve your seat!"
              actionText="Browse Upcoming Events"
              onAction={() => navigate('/events')}
            />
          )}
        </div>

        {/* Section 2: Recommended Campus Events */}
        <div className="dashboard-section">
          <div className="section-header-flex">
            <div>
              <h3 className="dashboard-section-title">Recommended Campus Events</h3>
              <p className="text-muted">Popular activities happening around campus this month.</p>
            </div>
            <Link to="/events" className="btn btn-secondary btn-sm">
              <span>Explore All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="event-grid">
            {dashboardData?.recommendedEvents?.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
