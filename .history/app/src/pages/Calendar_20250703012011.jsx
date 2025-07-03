import { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import {
  Calendar,
  dateFnsLocalizer,
} from 'react-big-calendar';
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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const upcomingEvents = await getUpcomingEvents();

        // Map each event to calendar format
        const calendarEvents = upcomingEvents.map(event => ({
          title: event.title,
          start: new Date(event.date), // start time
          end: new Date(new Date(event.date).getTime() + 60 * 60 * 1000), // +1 hour duration
          allDay: false,
          resource: event, // original event
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
          sx={{ textAlign: 'center', color: '#fff' }}
        >
          Celestial Events Calendar
        </Typography>

        <Box sx={{ height: '75vh', mt: 4 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            tooltipAccessor={(event) => event.resource.description} // Show description on hover
            style={{
              height: '100%',
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '8px',
            }}
            eventPropGetter={() => ({
              style: {
                backgroundColor: '#3f51b5',
                color: '#fff',
                borderRadius: '4px',
                paddingLeft: '6px',
              },
            })}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default CalendarPage;
