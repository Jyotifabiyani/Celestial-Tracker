import { useState, useEffect } from 'react';
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

const CustomAgendaEvent = ({ event }) => (
  <div style={{ color: '#fff' }}>
    <strong>{event.title}</strong>
    <div>{event.resource?.description}</div>
  </div>
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
          🌠 Celestial Events Agenda
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
            defaultView="agenda" // 👈 agenda shows only event days
            views={['agenda']}  // 👈 force only agenda view
            components={{
              agenda: {
                event: CustomAgendaEvent,
              },
            }}
            style={{ height: '100%', color: '#e3f2fd' }}
            eventPropGetter={() => ({
              style: {
                backgroundColor: '#3f51b5',
                color: '#ffffff',
                borderRadius: '6px',
                padding: '4px',
                boxShadow: '0 0 5px #2196f3',
              },
            })}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default CalendarPage;
