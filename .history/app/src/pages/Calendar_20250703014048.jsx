import { useState, useEffect, useCallback } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/calendar.css';

import { Container, Typography, Box } from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import { getUpcomingEvents } from '../services/nasaApi';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [visibleRange, setVisibleRange] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchEventsInRange = useCallback(async (rangeStart, rangeEnd) => {
    setLoading(true);
    try {
      const allEvents = await getUpcomingEvents();
      const filtered = allEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= rangeStart && eventDate <= rangeEnd;
      });

      const calendarEvents = filtered.map(event => ({
        title: event.title,
        start: new Date(event.date),
        end: new Date(new Date(event.date).getTime() + 60 * 60 * 1000),
        allDay: false,
        resource: event,
      }));

      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    setVisibleRange({ start, end });
    fetchEventsInRange(start, end);
  }, [fetchEventsInRange]);

  const handleRangeChange = (range) => {
    let start, end;
    if (Array.isArray(range)) {
      // For week and day views
      start = range[0];
      end = range[range.length - 1];
    } else if (range.start && range.end) {
      // For month view
      start = range.start;
      end = range.end;
    }
    setVisibleRange({ start, end });
    fetchEventsInRange(start, end);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            color: '#BBDEFB',
            textShadow: '0 0 10px #3f51b5',
            textAlign: 'center',
            mb: 4,
          }}
        >
          🌌 Celestial Events Calendar
        </Typography>

        <Box
          sx={{
            height: '75vh',
            backgroundColor: '#0d1117',
            padding: 2,
            borderRadius: '12px',
            boxShadow: '0 0 20px rgba(63,81,181,0.4)',
          }}
        >
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%', color: '#e3f2fd' }}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: '#3f51b5',
                borderRadius: '6px',
                border: 'none',
                color: '#ffffff',
                fontWeight: 'bold',
                paddingLeft: '5px',
                boxShadow: '0 0 5px #2196f3',
              },
            })}
            toolbar
            popup
            views={['month', 'week', 'day', 'agenda']}
            onRangeChange={handleRangeChange}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default CalendarPage;
