import { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getUpcomingEvents } from '../services/nasaApi';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentRange, setCurrentRange] = useState({
    start: new Date(),
    end: new Date(),
  });

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const fetchedEvents = await getUpcomingEvents(currentRange.start, currentRange.end);

        const formattedEvents = fetchedEvents.map(event => ({
          title: event.title,
          start: new Date(event.date),
          end: new Date(new Date(event.date).getTime() + 60 * 60 * 1000), // 1 hour duration
          allDay: false,
          resource: event,
        }));

        setEvents(formattedEvents);
      } catch (err) {
        console.error('Error fetching calendar events:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentRange.start && currentRange.end) {
      fetchEvents();
    }
  }, [currentRange]);

  const handleRangeChange = (range) => {
    if (Array.isArray(range)) {
      // week or day view
      setCurrentRange({ start: range[0], end: range[range.length - 1] });
    } else if (range.start && range.end) {
      // month view
      setCurrentRange({ start: range.start, end: range.end });
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#e0e0ff' }}>
          🌌 Celestial Events Calendar
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{
            height: '70vh',
            backgroundColor: 'rgba(20, 25, 40, 0.85)',
            padding: 2,
            borderRadius: 2,
            boxShadow: '0 0 15px rgba(100, 150, 255, 0.3)'
          }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              views={['month', 'week', 'day', 'agenda']}
              defaultView="month"
              onRangeChange={handleRangeChange}
              style={{ height: '100%' }}
              eventPropGetter={() => ({
                style: {
                  backgroundColor: '#3f51b5',
                  color: '#fff',
                  borderRadius: '4px',
                  padding: '4px',
                  border: 'none',
                },
              })}
            />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default CalendarPage;
