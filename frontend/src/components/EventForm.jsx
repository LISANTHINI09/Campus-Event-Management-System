import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, User, FileText, Tag, CheckCircle } from 'lucide-react';

const CATEGORIES = [
  'Technical',
  'Cultural',
  'Sports',
  'Workshop',
  'Seminar',
  'Hackathon',
  'Club Activity',
  'Other',
];

const STATUSES = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];

const EventForm = ({ initialData, onSubmit, isSubmitting, title = 'Event Information' }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    category: 'Workshop',
    eventDate: '',
    startTime: '',
    endTime: '',
    venue: '',
    organizerName: '',
    maxParticipants: 50,
    registrationDeadline: '',
    status: 'UPCOMING',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        eventName: initialData.eventName || '',
        description: initialData.description || '',
        category: initialData.category || 'Workshop',
        eventDate: initialData.eventDate || '',
        startTime: initialData.startTime || '',
        endTime: initialData.endTime || '',
        venue: initialData.venue || '',
        organizerName: initialData.organizerName || '',
        maxParticipants: initialData.maxParticipants || 50,
        registrationDeadline: initialData.registrationDeadline || '',
        status: initialData.status || 'UPCOMING',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'maxParticipants' ? parseInt(value, 10) || 0 : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.eventName.trim()) {
      newErrors.eventName = 'Event name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.eventDate) {
      newErrors.eventDate = 'Event date is required';
    }

    if (!formData.startTime.trim()) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.venue.trim()) {
      newErrors.venue = 'Venue location is required';
    }

    if (!formData.organizerName.trim()) {
      newErrors.organizerName = 'Organizer / Department name is required';
    }

    if (!formData.maxParticipants || formData.maxParticipants < 1) {
      newErrors.maxParticipants = 'Maximum participants must be at least 1';
    }

    if (!formData.registrationDeadline) {
      newErrors.registrationDeadline = 'Registration deadline is required';
    } else if (formData.eventDate && formData.registrationDeadline > formData.eventDate) {
      newErrors.registrationDeadline = 'Deadline cannot be after the event date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card event-form-card">
      <div className="event-form-header">
        <h2>{title}</h2>
        <p className="text-muted">Fill out the complete event specifications below.</p>
      </div>

      <div className="form-grid">
        {/* Event Name */}
        <div className="form-group col-span-2">
          <label className="form-label">
            Event Title <span className="required-star">*</span>
          </label>
          <input
            type="text"
            name="eventName"
            className="form-control"
            placeholder="e.g. AI & Machine Learning Symposium 2026"
            value={formData.eventName}
            onChange={handleChange}
          />
          {errors.eventName && <p className="form-error">{errors.eventName}</p>}
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="form-label">
            Category <span className="required-star">*</span>
          </label>
          <select
            name="category"
            className="form-control"
            value={formData.category}
            onChange={handleChange}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="form-error">{errors.category}</p>}
        </div>

        {/* Status */}
        <div className="form-group">
          <label className="form-label">Event Status</label>
          <select
            name="status"
            className="form-control"
            value={formData.status}
            onChange={handleChange}
          >
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Event Date */}
        <div className="form-group">
          <label className="form-label">
            Event Date <span className="required-star">*</span>
          </label>
          <input
            type="date"
            name="eventDate"
            className="form-control"
            value={formData.eventDate}
            onChange={handleChange}
          />
          {errors.eventDate && <p className="form-error">{errors.eventDate}</p>}
        </div>

        {/* Registration Deadline */}
        <div className="form-group">
          <label className="form-label">
            Registration Deadline <span className="required-star">*</span>
          </label>
          <input
            type="date"
            name="registrationDeadline"
            className="form-control"
            value={formData.registrationDeadline}
            onChange={handleChange}
          />
          {errors.registrationDeadline && (
            <p className="form-error">{errors.registrationDeadline}</p>
          )}
        </div>

        {/* Start Time */}
        <div className="form-group">
          <label className="form-label">
            Start Time <span className="required-star">*</span>
          </label>
          <input
            type="text"
            name="startTime"
            className="form-control"
            placeholder="e.g. 10:00 AM"
            value={formData.startTime}
            onChange={handleChange}
          />
          {errors.startTime && <p className="form-error">{errors.startTime}</p>}
        </div>

        {/* End Time */}
        <div className="form-group">
          <label className="form-label">End Time</label>
          <input
            type="text"
            name="endTime"
            className="form-control"
            placeholder="e.g. 04:30 PM (optional)"
            value={formData.endTime}
            onChange={handleChange}
          />
        </div>

        {/* Venue */}
        <div className="form-group">
          <label className="form-label">
            Venue / Hall <span className="required-star">*</span>
          </label>
          <input
            type="text"
            name="venue"
            className="form-control"
            placeholder="e.g. Ramanujan Auditorium, Block B"
            value={formData.venue}
            onChange={handleChange}
          />
          {errors.venue && <p className="form-error">{errors.venue}</p>}
        </div>

        {/* Organizer Name */}
        <div className="form-group">
          <label className="form-label">
            Organizer / Department <span className="required-star">*</span>
          </label>
          <input
            type="text"
            name="organizerName"
            className="form-control"
            placeholder="e.g. Department of CSE & Coding Club"
            value={formData.organizerName}
            onChange={handleChange}
          />
          {errors.organizerName && <p className="form-error">{errors.organizerName}</p>}
        </div>

        {/* Maximum Participants */}
        <div className="form-group col-span-2">
          <label className="form-label">
            Maximum Capacity (Seat Limit) <span className="required-star">*</span>
          </label>
          <input
            type="number"
            min="1"
            name="maxParticipants"
            className="form-control"
            placeholder="e.g. 100"
            value={formData.maxParticipants}
            onChange={handleChange}
          />
          {errors.maxParticipants && (
            <p className="form-error">{errors.maxParticipants}</p>
          )}
        </div>

        {/* Description */}
        <div className="form-group col-span-2">
          <label className="form-label">Event Description & Agenda</label>
          <textarea
            name="description"
            rows="5"
            className="form-control"
            placeholder="Describe the topics, keynote speakers, eligibility, prerequisites, and instructions..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="event-form-actions">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving Event...' : 'Save & Publish Event'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
