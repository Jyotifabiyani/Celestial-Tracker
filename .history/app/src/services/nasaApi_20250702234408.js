import axios from 'axios';

const NASA_API_KEY = import.meta.env.VITE_APP_NASA_API_KEY;
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

const FALLBACK_IMAGE = 'https://apod.nasa.gov/apod/image/2406/NGC6188-RGB-ESO-32bit-2048.jpg';

export const getAstronomyPicture = async (date = null) => {
  try {
    const params = {
      api_key: NASA_API_KEY || 'DEMO_KEY',
      thumbs: true
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
    // Get 9 recent APODs for 9 events
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
        description: 'Annual meteor shower with up to 100 meteors per hour',
        type: 'Meteor Shower',
        imageUrl: apods[0].displayUrl
      },
      {
        id: 2,
        title: 'Jupiter at Opposition',
        date: '2025-11-03T00:00:00',
        description: 'Jupiter will be at its closest approach to Earth',
        type: 'Planetary Event',
        imageUrl: apods[1].displayUrl
      },
      {
        id: 3,
        title: 'Total Solar Eclipse',
        date: '2026-08-12T00:00:00',
        description: 'Total solar eclipse visible from parts of Europe and Asia',
        type: 'Eclipse',
        imageUrl: apods[2].displayUrl
      },
      {
        id: 4,
        title: 'Mars Close Approach',
        date: '2025-12-08T00:00:00',
        description: 'Mars will be at its closest to Earth until 2027',
        type: 'Planetary Event',
        imageUrl: apods[3].displayUrl
      },
      {
        id: 5,
        title: 'Gemini Meteor Shower',
        date: '2025-12-14T00:00:00',
        description: 'One of the best meteor showers with multicolored meteors',
        type: 'Meteor Shower',
        imageUrl: apods[4].displayUrl
      },
      {
        id: 6,
        title: 'Venus-Jupiter Conjunction',
        date: '2025-03-01T00:00:00',
        description: 'Bright planets appearing extremely close in dawn sky',
        type: 'Planetary Conjunction',
        imageUrl: apods[5].displayUrl
      },
      {
        id: 7,
        title: 'Annular Solar Eclipse',
        date: '2026-02-17T00:00:00',
        description: 'Ring of fire eclipse visible from Antarctica',
        type: 'Eclipse',
        imageUrl: apods[6].displayUrl
      },
      {
        id: 8,
        title: 'Saturn at Opposition',
        date: '2025-08-27T00:00:00',
        description: 'Best time to view Saturn and its rings through telescope',
        type: 'Planetary Event',
        imageUrl: apods[7].displayUrl
      },
      {
        id: 9,
        title: 'Lyrid Meteor Shower',
        date: '2026-04-22T00:00:00',
        description: 'Medium-strength shower with about 20 meteors per hour',
        type: 'Meteor Shower',
        imageUrl: apods[8].displayUrl
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
    
    if (!event) {
      throw new Error('Event not found');
    }
    
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