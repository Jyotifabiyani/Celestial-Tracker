import axios from 'axios';

const NASA_API_KEY = import.meta.env.VITE_APP_NASA_API_KEY || 'DEMO_KEY';
const BASE_URL = 'https://api.nasa.gov/planetary/apod';
const DONKI_BASE_URL = 'https://api.nasa.gov/DONKI';

const FALLBACK_IMAGE = 'https://apod.nasa.gov/apod/image/2406/NGC6188-RGB-ESO-32bit-2048.jpg';

const SPACE_WEATHER_IMAGES = {
  'IPS': 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'CME': 'https://www.nasa.gov/wp-content/uploads/2023/05/sun-1024x576.jpg',
  'FLR': 'https://www.nasa.gov/wp-content/uploads/2023/05/solar-flare-1024x576.jpg',
  'SEP': 'https://www.nasa.gov/wp-content/uploads/2023/05/radiation-storm-1024x576.jpg',
  'GST': 'https://www.nasa.gov/wp-content/uploads/2023/05/geomagnetic-storm-1024x576.jpg',
  'default': 'https://www.nasa.gov/wp-content/uploads/2023/05/space-weather-1024x576.jpg'
};

// Fetch APOD image
export const getAstronomyPicture = async (date = null) => {
  try {
    const params = { api_key: NASA_API_KEY, thumbs: true };
    if (date) params.date = date;
    
    const response = await axios.get(BASE_URL, { params });
    return {
      ...response.data,
      displayUrl: response.data.media_type === 'video' ? 
        (response.data.thumbnail_url || FALLBACK_IMAGE) : 
        (response.data.hdurl || response.data.url || FALLBACK_IMAGE),
      title: response.data.title || 'Astronomy Picture of the Day',
      explanation: response.data.explosion || 'No description available.',
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

// Format DONKI description
const formatDonkiDescription = (event) => {
  if (!event.messageBody) {
    return `Space weather event detected: ${event.messageType}. Issued on ${new Date(event.messageIssueTime).toLocaleDateString()}.`;
  }
  return event.messageBody
    .replace(/##/g, '')
    .replace(/\n/g, ' ')
    .substring(0, 300) + '...';
};

// Fetch real space weather events
const getRealNasaEvents = async () => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const response = await axios.get(`${DONKI_BASE_URL}/notifications`, {
      params: {
        api_key: NASA_API_KEY,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      }
    });

    return response.data
      .filter(event => event.messageType && event.messageIssueTime)
      .map((event, index) => {
        const eventType = event.messageType.split(' ')[0];
        return {
          id: 1000 + index,
          title: event.messageTitle || `${eventType} Event`,
          date: event.messageIssueTime,
          type: 'Space Weather',
          subtype: eventType,
          location: 'Space',
          imageUrl: SPACE_WEATHER_IMAGES[eventType] || SPACE_WEATHER_IMAGES.default,
          description: formatDonkiDescription(event),
          rawData: event,
          isRealEvent: true,
          priority: 1
        };
      });
  } catch (error) {
    console.error('Error fetching real events:', error);
    return [];
  }
};

// Curated manual events
const getCuratedEvents = async () => {
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
      location: 'Northern Hemisphere',
      imageUrl: apods[0].displayUrl,
      description: 'Annual meteor shower producing up to 100 meteors per hour in August.',
      isRealEvent: false,
      priority: 2
    },
    {
      id: 2,
      title: 'Jupiter at Opposition',
      date: '2025-11-03T00:00:00',
      type: 'Planetary Event',
      location: 'Night sky worldwide',
      imageUrl: apods[1].displayUrl,
      description: 'Jupiter shines the brightest and is closest to Earth. Look east after sunset.',
      isRealEvent: false,
      priority: 2
    },
    {
      id: 3,
      title: 'Total Solar Eclipse',
      date: '2026-08-12T00:00:00',
      type: 'Eclipse',
      location: 'Europe & Asia',
      imageUrl: apods[2].displayUrl,
      description: 'The Moon blocks the Sun completely, turning day into night.',
      isRealEvent: false,
      priority: 2
    },
    {
      id: 4,
      title: 'Mars Close Approach',
      date: '2025-12-08T00:00:00',
      type: 'Planetary Event',
      location: 'Eastern sky after sunset',
      imageUrl: apods[3].displayUrl,
      description: 'Mars will appear bright and red, best time to view with a telescope.',
      isRealEvent: false,
      priority: 2
    },
    {
      id: 5,
      title: 'Geminid Meteor Shower',
      date: '2025-12-14T00:00:00',
      type: 'Meteor Shower',
      location: 'Northern Hemisphere',
      imageUrl: apods[4].displayUrl,
      description: 'A strong meteor shower known for bright colorful meteors every December.',
      isRealEvent: false,
      priority: 2
    },
    {
      id: 6,
      title: 'Venus-Jupiter Conjunction',
      date: '2025-03-01T00:00:00',
      type: 'Planetary Conjunction',
      location: 'Pre-dawn eastern sky',
      imageUrl: apods[5].displayUrl,
      description: 'Venus and Jupiter appear very close, a stunning view without a telescope.',
      isRealEvent: false,
      priority: 2
    },
    {
      id: 7,
      title: 'Annular Solar Eclipse',
      date: '2026-02-17T00:00:00',
      type: 'Eclipse',
      location: 'Southern Hemisphere',
      imageUrl: apods[6].displayUrl,
      description: 'Moon doesn\'t fully cover the Sun. Watch the "ring of fire" safely.',
      isRealEvent: false,
      priority: 2
    },
    {
      id: 8,
      title: 'Saturn at Opposition',
      date: '2025-08-27T00:00:00',
      type: 'Planetary Event',
      location: 'Worldwide night sky',
      imageUrl: apods[7].displayUrl,
      description: 'Best time to view Saturn and its rings all night long.',
      isRealEvent: false,
      priority: 2
    },
    {
      id: 9,
      title: 'Lyrid Meteor Shower',
      date: '2026-04-22T00:00:00',
      type: 'Meteor Shower',
      location: 'Pre-dawn hours',
      imageUrl: apods[8].displayUrl,
      description: '20+ meteors per hour. Best seen early morning under dark skies.',
      isRealEvent: false,
      priority: 2
    }
  ];
};

