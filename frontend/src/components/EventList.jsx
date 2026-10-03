import React from 'react';
import EventCard from './EventCard';
import EmptyState from './EmptyState';
import { Calendar } from 'lucide-react';

const EventList = ({ events, onQuickRegister, registeredEventIds = [] }) => {
  if (!events || events.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="No Events Found"
        message="No campus events match your selected filters or search criteria. Try clearing filters or check back later."
      />
    );
  }

  return (
    <div className="event-grid">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onQuickRegister={onQuickRegister}
          isRegistered={registeredEventIds.includes(event.id)}
        />
      ))}
    </div>
  );
};

export default EventList;
