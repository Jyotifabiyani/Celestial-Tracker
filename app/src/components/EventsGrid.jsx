import { Grid, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { getUpcomingEvents } from '../services/nasaApi';

const FALLBACK_IMAGE = 'https://apod.nasa.gov/apod/image/2406/NGC6188-RGB-ESO-32bit-2048.jpg';

export default function EventsGrid() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      const data = await getUpcomingEvents();
      setEvents(data);
      setLoading(false);
    };
    loadEvents();
  }, []);

  if (loading) {
    return (
      <Grid container spacing={4}>
        {Array.from({ length: 9 }).map((_, index) => (
          <Grid key={index} xs={12} sm={6} md={4}>
            <Skeleton variant="rectangular" height={200} />
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={60} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={4}>
      {events.map(event => (
        <Grid key={event.id} xs={12} sm={6} md={4}>
          <div className="event-card">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="event-image"
              onError={(e) => {
                e.target.src = FALLBACK_IMAGE;
              }}
            />
            <div className="event-content">
              <h3 className="event-title">{event.title}</h3>
              <div className="event-meta">
                <span className="event-type">{event.type}</span>
                <span className="event-date">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <p className="event-description">{event.description}</p>
            </div>
          </div>
        </Grid>
      ))}
    </Grid>
  );
}