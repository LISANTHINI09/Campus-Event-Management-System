import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { useAuth } from '../context/AuthContext';
import EventList from '../components/EventList';
import SearchBar from '../components/SearchBar';
import Filter from '../components/Filter';
import LoadingSpinner from '../components/LoadingSpinner';
import RegistrationFlowModal from '../components/RegistrationFlowModal';
import { Calendar, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentUser, isStudent, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Search and filter states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Registered event IDs for the current student
  const [registeredEventIds, setRegisteredEventIds] = useState([]);

  // Modal & Notification states
  const [modalEvent, setModalEvent] = useState(null);
  const [alert, setAlert] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getEvents({
        search,
        category,
        status,
        startDate,
        endDate,
      });
      setEvents(data);
    } catch (err) {
      setAlert({ type: 'danger', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Sync category param from URL if changed
  useEffect(() => {
    const urlCat = searchParams.get('category');
    if (urlCat !== null) {
      setCategory(urlCat);
    }
  }, [searchParams]);

  // Fetch events when filters change
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchEvents();
    }, 250);
    return () => clearTimeout(timeout);
  }, [search, category, status, startDate, endDate]);

  // Fetch student's existing registrations to show badges
  useEffect(() => {
    if (isAuthenticated && isStudent && currentUser?.id) {
      registrationService
        .getMyRegistrations(currentUser.id)
        .then((regs) => {
          const ids = regs
            .filter((r) => r.status === 'REGISTERED')
            .map((r) => r.eventId);
          setRegisteredEventIds(ids);
        })
        .catch((err) => console.error(err));
    } else {
      setRegisteredEventIds([]);
    }
  }, [isAuthenticated, isStudent, currentUser]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setStatus('');
    setStartDate('');
    setEndDate('');
    setSearchParams({});
  };

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    if (newCat) {
      setSearchParams({ category: newCat });
    } else {
      setSearchParams({});
    }
  };

  const handleQuickRegisterClick = (event) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isStudent) {
      setAlert({
        type: 'info',
        message: 'Admin accounts cannot register as students for events.',
      });
      return;
    }
    setModalEvent(event);
  };

  return (
    <div className="events-page container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Campus Events Directory</h1>
          <p className="page-subtitle">
            Explore workshops, seminars, sports meets, and hackathons organized across all departments.
          </p>
        </div>
      </div>

      {/* Alert Notification */}
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === 'success' ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
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

      {/* Search Bar */}
      <div className="events-search-section">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by event title, description, or organizer..."
        />
      </div>

      {/* Filter Component */}
      <Filter
        category={category}
        onCategoryChange={handleCategoryChange}
        status={status}
        onStatusChange={setStatus}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onReset={handleResetFilters}
      />

      {/* Results Header */}
      <div className="results-count-bar">
        <span className="results-text">
          Showing <strong>{events.length}</strong> events
          {category && ` in "${category}"`}
        </span>
      </div>

      {/* Event Grid or Spinner */}
      {loading ? (
        <LoadingSpinner message="Loading events..." />
      ) : (
        <EventList
          events={events}
          onQuickRegister={handleQuickRegisterClick}
          registeredEventIds={registeredEventIds}
        />
      )}

      {/* Multi-Step Participant Details & Demo Payment Registration Modal */}
      <RegistrationFlowModal
        isOpen={!!modalEvent}
        onClose={() => setModalEvent(null)}
        event={modalEvent}
        currentUser={currentUser}
        onSuccess={(result) => {
          if (modalEvent) {
            setRegisteredEventIds((prev) => [...prev, modalEvent.id]);
          }
          fetchEvents();
        }}
      />
    </div>
  );
};

export default Events;
