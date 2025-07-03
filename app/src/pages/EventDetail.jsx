import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  Grid
} from '@mui/material';
import {
  Schedule,
  LocationOn,
  Notifications,
  NotificationsActive,
  Share
} from '@mui/icons-material';
import CountdownTimer from '../components/CountdownTimer';
import { getEventById } from '../services/nasaApi';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReminderSet, setIsReminderSet] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const savedReminders = JSON.parse(localStorage.getItem('celestialReminders') || '[]');
    setIsReminderSet(savedReminders.some(r => r.id === id));
  }, [id]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(id);
        setEvent(eventData);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const toggleReminder = () => {
    const savedReminders = JSON.parse(localStorage.getItem('celestialReminders') || '[]');
    const newReminders = isReminderSet
      ? savedReminders.filter(r => r.id !== id)
      : [...savedReminders, { 
          id,
          title: event.title,
          date: event.date,
          description: event.description,
          imageUrl: event.imageUrl
        }];

    localStorage.setItem('celestialReminders', JSON.stringify(newReminders));
    setIsReminderSet(!isReminderSet);
    setSnackbar({ 
      open: true, 
      message: isReminderSet ? 'Reminder removed!' : 'Reminder set!' 
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container>
        <Typography variant="h4" color="error" align="center" mt={4}>
          Event not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Event Details Column - Takes more space on larger screens */}
        <Grid item xs={12} lg={7}>
          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: '16px',
              background: 'rgba(30, 30, 30, 0.9)',
              color: '#ffffff',
              boxShadow: '0 0 25px rgba(63, 81, 181, 0.25)',
              height: '100%'
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ 
                color: '#ffffff', 
                textShadow: '0 0 8px rgba(63, 81, 181, 0.8)',
                mb: 3
              }}
            >
              {event.title}
            </Typography>

            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
              <Box>
                <Typography variant="h5" color="primary" gutterBottom>
                  Happening in:
                </Typography>
                <CountdownTimer targetDate={event.date} />
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  startIcon={isReminderSet ? <NotificationsActive /> : <Notifications />}
                  onClick={toggleReminder}
                  color={isReminderSet ? 'success' : 'primary'}
                >
                  {isReminderSet ? 'Reminder Set' : 'Set Reminder'}
                </Button>
                <Button variant="outlined" startIcon={<Share />}>
                  Share
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <Schedule color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1" sx={{ color: '#ddd' }}>
                    {new Date(event.date).toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              
              {event.location && (
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                    <LocationOn color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1" sx={{ color: '#ddd' }}>
                      {event.location}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>

            {event.type && (
              <Box mb={3}>
                <Chip
                  label={event.type}
                  color="primary"
                  sx={{ backgroundColor: '#3f51b5', color: '#fff' }}
                />
              </Box>
            )}

            <Box mb={3}>
              <Typography 
                variant="body1" 
                paragraph 
                sx={{ 
                  color: '#ccc',
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line'
                }}
              >
                {event.description || 'No description available.'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Image Column - Takes less space on larger screens */}
        <Grid item xs={12} lg={5}>
          <Paper
            elevation={4}
            sx={{
              p: 2,
              borderRadius: '16px',
              background: 'rgba(30, 30, 30, 0.9)',
              boxShadow: '0 0 25px rgba(63, 81, 181, 0.25)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderRadius: '12px',
                backgroundColor: 'rgba(0,0,0,0.3)'
              }}
            >
              <img
                src={imageError ? 'https://www.nasa.gov/wp-content/uploads/2023/05/space-weather-1024x576.jpg' : event.imageUrl}
                alt={event.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '60vh',
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
                onError={handleImageError}
              />
            </Box>
            <Typography 
              variant="caption" 
              display="block" 
              textAlign="center" 
              mt={1}
              sx={{ color: 'rgba(255,255,255,0.7)' }}
            >
              {event.subtype && `Event type: ${event.subtype}`}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

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

export default EventDetail;