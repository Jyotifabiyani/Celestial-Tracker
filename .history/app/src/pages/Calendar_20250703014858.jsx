import { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';

import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/calendar.css'; // Optional custom styles
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

// ✅ Custom Event Renderer to avoid double rendering and white box
const CustomEvent = ({ event }) => (
  <span style={{ color: '#fff', fontWeight: 'bold' }}>
    {event.title}
  </span>
);

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const upcomingEvents = await getUpcomingEvents();
        const calendarEvents = upcomingEvents.map(event => ({
          title: event.title,
          start: new Date(event.date),
          end: new Date(new Date(event.date).getTime() + 60 * 60 * 1000), // 1 hour duration
          allDay: false,
          resource: event,
        }));
        setEvents(calendarEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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
            views={['month', 'week', 'day', 'agenda']}
            defaultView="month"
            components={{
              event: CustomEvent, // ✅ Override default renderer
            }}
            style={{ height: '100%' }}
            popup
            eventPropGetter={() => ({
              style: {
                backgroundColor: '#3f51b5',
                borderRadius: '6px',
                color: '#ffffff',
                fontWeight: 'bold',
                padding: '4px 6px',
                boxShadow: '0 0 6px #2196f3',
              },
            })}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default CalendarPage;
