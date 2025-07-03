import axios from 'axios';

const NASA_API_KEY = import.meta.env.VITE_APP_NASA_API_KEY;
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

const FALLBACK_IMAGE = 'https://apod.nasa.gov/apod/image/2406/NGC6188-RGB-ESO-32bit-2048.jpg';

/**
 * Fetches NASA Astronomy Picture of the Day (APOD).
 */
export const getAstronomyPicture = async (date = null) => {
  try {
    const params = {
      api_key: NASA_API_KEY || 'DEMO_KEY',
      thumbs: true,
    };

    if (date) params.date = date;

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

/**
 * Returns mock upcoming astronomy events using recent APOD images.
 */
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
        description: `The Perseids are one of the best meteor showers of the year. Up to 100 meteors per hour can be seen. They come from debris left by a comet. Just find a dark sky and look up!`
      },
      {
        id: 2,
        title: 'Jupiter at Opposition',
        date: '2025-11-03T00:00:00',
        type: 'Planetary Event',
        location: 'Visible worldwide in the night sky',
        imageUrl: apods[1].displayUrl,
        description: `Jupiter will be closest to Earth and fully lit by the Sun. It will shine very bright. You can even see its cloud bands and moons using a small telescope.`
      },
      {
        id: 3,
        title: 'Total Solar Eclipse',
        date: '2026-08-12T00:00:00',
        type: 'Eclipse',
        location: 'Parts of Europe and Asia',
        imageUrl: apods[2].displayUrl,
        description: `The Moon will completely block the Sun, turning day into night for a few minutes. You'll see the Sun’s outer glow. Use special eclipse glasses to view safely.`
      },
      {
        id: 4,
        title: 'Mars Close Approach',
        date: '2025-12-08T00:00:00',
        type: 'Planetary Event',
        location: 'Eastern sky after sunset',
        imageUrl: apods[3].displayUrl,
        description: `Mars will be the closest to Earth, making it look brighter than usual. It will appear red and can be seen without a telescope.`
      },
      {
        id: 5,
        title: 'Gemini Meteor Shower',
        date: '2025-12-14T00:00:00',
        type: 'Meteor Shower',
        location: 'Northern Hemisphere',
        imageUrl: apods[4].displayUrl,
        description: `The Geminids show bright, colorful meteors across the sky. No telescope needed. Just go outside at night and look up.`
      },
      {
        id: 6,
        title: 'Venus-Jupiter Conjunction',
        date: '2025-03-01T00:00:00',
        type: 'Planetary Conjunction',
        location: 'Best before sunrise in the east',
        imageUrl: apods[5].displayUrl,
        description: `Venus and Jupiter will look very close together, like a double star. Easy to spot with the naked eye before sunrise.`
      },
      {
        id: 7,
        title: 'Annular Solar Eclipse',
        date: '2026-02-17T00:00:00',
        type: 'Eclipse',
        location: 'Antarctica and Southern Hemisphere',
        imageUrl: apods[6].displayUrl,
        description: `The Moon will cover the Sun's center, leaving a glowing ring called the “ring of fire.” It’s not total, but still very dramatic.`
      },
      {
        id: 8,
        title: 'Saturn at Opposition',
        date: '2025-08-27T00:00:00',
        type: 'Planetary Event',
        location: 'Visible all night worldwide',
        imageUrl: apods[7].displayUrl,
        description: `Saturn will be very bright and easy to spot. You can see its famous rings with a telescope. Best time of year to see it clearly.`
      },
      {
        id: 9,
        title: 'Lyrid Meteor Shower',
        date: '2026-04-22T00:00:00',
        type: 'Meteor Shower',
        location: 'Just before dawn in dark skies',
        imageUrl: apods[8].displayUrl,
        description: `The Lyrids are an annual meteor shower. About 20 meteors per hour can be seen in dark skies.`
      }
    ];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

/**
 * Fetches event details by ID
 */
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
