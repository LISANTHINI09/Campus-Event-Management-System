import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import RegistrationFlowModal from '../components/RegistrationFlowModal';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  BookmarkCheck,
  ShieldAlert,
  CreditCard
} from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isStudent, isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  const fetchEventData = async () => {
    try {
      const data = await eventService.getEventById(id);
      setEvent(data);

      if (isAuthenticated && isStudent && currentUser?.id) {
        const studentRegistrations = await registrationService.getMyRegistrations(currentUser.id);
        const match = studentRegistrations.find(
          (r) => r.eventId === Number(id) && r.status === 'REGISTERED'
        );
        setIsRegistered(!!match);
      }
    } catch (err) {
      setAlert({ type: 'danger', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [id, isAuthenticated, isStudent, currentUser]);

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isStudent) {
      setAlert({
        type: 'info',
        message: 'Admin accounts cannot register as students.',
      });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmRegistration = async () => {
    setIsSubmitting(true);
    try {
      await registrationService.registerForEvent(currentUser.id, Number(id));
      setAlert({
        type: 'success',
        message: 'Congratulations! You have successfully registered for this event.',
      });
      setIsRegistered(true);
      setShowConfirmModal(false);
      // Refresh event capacity
      fetchEventData();
    } catch (err) {
      setAlert({ type: 'danger', message: err.message });
      setShowConfirmModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <LoadingSpinner message="Loading event details..." />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Event Not Found</h2>
        <p className="text-muted">The requested campus event does not exist or was removed.</p>
        <Link to="/events" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Events
        </Link>
      </div>
    );
  }

  const isFull = event.availableSeats <= 0;
  const isClosed = event.isRegistrationClosed || event.status === 'COMPLETED' || event.status === 'CANCELLED';

  const formattedDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'TBD';

  return (
    <div className="event-details-page container">
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm back-link-btn">
        <ArrowLeft size={16} />
        <span>Back to Events</span>
      </button>

      {/* Alert Notifications */}
      {alert && (
        <div className={`alert alert-${alert.type}`} style={{ marginTop: '1rem' }}>
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

      {/* Main Content Card */}
      <div className="event-details-layout">
        <div className="event-details-main card">
          <div className="details-header">
            <div className="details-badges">
              <span className="badge badge-category">{event.category}</span>
              {Number(event.registrationFee) > 0 ? (
                <span className="badge" style={{ background: '#e0e7ff', color: '#4338ca', fontWeight: 600 }}>
                  Fee: ₹{event.registrationFee}
                </span>
              ) : (
                <span className="badge" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 600 }}>
                  Fee: Free
                </span>
              )}
              <span className={`badge badge-${event.status?.toLowerCase()}`}>
                {event.status}
              </span>
            </div>

            <h1 className="details-title">{event.eventName}</h1>
            <p className="details-organizer">
              Organized by <strong>{event.organizerName}</strong>
            </p>
          </div>

          <div className="details-meta-grid">
            <div className="meta-card">
              <Calendar size={20} className="meta-card-icon" />
              <div>
                <span className="meta-card-label">Date</span>
                <span className="meta-card-value">{formattedDate}</span>
              </div>
            </div>

            <div className="meta-card">
              <Clock size={20} className="meta-card-icon" />
              <div>
                <span className="meta-card-label">Time</span>
                <span className="meta-card-value">
                  {event.startTime} {event.endTime ? `to ${event.endTime}` : ''}
                </span>
              </div>
            </div>

            <div className="meta-card">
              <MapPin size={20} className="meta-card-icon" />
              <div>
                <span className="meta-card-label">Venue</span>
                <span className="meta-card-value">{event.venue}</span>
              </div>
            </div>

            <div className="meta-card">
              <CreditCard size={20} className="meta-card-icon" />
              <div>
                <span className="meta-card-label">Registration Fee</span>
                <span className="meta-card-value">
                  {Number(event.registrationFee) > 0 ? `₹${event.registrationFee}` : 'Free'}
                </span>
              </div>
            </div>

            <div className="meta-card">
              <AlertTriangle size={20} className="meta-card-icon" />
              <div>
                <span className="meta-card-label">Registration Deadline</span>
                <span className="meta-card-value">{event.registrationDeadline}</span>
              </div>
            </div>
          </div>

          <div className="details-description-section">
            <h3>Event Description & Overview</h3>
            <div className="details-description-body">
              {event.description ? (
                event.description.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))
              ) : (
                <p>No description provided for this campus event.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Registration Action Box */}
        <div className="event-details-sidebar">
          <div className="card registration-action-card">
            <h3>Registration Status</h3>

            {/* Capacity Meter */}
            <div className="sidebar-capacity-box">
              <div className="capacity-numbers">
                <span className="capacity-available">
                  <strong>{event.availableSeats}</strong> slots available
                </span>
                <span className="capacity-total">
                  {event.currentRegisteredCount} / {event.maxParticipants} registered
                </span>
              </div>
              <div className="seat-progress-bar">
                <div
                  className={`seat-progress-fill ${isFull ? 'fill-full' : ''}`}
                  style={{
                    width: `${Math.min(
                      100,
                      (event.currentRegisteredCount / (event.maxParticipants || 1)) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Deadline reminder */}
            <div className="deadline-reminder-box">
              <Clock size={16} />
              <span>
                Register before <strong>{event.registrationDeadline}</strong>
              </span>
            </div>

            {/* Action Buttons */}
            {isRegistered ? (
              <div className="registered-success-box">
                <BookmarkCheck size={22} className="text-success" />
                <div>
                  <strong>You are registered!</strong>
                  <p className="text-muted">You can view details in My Registrations.</p>
                </div>
                <Link to="/student/registrations" className="btn btn-secondary btn-sm full-width">
                  View My Registrations
                </Link>
              </div>
            ) : isClosed ? (
              <div className="closed-box">
                <AlertCircle size={20} className="text-danger" />
                <span>
                  {event.status === 'COMPLETED'
                    ? 'This event has concluded.'
                    : event.status === 'CANCELLED'
                    ? 'This event has been cancelled.'
                    : 'Registration deadline has passed.'}
                </span>
                <button disabled className="btn btn-secondary full-width">
                  Registration Closed
                </button>
              </div>
            ) : isFull ? (
              <div className="closed-box">
                <Users size={20} className="text-danger" />
                <span>Event has reached maximum seat capacity.</span>
                <button disabled className="btn btn-secondary full-width">
                  Housefull
                </button>
              </div>
            ) : (
              <button
                onClick={handleRegisterClick}
                className="btn btn-primary btn-lg full-width register-action-btn"
              >
                Register Now
              </button>
            )}

            <p className="registration-rules-note">
              ✓ Open to all college students<br />
              ✓ No duplicate registration allowed<br />
              ✓ Free seat cancellation anytime
            </p>
          </div>
        </div>
      </div>

      {/* Multi-Step Participant Details & Demo Payment Registration Modal */}
      <RegistrationFlowModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        event={event}
        currentUser={currentUser}
        onSuccess={() => {
          setIsRegistered(true);
          fetchEventData();
        }}
      />
    </div>
  );
};

export default EventDetails;
