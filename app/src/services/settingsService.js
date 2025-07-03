// Default settings
const DEFAULT_SETTINGS = {
  notifications: true,
  notificationTime: 60, // minutes before event
  location: '',
  theme: 'dark',
  units: 'metric',
  subscribedEvents: {
    meteorShowers: true,
    solarEclipses: true,
    lunarEclipses: true,
    planetaryAlignments: true,
    issPasses: true
  },
  notificationSound: true,
  vibration: false
};

// Save settings to localStorage
export const saveSettings = (settings) => {
  try {
    localStorage.setItem('astroNotifierSettings', JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

// Load settings from localStorage
export const loadSettings = () => {
  try {
    const savedSettings = localStorage.getItem('astroNotifierSettings');
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
};

// Reset settings to defaults
export const resetSettings = () => {
  saveSettings(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
};

// Get user's current location
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};

// Validate notification permissions
export const checkNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return {
      supported: false,
      granted: false,
      permission: 'unsupported'
    };
  }

  if (Notification.permission === 'granted') {
    return {
      supported: true,
      granted: true,
      permission: 'granted'
    };
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return {
      supported: true,
      granted: permission === 'granted',
      permission
    };
  }

  return {
    supported: true,
    granted: false,
    permission: 'denied'
  };
};

// Schedule notification for an event
export const scheduleEventNotification = (event, minutesBefore = 60) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return false;
  }

  const notificationTime = new Date(event.date);
  notificationTime.setMinutes(notificationTime.getMinutes() - minutesBefore);

  const now = new Date();
  const timeUntilNotification = notificationTime - now;

  if (timeUntilNotification <= 0) {
    return false;
  }

  setTimeout(() => {
    const notification = new Notification(`Upcoming: ${event.title}`, {
      body: `${event.description}\n\nStarts at ${new Date(event.date).toLocaleTimeString()}`,
      icon: event.imageUrl || '/icons/icon-192x192.png',
      vibrate: [200, 100, 200]
    });

    notification.onclick = () => {
      window.focus();
    };
  }, timeUntilNotification);

  return true;
};

// Export default settings
export const defaultSettings = DEFAULT_SETTINGS;
