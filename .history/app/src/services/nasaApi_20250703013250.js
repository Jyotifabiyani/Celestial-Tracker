export const getUpcomingEvents = async (startDate = null, endDate = null) => {
  const allEvents = [
    {
      id: 1,
      title: 'Perseid Meteor Shower',
      date: '2025-08-12T00:00:00',
      description: 'Annual meteor shower with up to 100 meteors per hour.',
      type: 'Meteor Shower',
      imageUrl: 'https://apod.nasa.gov/apod/image/2406/NGC6188-RGB-ESO-32bit-2048.jpg'
    },
    {
      id: 2,
      title: 'Jupiter at Opposition',
      date: '2025-11-03T00:00:00',
      description: 'Jupiter will be at its closest approach to Earth.',
      type: 'Planetary Event',
      imageUrl: 'https://apod.nasa.gov/apod/image/2406/NGC6188-RGB-ESO-32bit-2048.jpg'
    },
    {
      id: 3,
      title: 'Total Solar Eclipse',
      date: '2026-08-12T00:00:00',
      description: 'A total eclipse visible from parts of Europe and Asia.',
      type: 'Eclipse',
      imageUrl: 'https://apod.nasa.gov/apod/image/2406/NGC6188-RGB-ESO-32bit-2048.jpg'
    },
    // ... Add more if needed
  ];

  if (startDate && endDate) {
    return allEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= new Date(startDate) && eventDate <= new Date(endDate);
    });
  }

  return allEvents;
};
