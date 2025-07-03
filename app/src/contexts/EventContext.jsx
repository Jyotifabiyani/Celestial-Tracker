import React, { createContext, useState, useEffect } from 'react';
import { getUpcomingEvents } from '../services/nasaApi';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const upcomingEvents = await getUpcomingEvents();
        setEvents(upcomingEvents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <EventContext.Provider value={{ events, loading, error }}>
      {children}
    </EventContext.Provider>
  );
};