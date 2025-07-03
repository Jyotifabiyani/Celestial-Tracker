export const getUpcomingEvents = async (startDate = null, endDate = null) => {
  try {
    const allEvents = [
      {
        id: 1,
        title: 'Perseid Meteor Shower',
        date: '2025-08-12T00:00:00',
        type: 'Meteor Shower',
        location: 'Northern Hemisphere',
        imageUrl: FALLBACK_IMAGE,
        description: 'The Perseids bring up to 100 meteors per hour in August.'
      },
      {
        id: 2,
        title: 'Jupiter at Opposition',
        date: '2025-11-03T00:00:00',
        type: 'Planetary Event',
        location: 'Worldwide',
        imageUrl: FALLBACK_IMAGE,
        description: 'Best night to see Jupiter and its moons.'
      },
      {
        id: 3,
        title: 'Total Solar Eclipse',
        date: '2026-08-12T00:00:00',
        type: 'Eclipse',
        location: 'Europe and Asia',
        imageUrl: FALLBACK_IMAGE,
        description: 'Moon blocks Sun completely, day turns to night.'
      },
      {
        id: 4,
        title: 'Lyrid Meteor Shower',
        date: '2026-04-22T00:00:00',
        type: 'Meteor Shower',
        location: 'Best before dawn',
        imageUrl: FALLBACK_IMAGE,
        description: 'Annual meteor shower, 20 meteors per hour.'
      }
    ];

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      return allEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= start && eventDate <= end;
      });
    }

    return allEvents;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};
