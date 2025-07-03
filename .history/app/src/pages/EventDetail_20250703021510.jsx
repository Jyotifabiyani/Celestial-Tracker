import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  Chip,
  CircularProgress
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2'; // ✅ Correct way to use Grid v2 from MUI
import {
  Schedule,
  LocationOn,
  Notifications,
  Share
} from '@mui/icons-material';
import CountdownTimer from '../components/CountdownTimer';
import { getEventById } from '../services/nasaApi';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <Container maxWidth="md">
      <Box sx={{ my: 5 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ color: '#ffffff', textShadow: '0 0 8px rgba(63, 81, 181, 0.8)' }}
        >
          {event.title}
        </Typography>

        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: '16px',
            background: 'rgba(30, 30, 30, 0.9)',
            color: '#ffffff',
            boxShadow: '0 0 25px rgba(63, 81, 181, 0.25)'
          }}
        >
          {/* Overview Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" mb={3}>
            <Box mb={2}>
              <Typography variant="h5" color="primary" gutterBottom>
                Happening in:
              </Typography>
              <CountdownTimer targetDate={event.date} />
            </Box>

            <Box>
              <Button variant="contained" startIcon={<Notifications />} sx={{ mr: 2 }}>
                Set Reminder
              </Button>
              <Button variant="outlined" startIcon={<Share />}>
                Share
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

          {/* Event Overview */}
          <Box mb={3}>
            <Typography variant="h5" gutterBottom sx={{ color: '#fff' }}>
              Event Overview
            </Typography>

            <Grid2 container spacing={2}>
              <Grid2 xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <Schedule color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1" sx={{ color: '#ddd' }}>
                    {new Date(event.date).toLocaleString()}
                  </Typography>
                </Box>
              </Grid2>

              {event.location && (
                <Grid2 xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                    <LocationOn color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1" sx={{ color: '#ddd' }}>
                      {event.location}
                    </Typography>
                  </Box>
                </Grid2>
              )}

              {event.type && (
                <Grid2 xs={12}>
                  <Chip
                    label={event.type}
                    color="primary"
                    sx={{ backgroundColor: '#3f51b5', color: '#fff' }}
                  />
                </Grid2>
              )}
            </Grid2>
          </Box>

          {/* Description */}
          <Box mb={3}>
            <Typography variant="body1" paragraph sx={{ color: '#ccc' }}>
              {event.description}
            </Typography>
          </Box>

          {/* Event Image */}
          {event.imageUrl && (
            <Box sx={{ mt: 3 }}>
              <img
                src={event.imageUrl}
                alt={event.title}
                style={{
                  width: '100%',
                  borderRadius: '10px',
                  boxShadow: '0 0 20px rgba(0, 0, 0, 0.4)'
                }}
              />
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default EventDetail;
