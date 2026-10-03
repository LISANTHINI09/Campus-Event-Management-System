import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { 
  Calendar, 
  PlusCircle, 
  Edit2, 
  Trash2, 
  Users, 
  Eye, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Technical',
  'Cultural',
  'Sports',
  'Workshop',
  'Seminar',
  'Hackathon',
  'Club Activity',
  'Other',
];

const STATUSES = ['All', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [alert, setAlert] = useState(null);

  // Delete modal state
  const [deleteModalEvent, setDeleteModalEvent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const data = await eventService.getEvents();
      setEvents(data);
    } catch (err) {
      setAlert({ type: 'danger', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteModalEvent) return;
    setIsDeleting(true);
    try {
      await eventService.deleteEvent(deleteModalEvent.id);
      setAlert({
        type: 'success',
        message: `Event "${deleteModalEvent.eventName}" was successfully deleted.`,
      });
      setDeleteModalEvent(null);
      fetchEvents();
    } catch (err) {
      setAlert({ type: 'danger', message: err.message });
      setDeleteModalEvent(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Client-side filtering for fast admin responsiveness
  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      !search ||
      e.eventName.toLowerCase().includes(search.toLowerCase()) ||
      e.venue.toLowerCase().includes(search.toLowerCase()) ||
      e.organizerName.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === 'All' || e.category === category;
    const matchesStatus = status === 'All' || e.status === status;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="portal-layout">
      <Sidebar role="ADMIN" />

      <main className="portal-content">
        <div className="admin-page-header">
          <div>
            <h1 className="page-title">Manage Campus Events</h1>
            <p className="page-subtitle">
              Create, update, monitor registrations, or delete scheduled events.
            </p>
          </div>
          <Link to="/admin/events/new" className="btn btn-primary btn-sm">
            <PlusCircle size={16} />
            <span>Create New Event</span>
          </Link>
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

        {/* Filter / Search Bar Row */}
        <div className="admin-filter-bar card">
          <div className="admin-search-wrapper">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by event title, venue, organizer..."
            />
          </div>

          <div className="admin-filter-dropdowns">
            <div className="admin-filter-item">
              <label>Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-control"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-filter-item">
              <label>Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-control"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table of Events */}
        {loading ? (
          <LoadingSpinner message="Loading events..." />
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No Events Found"
            message="No campus events match your filter criteria. Try resetting filters or create a new event."
            actionText="Create New Event"
            onAction={() => navigate('/admin/events/new')}
          />
        ) : (
          <div className="card admin-events-table-card">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Event Details</th>
                    <th>Category</th>
                    <th>Date & Time</th>
                    <th>Venue</th>
                    <th>Capacity</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((e) => (
                    <tr key={e.id}>
                      <td>
                        <Link to={`/admin/events/edit/${e.id}`} className="table-event-name-link">
                          <strong>{e.eventName}</strong>
                        </Link>
                        <p className="table-event-organizer text-muted">{e.organizerName}</p>
                      </td>
                      <td>
                        <span className="badge badge-category">{e.category}</span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>
                          {e.eventDate}
                          <br />
                          <span className="text-muted">{e.startTime}</span>
                        </div>
                      </td>
                      <td>{e.venue}</td>
                      <td>
                        <div style={{ minWidth: '95px' }}>
                          <span style={{ fontSize: '0.82rem' }}>
                            <strong>{e.currentRegisteredCount}</strong> / {e.maxParticipants}
                          </span>
                          <span
                            className={`badge ${
                              e.availableSeats <= 0 ? 'badge-cancelled' : 'badge-upcoming'
                            }`}
                            style={{ display: 'block', marginTop: '3px', fontSize: '0.72rem' }}
                          >
                            {e.availableSeats} available
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem' }}>{e.registrationDeadline}</span>
                      </td>
                      <td>
                        <span className={`badge badge-${e.status?.toLowerCase()}`}>{e.status}</span>
                      </td>
                      <td>
                        <div className="table-action-btns">
                          <Link
                            to={`/admin/registrations?eventId=${e.id}`}
                            className="btn btn-secondary btn-sm"
                            title="View Registered Students"
                          >
                            <Users size={14} />
                          </Link>
                          <Link
                            to={`/admin/events/edit/${e.id}`}
                            className="btn btn-secondary btn-sm"
                            title="Edit Event"
                          >
                            <Edit2 size={14} />
                          </Link>
                          <button
                            onClick={() => setDeleteModalEvent(e)}
                            className="btn btn-outline-danger btn-sm"
                            title="Delete Event"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={!!deleteModalEvent}
          onClose={() => setDeleteModalEvent(null)}
          title="Confirm Event Deletion"
          footer={
            <>
              <button
                onClick={() => setDeleteModalEvent(null)}
                className="btn btn-secondary"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="btn btn-danger"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Event'}
              </button>
            </>
          }
        >
          {deleteModalEvent && (
            <div className="modal-body-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#b91c1c' }}>
                <AlertTriangle size={24} />
                <strong>Are you sure you want to delete this event?</strong>
              </div>
              <p style={{ marginTop: '0.75rem' }}>
                You are about to permanently delete <strong>{deleteModalEvent.eventName}</strong>.
              </p>
              <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Warning: This will also remove associated student registrations for this event.
                This action cannot be undone.
              </p>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
};

export default ManageEvents;
