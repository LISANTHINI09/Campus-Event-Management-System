import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import Sidebar from '../components/Sidebar';
import EventForm from '../components/EventForm';
import { AlertCircle } from 'lucide-react';

const CreateEvent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    setIsSubmitting(true);
    setError('');
    try {
      await eventService.createEvent(formData);
      navigate('/admin/events');
    } catch (err) {
      setError(err.message || 'Failed to create campus event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="portal-layout">
      <Sidebar role="ADMIN" />

      <main className="portal-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Schedule New Campus Event</h1>
            <p className="page-subtitle">
              Publish a new technical workshop, symposium, sports meet, or cultural activity.
            </p>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <EventForm
          title="Create New Event"
          onSubmit={handleCreate}
          isSubmitting={isSubmitting}
        />
      </main>
    </div>
  );
};

export default CreateEvent;
