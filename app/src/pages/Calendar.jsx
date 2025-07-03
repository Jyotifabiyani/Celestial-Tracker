import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import {
  Container,
  Typography,
  Box,
  Fab,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Notifications as RemindersIcon,
  Add as AddIcon
} from '@mui/icons-material';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import addHours from 'date-fns/addHours';
import enUS from 'date-fns/locale/en-US';
import { getUpcomingEvents } from '../services/nasaApi';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/calendar.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CustomEvent = ({ event }) => (
  <div style={{ 
    fontWeight: 'bold', 
    color: '#ffffff',
    padding: '2px 4px',
    fontSize: '0.85rem'
  }}>
    {event.title}
    {event.isReminder && (
      <span style={{ marginLeft: 4 }}>🔔</span>
    )}
  </div>
);

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const navigate = useNavigate();

  // Load reminders from localStorage
  useEffect(() => {
    const savedReminders = localStorage.getItem('celestialReminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

  // Save reminders when they change
  useEffect(() => {
    localStorage.setItem('celestialReminders', JSON.stringify(reminders));
  }, [reminders]);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const apiEvents = await getUpcomingEvents();
      const calendarEvents = apiEvents.map(event => ({
        id: event.id,
        title: event.title,
        start: new Date(event.date),
        end: addHours(new Date(event.date), 1),
        allDay: false,
        resource: event,
        isReminder: reminders.some(r => r.id === event.id)
      }));
      setEvents(calendarEvents);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to load events' });
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, [reminders]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSelectEvent = (event) => {
    navigate(`/event/${event.id}`);
  };

  const handleRangeChange = (range) => {
    // Optional: Implement if you need to fetch events for different ranges
  };

  const toggleReminder = (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    setReminders(prev => {
      const isSet = prev.some(r => r.id === eventId);
      if (isSet) {
        return prev.filter(r => r.id !== eventId);
      } else {
        setSnackbar({ open: true, message: 'Reminder set!' });
        return [...prev, { 
          id: eventId, 
          title: event.title,
          date: event.start,
          description: event.resource?.description,
          imageUrl: event.resource?.imageUrl
        }];
      }
    });

    // Update events to show reminder status
    setEvents(prev => prev.map(e => 
      e.id === eventId ? { ...e, isReminder: !e.isReminder } : e
    ));
  };

  const CustomToolbar = ({ label }) => (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 2,
      color: '#ffffff'
    }}>
      <Typography variant="h6">{label}</Typography>
      <Box>
        <Tooltip title="View reminders">
          <Fab
            size="small"
            color="secondary"
            onClick={() => navigate('/reminders')}
            sx={{ ml: 1 }}
          >
            <RemindersIcon />
          </Fab>
        </Tooltip>
      </Box>
    </Box>
  );

  const CustomDayCell = ({ children }) => (
    <div style={{ 
      height: '100%', 
      backgroundColor: '#0d1117', 
      color: '#ffffff',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      {children}
    </div>
  );

  return (
    <Container maxWidth="lg" sx={{ position: 'relative' }}>
      {loading && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.7)',
          zIndex: 1000
        }}>
          <CircularProgress />
        </Box>
      )}

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
            style={{ height: '100%' }}
            views={['month', 'week', 'day', 'agenda']}
            onSelectEvent={handleSelectEvent}
            onRangeChange={handleRangeChange}
            components={{
              event: CustomEvent,
              toolbar: CustomToolbar,
              week: {
                header: ({ date }) => (
                  <div style={{ 
                    padding: '8px', 
                    textAlign: 'center', 
                    color: '#ffffff',
                    fontWeight: 'bold'
                  }}>
                    {format(date, 'EEE')}
                  </div>
                ),
              },
              day: {
                header: ({ label }) => (
                  <div style={{ 
                    padding: '8px', 
                    textAlign: 'center', 
                    color: '#ffffff',
                    fontWeight: 'bold'
                  }}>
                    {label}
                  </div>
                ),
                cellWrapper: CustomDayCell
              },
            }}
            eventPropGetter={(event) => {
              const isReminderSet = reminders.some(r => r.id === event.id);
              return {
                style: {
                  backgroundColor: isReminderSet ? '#4caf50' : '#3f51b5',
                  borderRadius: '4px',
                  border: isReminderSet ? '1px solid #81c784' : 'none',
                  color: '#ffffff',
                  boxShadow: isReminderSet 
                    ? '0 0 8px rgba(76, 175, 80, 0.6)' 
                    : '0 0 5px rgba(33, 150, 243, 0.4)',
                },
              };
            }}
          />
        </Box>
      </Box>

      <Tooltip title="Add Custom Reminder">
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
          }}
          onClick={() => {
            const newEventId = `custom-${Date.now()}`;
            const newReminder = {
              id: newEventId,
              title: `Custom Reminder - ${new Date().toLocaleDateString()}`,
              date: new Date(),
              description: "Your custom reminder"
            };
            
            setReminders(prev => [...prev, newReminder]);
            setSnackbar({ open: true, message: 'Custom reminder added!' });
            
            // Add to events if you want it to show in calendar
            setEvents(prev => [...prev, {
              id: newEventId,
              title: newReminder.title,
              start: newReminder.date,
              end: addHours(newReminder.date, 1),
              allDay: false,
              resource: { description: newReminder.description },
              isReminder: true
            }]);
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CalendarPage;