import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const FALLBACK_IMAGE = 'https://apod.nasa.gov/apod/image/2406/NGC6188-RGB-ESO-32bit-2048.jpg';
  
  return (
    <div style={{
      width: '100%',
      backgroundColor: '#1e1e1e',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      transition: 'transform 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      '&:hover': {
        transform: 'translateY(-5px)'
      }
    }}>
      {/* Image with fixed aspect ratio */}
      <div style={{
        width: '100%',
        aspectRatio: '16/9',
        overflow: 'hidden'
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
      </div>
      
      <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          {event.title}
        </Typography>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '12px' 
        }}>
          <span style={{
            backgroundColor: '#3f51b5',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 500
          }}>
            {event.type}
          </span>
          
          <span style={{
            color: '#aaa',
            fontSize: '0.9rem'
          }}>
            {new Date(event.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>
        
        <Typography variant="body2" color="textSecondary" sx={{ flexGrow: 1, mb: 2 }}>
          {event.description}
        </Typography>
        
        {/* View Details Button */}
        <Button 
          component={Link}
          to={`/event/${event.id}`}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 'auto' }}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default EventCard;