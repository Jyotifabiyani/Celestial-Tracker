import { Link } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';

const EventCard = ({ event }) => (
  <Card>
    <CardMedia
      component="img"
      height="200"
      image={event.imageUrl}
      alt={event.title}
    />
    <CardContent>
      <Typography variant="h6">{event.title}</Typography>
      <Typography variant="body2" color="textSecondary">
        {new Date(event.date).toLocaleDateString()}
      </Typography>
      <Link to={`/events/${event.id}`} style={{ textDecoration: 'none' }}>
        <Button variant="outlined" sx={{ mt: 1 }}>
          View Details
        </Button>
      </Link>
    </CardContent>
  </Card>
);

export default EventCard;
