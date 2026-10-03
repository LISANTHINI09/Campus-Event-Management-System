import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { registrationService } from '../services/registrationService';
import { eventService } from '../services/eventService';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { 
  ClipboardList, 
  Users, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Filter as FilterIcon,
  Download
} from 'lucide-react';

const EventRegistrations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedEventId = searchParams.get('eventId') || '';

  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [alert, setAlert] = useState(null);

  const fetchRegistrations = async () => {
    try {
      if (selectedEventId) {
        const data = await registrationService.getEventRegistrations(selectedEventId);
        setRegistrations(data);
      } else {
        const data = await registrationService.getAllRegistrations();
        setRegistrations(data);
      }
    } catch (err) {
      setAlert({ type: 'danger', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEventsList = async () => {
      try {
        const eventData = await eventService.getEvents();
        setEvents(eventData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEventsList();
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchRegistrations();
  }, [selectedEventId]);

  const handleStatusChange = async (regId, newStatus) => {
    try {
      await registrationService.updateStatus(regId, newStatus);
      setAlert({
        type: 'success',
        message: `Registration #${regId} status updated to ${newStatus}.`,
      });
      fetchRegistrations();
    } catch (err) {
      setAlert({ type: 'danger', message: err.message });
    }
  };

  const handleEventFilterChange = (e) => {
    const val = e.target.value;
    if (val) {
      setSearchParams({ eventId: val });
    } else {
      setSearchParams({});
    }
  };

  const filtered = registrations.filter((r) => {
    const matchesSearch =
      !search ||
      r.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      r.studentEmail?.toLowerCase().includes(search.toLowerCase()) ||
      r.studentDepartment?.toLowerCase().includes(search.toLowerCase()) ||
      r.eventName?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="portal-layout">
      <Sidebar role="ADMIN" />

      <main className="portal-content">
        <div className="admin-page-header">
          <div>
            <h1 className="page-title">Event Registrations & Attendance</h1>
            <p className="page-subtitle">
              Verify enrolled students, review attendance, and manage registration statuses.
            </p>
          </div>
          <div className="admin-registrations-badge">
            <Users size={16} />
            <span>Total Shown: <strong>{filtered.length}</strong></span>
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

        {/* Filters and Search Bar */}
        <div className="admin-filter-bar card">
          <div className="admin-search-wrapper">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by student name, email, department, or event..."
            />
          </div>

          <div className="admin-filter-dropdowns">
            {/* Filter by Event */}
            <div className="admin-filter-item">
              <label>Filter by Event:</label>
              <select
                value={selectedEventId}
                onChange={handleEventFilterChange}
                className="form-control"
              >
                <option value="">All Events</option>
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.eventName} ({e.eventDate})
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div className="admin-filter-item">
              <label>Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-control"
              >
                <option value="ALL">All Statuses</option>
                <option value="REGISTERED">Registered</option>
                <option value="ATTENDED">Attended</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Registrations Table */}
        {loading ? (
          <LoadingSpinner message="Loading registration records..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No Registrations Found"
            message="No student registrations match your current event or search filter."
          />
        ) : (
          <div className="card admin-registrations-table-card">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Reg #</th>
                    <th>Student Name</th>
                    <th>Contact & Department</th>
                    <th>Event Enrolled</th>
                    <th>Registered Date</th>
                    <th>Status</th>
                    <th>Update Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((reg) => (
                    <tr key={reg.id}>
                      <td>
                        <span className="text-muted">#{reg.id}</span>
                      </td>
                      <td>
                        <strong>{reg.studentName}</strong>
                        <p className="text-muted" style={{ fontSize: '0.82rem' }}>
                          {reg.studentEmail}
                        </p>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>
                          <span className="badge badge-category">{reg.studentDepartment}</span>{' '}
                          <span className="text-muted">{reg.studentYear}</span>
                          <div style={{ color: '#64748b', marginTop: '2px' }}>
                            Ph: {reg.studentPhone}
                          </div>
                        </div>
                      </td>
                      <td>
                        <Link to={`/events/${reg.eventId}`}>
                          <strong>{reg.eventName}</strong>
                        </Link>
                        <p className="text-muted" style={{ fontSize: '0.82rem' }}>
                          {reg.eventDate} ({reg.eventStartTime})
                        </p>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem' }}>
                          {reg.registrationDate
                            ? new Date(reg.registrationDate).toLocaleDateString()
                            : 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            reg.status === 'REGISTERED'
                              ? 'badge-registered'
                              : reg.status === 'ATTENDED'
                              ? 'badge-attended'
                              : 'badge-cancelled'
                          }`}
                        >
                          {reg.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-status-actions">
                          {reg.status !== 'ATTENDED' && (
                            <button
                              onClick={() => handleStatusChange(reg.id, 'ATTENDED')}
                              className="btn btn-secondary btn-sm"
                              title="Mark as Attended"
                            >
                              <CheckCircle2 size={14} className="text-success" />
                              <span>Attended</span>
                            </button>
                          )}
                          {reg.status !== 'CANCELLED' && (
                            <button
                              onClick={() => handleStatusChange(reg.id, 'CANCELLED')}
                              className="btn btn-secondary btn-sm"
                              title="Mark as Cancelled"
                            >
                              <XCircle size={14} className="text-danger" />
                              <span>Cancel</span>
                            </button>
                          )}
                          {reg.status === 'CANCELLED' && (
                            <button
                              onClick={() => handleStatusChange(reg.id, 'REGISTERED')}
                              className="btn btn-secondary btn-sm"
                              title="Reactivate Registration"
                            >
                              <span>Reactivate</span>
                            </button>
                          )}
                        </div>
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

export default EventRegistrations;
