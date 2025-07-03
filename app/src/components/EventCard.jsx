const EventCard = ({ event }) => {
  const FALLBACK_IMAGE = 'https://apod.nasa.gov/apod/image/2406/NGC6188-RGB-ESO-32bit-2048.jpg';
  
  // Format date differently for space weather events
  const formattedDate = event.type === 'Space Weather' 
    ? new Date(event.date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : new Date(event.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

  return (
    <div style={{
      width: '100%',
      background: 'rgba(24, 22, 22, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 25px rgba(0, 0, 0, 0.15)'
      }
    }}>
      {/* Image with fixed aspect ratio */}
      <div style={{
        width: '100%',
        aspectRatio: '16/9',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <img
          src={event.imageUrl || FALLBACK_IMAGE}
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
        {event.type === 'Space Weather' && (
          <div style={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.8rem'
          }}>
            Space Weather Alert
          </div>
        )}
      </div>
      
      <div style={{ 
        padding: '20px', 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        color: '#ffffff'
      }}>
        <Typography variant="h6" gutterBottom style={{ color: '#ffffff' }}>
          {event.title}
        </Typography>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '12px',
          alignItems: 'center'
        }}>
          <span style={{
            backgroundColor: event.type === 'Space Weather' ? '#f44336' : '#3f51b5',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 500
          }}>
            {event.type}
          </span>
          
          <span style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.9rem'
          }}>
            {formattedDate}
          </span>
        </div>
        
        <Typography variant="body2" style={{ 
          flexGrow: 1, 
          mb: 2,
          color: 'rgba(255, 255, 255, 0.8)',
          fontStyle: event.type === 'Space Weather' ? 'italic' : 'normal'
        }}>
          {event.description}
        </Typography>
        
        <Button 
          component={Link}
          to={`/events/${event.id}`}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ 
            mt: 'auto',
            background: event.type === 'Space Weather' 
              ? 'linear-gradient(45deg, #f44336 30%, #d32f2f 90%)' 
              : 'linear-gradient(45deg, #3f51b5 30%, #303f9f 90%)',
            '&:hover': {
              background: event.type === 'Space Weather'
                ? 'linear-gradient(45deg, #d32f2f 30%, #b71c1c 90%)'
                : 'linear-gradient(45deg, #303f9f 30%, #1a237e 90%)'
            }
          }}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};