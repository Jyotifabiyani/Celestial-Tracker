import axios from 'axios';

const NASA_API_KEY = import.meta.env.VITE_APP_NASA_API_KEY;
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

const FALLBACK_IMAGE = 'https://apod.nasa.gov/apod/image/2406/NGC6188-RGB-ESO-32bit-2048.jpg';

export const getAstronomyPicture = async (date = null) => {
  try {
    const params = {
      api_key: NASA_API_KEY || 'DEMO_KEY',
      thumbs: true,
    };

    if (date) {
      params.date = date;
    }

    const response = await axios.get(BASE_URL, { params });

    return {
      ...response.data,
      displayUrl: response.data.media_type === 'video'
        ? response.data.thumbnail_url
        : response.data.hdurl || response.data.url,
      title: response.data.title || 'Astronomy Picture of the Day',
      explanation: response.data.explanation || 'No description available.',
      date: response.data.date || new Date().toISOString().split('T')[0]
    };
  } catch (error) {
    console.error('Error fetching NASA APOD:', error);
    return {
      error: 'Failed to load astronomy picture',
      displayUrl: FALLBACK_IMAGE,
      title: 'Error Loading Image',
      explanation: 'We encountered an issue loading today\'s astronomy picture.',
      date: new Date().toISOString().split('T')[0]
    };
  }
};

export const getUpcomingEvents = async () => {
  try {
    const today = new Date();
    const dates = Array.from({ length: 9 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const apods = await Promise.all(dates.map(date => getAstronomyPicture(date)));

    return [
      {
        id: 1,
        title: 'Perseid Meteor Shower',
        date: '2025-08-12T00:00:00',
        type: 'Meteor Shower',
        location: 'Best seen in the Northern Hemisphere',
        imageUrl: apods[0].displayUrl,
        description: `The Perseids are one of the best meteor showers of the year. You can see up to 100 shooting stars per hour.

They happen every August when Earth passes through dust from a comet. No telescope needed — just find a dark spot and look up!`
      },
      {
        id: 2,
        title: 'Jupiter at Opposition',
        date: '2025-11-03T00:00:00',
        type: 'Planetary Event',
        location: 'Visible worldwide in the night sky',
        imageUrl: apods[1].displayUrl,
        description: `Jupiter will be very bright and closest to Earth. This is the best night to see Jupiter and its moons.

Even small telescopes will show details like cloud bands and its four biggest moons. Look in the east after sunset.`
      },
      {
        id: 3,
        title: 'Total Solar Eclipse',
        date: '2026-08-12T00:00:00',
        type: 'Eclipse',
        location: 'Parts of Europe and Asia',
        imageUrl: apods[2].displayUrl,
        description: `A total solar eclipse happens when the Moon blocks the Sun completely.

Day turns into night for a few minutes, and you can see the Sun’s outer glow. It's a rare and amazing sight. Use special eclipse glasses for safety.`
      },
      {
        id: 4,
        title: 'Mars Close Approach',
        date: '2025-12-08T00:00:00',
        type: 'Planetary Event',
        location: 'Look to the eastern sky after sunset',
        imageUrl: apods[3].displayUrl,
        description: `Mars will be the closest to Earth and will look bright and red in the sky.

This happens every couple of years. It's the best time to see Mars with a telescope or even just your eyes.`
      },
      {
        id: 5,
        title: 'Gemini Meteor Shower',
        date: '2025-12-14T00:00:00',
        type: 'Meteor Shower',
        location: 'Best viewed in the Northern Hemisphere',
        imageUrl: apods[4].displayUrl,
        description: `The Geminids are a strong meteor shower with colorful shooting stars.

They are bright, easy to see, and happen every December. Just go outside at night and look up — no equipment needed.`
      },
      {
        id: 6,
        title: 'Venus-Jupiter Conjunction',
        date: '2025-03-01T00:00:00',
        type: 'Planetary Conjunction',
        location: 'Best seen before sunrise in the east',
        imageUrl: apods[5].displayUrl,
        description: `Venus and Jupiter will look like they’re right next to each other in the sky.

This happens only sometimes and is easy to see with your eyes — no telescope needed. They’ll shine very bright like a double star.`
      },
      {
        id: 7,
        title: 'Annular Solar Eclipse',
        date: '2026-02-17T00:00:00',
        type: 'Eclipse',
        location: 'Best seen from Antarctica and Southern areas',
        imageUrl: apods[6].displayUrl,
        description: `In this solar eclipse, the Moon doesn’t cover the Sun completely. You’ll see a ring of sunlight — called the “ring of fire.”

It’s not as dark as a total eclipse, but still amazing. Always wear solar viewing glasses.`
      },
      {
        id: 8,
        title: 'Saturn at Opposition',
        date: '2025-08-27T00:00:00',
        type: 'Planetary Event',
        location: 'Visible worldwide all night',
        imageUrl: apods[7].displayUrl,
        description: `Saturn will be closest to Earth and visible all night. You can see it easily with the naked eye or through a telescope.

This is the best time to view Saturn's rings and some of its moons. Look toward the east after sunset.`
      },
      {
        id: 9,
        title: 'Lyrid Meteor Shower',
        date: '2026-04-22T00:00:00',
        type: 'Meteor Shower',
        location: 'Seen best just before dawn',
        imageUrl: apods[8].displayUrl,
        description: `The Lyrids are a yearly meteor shower that brings about 20 shooting stars per hour.

They are not the strongest, but still worth watching — especially in dark skies. Best seen early in the morning.`
      }
    ];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const getEventById = async (id) => {
  try {
    const events = await getUpcomingEvents();
    const event = events.find(event => event.id === parseInt(id));
    if (!event) throw new Error('Event not found');
    return event;
  } catch (error) {
    console.error('Error finding event:', error);
    return {
      id: 0,
      title: 'Event Not Found',
      date: '',
      description: 'The requested event could not be found.',
      type: 'Unknown',
      imageUrl: FALLBACK_IMAGE
    };
  }
};
