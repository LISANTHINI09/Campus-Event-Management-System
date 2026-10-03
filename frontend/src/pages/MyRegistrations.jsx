import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registrationService } from '../services/registrationService';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { 
  BookmarkCheck, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Trash2, 
  Eye,
  AlertTriangle
} from 'lucide-react';

const MyRegistrations = () => {
  const { currentUser } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Cancellation modal state
  const [cancelModalItem, setCancelModalItem] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchRegistrations = async () => {
    try {
      const data = await registrationService.getMyRegistrations(currentUser.id);
      setRegistrations(data);
    } catch (err) {
      setAlert({ type: 'danger', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      fetchRegistrations();
    }
  }, [currentUser]);

  const handleConfirmCancel = async () => {
    if (!cancelModalItem) return;
    setIsCancelling(true);
    try {
      await registrationService.cancelRegistration(cancelModalItem.id);
      setAlert({
        type: 'success',
        message: `Your registration for "${cancelModalItem.eventName}" has been cancelled. The slot has been freed.`,
      });
      setCancelModalItem(null);
      // Refresh registrations
      fetchRegistrations();
    } catch (err) {
      setAlert({ type: 'danger', message: err.message });
      setCancelModalItem(null);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="portal-layout">
      <Sidebar role="STUDENT" />

      <main className="portal-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Event Registrations</h1>
            <p className="page-subtitle">
              Manage your registered campus events, check confirmation status, or free up slots.
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
          <LoadingSpinner message="Loading your registrations..." />
        ) : registrations.length === 0 ? (
          <EmptyState
            icon={BookmarkCheck}
            title="No Registrations Yet"
            message="You have not registered for any events yet. Check out upcoming campus events to get started!"
            actionText="Browse Events"
            onAction={() => (window.location.href = '/events')}
          />
        ) : (
          <div className="card my-registrations-table-card">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Event Details</th>
                    <th>Date & Time</th>
                    <th>Venue</th>
                    <th>Participant Name</th>
                    <th>Registration Status</th>
                    <th>Payment Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr key={reg.id}>
                      <td>
                        <Link to={`/events/${reg.eventId}`} className="table-event-name-link">
                          <strong>{reg.eventName}</strong>
                        </Link>
                        <div>
                          <span className="badge badge-category" style={{ fontSize: '0.75rem', marginTop: '2px' }}>
                            {reg.eventCategory}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.88rem' }}>
                          {reg.eventDate}
                          <br />
                          <span className="text-muted">{reg.eventStartTime}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} className="text-muted" />
                          <span>{reg.eventVenue}</span>
                        </div>
                      </td>
                      <td>
                        <strong>{reg.fullName || reg.studentName || currentUser?.name}</strong>
                        {reg.rollNumber && (
                          <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                            Roll: {reg.rollNumber}
                          </div>
                        )}
                        {reg.department && (
                          <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                            {reg.department} {reg.year ? `(${reg.year})` : ''}
                          </div>
                        )}
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
                        {reg.paymentStatus === 'PAID' ? (
                          <div>
                            <span className="badge" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 600 }}>
                              Paid
                            </span>
                            {reg.paymentReference && (
                              <div style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: '#4338ca', marginTop: '4px' }}>
                                Ref: {reg.paymentReference}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <span className="badge" style={{ background: '#f1f5f9', color: '#475569', fontWeight: 500 }}>
                              Not Required
                            </span>
                            <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '2px' }}>
                              Free Event
                            </div>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="table-action-btns">
                          <Link
                            to={`/events/${reg.eventId}`}
                            className="btn btn-secondary btn-sm"
                            title="View Event Details"
                          >
                            <Eye size={14} />
                          </Link>
                          {reg.status === 'REGISTERED' && (
                            <button
                              onClick={() => setCancelModalItem(reg)}
                              className="btn btn-outline-danger btn-sm"
                              title="Cancel Registration"
                            >
                              <Trash2 size={14} />
                              <span>Cancel</span>
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

        {/* Cancellation Confirmation Modal */}
        <Modal
          isOpen={!!cancelModalItem}
          onClose={() => setCancelModalItem(null)}
          title="Confirm Registration Cancellation"
          footer={
            <>
              <button
                onClick={() => setCancelModalItem(null)}
                className="btn btn-secondary"
                disabled={isCancelling}
              >
                Keep Registration
              </button>
              <button
                onClick={handleConfirmCancel}
                className="btn btn-danger"
                disabled={isCancelling}
              >
                {isCancelling ? 'Cancelling...' : 'Yes, Cancel Registration'}
              </button>
            </>
          }
        >
          {cancelModalItem && (
            <div className="modal-body-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#b91c1c' }}>
                <AlertTriangle size={24} />
                <strong>Are you sure you want to cancel this event registration?</strong>
              </div>
              <p style={{ marginTop: '0.75rem' }}>
                You are cancelling your registration for <strong>{cancelModalItem.eventName}</strong>.
              </p>
              <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Your slot will be immediately freed and made available to other students. You can
                re-register later if seats remain open before the registration deadline.
              </p>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
};

export default MyRegistrations;
