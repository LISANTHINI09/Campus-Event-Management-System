import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Users, ArrowRight } from 'lucide-react';

const EventCard = ({ event, onQuickRegister, isRegistered }) => {
  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'UPCOMING':
        return <span className="badge badge-upcoming">Upcoming</span>;
      case 'ONGOING':
        return <span className="badge badge-ongoing">Ongoing</span>;
      case 'COMPLETED':
        return <span className="badge badge-completed">Completed</span>;
      case 'CANCELLED':
        return <span className="badge badge-cancelled">Cancelled</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const formattedDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'TBD';

  const isFull = event.availableSeats !== undefined ? event.availableSeats <= 0 : false;
  const isClosed = event.isRegistrationClosed || event.status === 'COMPLETED' || event.status === 'CANCELLED';

  return (
    <div className="card event-card">
      <div className="event-card-header">
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="badge badge-category">{event.category}</span>
          {Number(event.registrationFee) > 0 ? (
            <span className="badge" style={{ background: '#e0e7ff', color: '#4338ca', fontWeight: 600 }}>
              ₹{event.registrationFee}
            </span>
          ) : (
            <span className="badge" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 600 }}>
              Free
            </span>
          )}
        </div>
        {getStatusBadge(event.status)}
      </div>

      <div className="event-card-body">
        <h3 className="event-title" title={event.eventName}>
          {event.eventName}
        </h3>

        <p className="event-description">
          {event.description?.length > 115
            ? `${event.description.substring(0, 115)}...`
            : event.description || 'Join this exciting campus event.'}
        </p>

        <div className="event-meta-list">
          <div className="event-meta-item">
            <Calendar size={16} className="meta-icon" />
            <span>{formattedDate}</span>
          </div>

          <div className="event-meta-item">
            <Clock size={16} className="meta-icon" />
            <span>{event.startTime} {event.endTime ? `- ${event.endTime}` : ''}</span>
          </div>

          <div className="event-meta-item">
            <MapPin size={16} className="meta-icon" />
            <span className="truncate">{event.venue}</span>
          </div>

          <div className="event-meta-item">
            <User size={16} className="meta-icon" />
            <span className="truncate">{event.organizerName}</span>
          </div>
        </div>

        {/* Seat Capacity Bar */}
        <div className="seat-capacity-section">
          <div className="seat-labels">
            <span className="seats-available">
              <Users size={14} />
              {isFull ? (
                <strong className="text-danger">Housefull</strong>
              ) : (
                <span><strong>{event.availableSeats}</strong> seats left</span>
              )}
            </span>
            <span className="seats-registered">
              {event.currentRegisteredCount} / {event.maxParticipants} joined
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
      </div>

      <div className="event-card-footer">
        <Link to={`/events/${event.id}`} className="btn btn-secondary btn-sm">
          <span>View Details</span>
          <ArrowRight size={14} />
        </Link>

        {isRegistered ? (
          <span className="badge badge-registered">Registered</span>
        ) : onQuickRegister && !isClosed && !isFull ? (
          <button
            onClick={() => onQuickRegister(event)}
            className="btn btn-primary btn-sm"
          >
            Register
          </button>
        ) : isClosed || isFull ? (
          <span className="badge badge-completed">Closed</span>
        ) : null}
      </div>
    </div>
  );
};

export default EventCard;
