import React from 'react';
import { Grid } from '@mui/material';
import EventCard from './EventCard';

const EventList = ({ events }) => {
  return (
    <Grid container spacing={3}>
      {events.map((event) => (
        <Grid item xs={12} sm={6} md={4} key={event.id}>
          <EventCard event={event} />
        </Grid>
      ))}
    </Grid>
  );
};

export default EventList;