// Get combined events with real events fixed at positions 7-9
export const getUpcomingEvents = async () => {
  try {
    const [realEvents, curatedEvents] = await Promise.all([
      getRealNasaEvents(),
      getCuratedEvents()
    ]);

    // Take maximum 3 newest real events (for positions 7-9)
    const latestRealEvents = realEvents
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // Newest first
      .slice(0, 3);

    // Prepare curated events (positions 1-6)
    const sortedCuratedEvents = curatedEvents
      .sort((a, b) => new Date(a.date) - new Date(b.date)) // Oldest first
      .slice(0, 6); // Take first 6

    // Combine with real events at the end
    let combinedEvents = [...sortedCuratedEvents, ...latestRealEvents];

    // Ensure we have exactly 9 events
    if (combinedEvents.length < 9) {
      // If not enough events, fill with more curated events
      const needed = 9 - combinedEvents.length;
      const extraCurated = curatedEvents
        .filter(e => !combinedEvents.includes(e))
        .slice(0, needed);
      combinedEvents = [...combinedEvents, ...extraCurated];
    }

    return combinedEvents.slice(0, 9);
  } catch (error) {
    console.error('Error fetching events:', error);
    // Fallback to curated events with 3 newest at the end
    const curated = await getCuratedEvents();
    const sorted = curated.sort((a, b) => new Date(a.date) - new Date(b.date));
    return [...sorted.slice(0, 6), ...sorted.slice(-3)].slice(0, 9);
  }
};

// Get single event by ID
export const getEventById = async (id) => {
  try {
    const events = await getUpcomingEvents();
    const event = events.find(e => e.id === parseInt(id));
    if (!event) throw new Error('Event not found');

    if (event.isRealEvent) {
      return {
        ...event,
        fullDescription: event.rawData.messageBody || event.description,
        source: 'NASA Space Weather Database',
        links: event.rawData.messageURL ? [{ url: event.rawData.messageURL, title: 'NASA Official Report' }] : []
      };
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
      imageUrl: FALLBACK_IMAGE,
      isRealEvent: false
    };
  }
};