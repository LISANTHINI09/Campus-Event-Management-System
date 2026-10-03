import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import Sidebar from '../components/Sidebar';
import EventForm from '../components/EventForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { AlertCircle } from 'lucide-react';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventService.getEventById(id);
        setInitialData(data);
      } catch (err) {
        setError(err.message || 'Failed to load event data.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleUpdate = async (formData) => {
    setIsSubmitting(true);
    setError('');
    try {
      await eventService.updateEvent(id, formData);
      navigate('/admin/events');
    } catch (err) {
      setError(err.message || 'Failed to update campus event.');
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
            <h1 className="page-title">Edit Campus Event</h1>
            <p className="page-subtitle">
              Modify event timings, venue location, capacity, or registration deadlines.
            </p>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <LoadingSpinner message="Loading event details..." />
        ) : (
          <EventForm
            title={`Editing: ${initialData?.eventName}`}
            initialData={initialData}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
          />
        )}
      </main>
    </div>
  );
};

export default EditEvent;
