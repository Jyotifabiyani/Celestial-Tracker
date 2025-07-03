import { Grid, Typography, useMediaQuery, Button, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { getUpcomingEvents } from '../services/nasaApi';
import { Link } from 'react-router-dom';

const FALLBACK_IMAGE = 'https://apod.nasa.gov/apod/image/2406/NGC6188-RGB-ESO-32bit-2048.jpg';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme => theme.breakpoints.down('md'));

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getUpcomingEvents();
        setEvents(data);
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const getGridColumns = () => {
    if (isSmallScreen) return 12;
    if (isMediumScreen) return 6;
    return 4;
  };

  if (loading) {
    return (
      <Box sx={{ padding: '20px', minHeight: '400px' }}>
        <Typography variant="h4" gutterBottom align="center">
          Loading Astronomy Events...
        </Typography>
        <Grid container spacing={4}>
          {Array.from({ length: 9 }).map((_, index) => (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <Box sx={{ 
                height: '400px', 
                backgroundColor: 'rgba(30, 30, 30, 0.7)',
                borderRadius: '12px',
              }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ paddingBottom: '40px' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ 
        mb: 4, 
        color: 'white',
        textShadow: '0 0 8px rgba(63, 81, 181, 0.8)',
        paddingTop: '20px'
      }}>
        Upcoming Astronomy Events
      </Typography>
      
      <Grid container spacing={4} justifyContent="center">
        {events.map(event => (
          <Grid key={event.id} item xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{
              width: '100%',
              maxWidth: '400px',
              backgroundColor: 'rgba(30, 30, 30, 0.8)',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 0 15px rgba(63, 81, 181, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 0 25px rgba(63, 81, 181, 0.5)'
              }
            }}>
              <Box sx={{
                width: '100%',
                aspectRatio: '16/9',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = FALLBACK_IMAGE;
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </Box>
              
              <Box sx={{ 
                padding: '20px', 
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                  {event.title}
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 2
                }}>
                  <Box sx={{
                    backgroundColor: 'rgba(63, 81, 181, 0.8)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                  }}>
                    {event.type}
                  </Box>
                  
                  <Typography variant="body2" sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem'
                  }}>
                    {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>
                
                <Typography variant="body2" sx={{ 
                  mb: 3,
                  color: 'rgba(255, 255, 255, 0.8)',
                  flexGrow: 1
                }}>
                  {event.description}
                </Typography>
                
                <Button 
                  component={Link}
          
                 to={`/events/${event.id}`}

                  variant="contained"
                  fullWidth
                  sx={{ 
                    mt: 'auto',
                    background: 'linear-gradient(45deg, #3f51b5 30%, #2196F3 90%)',
                    fontWeight: 'bold',
                    py: 1,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 0 12px rgba(33, 150, 243, 0.6)'
                    }
                  }}
                >
                  View Details
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}