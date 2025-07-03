import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  FormControlLabel,
  Switch,
  TextField,
  Button,
  Paper
} from '@mui/material';
import {
  saveSettings,
  loadSettings,
  getUserLocation
} from '../services/settingsService';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    location: '',
    notificationTime: 60,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const saved = loadSettings();
        setSettings(saved);
      } catch (err) {
        console.error('Failed to load settings', err);
      }
    };

    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const detectLocation = async () => {
    try {
      const location = await getUserLocation();
      setSettings((prev) => ({
        ...prev,
        location: `${location.lat}, ${location.lon}`
      }));
    } catch (err) {
      console.error('Failed to get location', err);
      alert('Unable to detect location.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = saveSettings(settings);
    if (success) {
      alert('Settings saved successfully!');
    } else {
      alert('Failed to save settings.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Settings
        </Typography>

        <Paper elevation={3} sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications}
                  onChange={handleChange}
                  name="notifications"
                  color="primary"
                />
              }
              label="Enable Notifications"
            />

            <TextField
              fullWidth
              label="Your Location (City or Coordinates)"
              name="location"
              value={settings.location}
              onChange={handleChange}
              margin="normal"
            />

            <Button
              onClick={detectLocation}
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            >
              Detect My Location
            </Button>

            <TextField
              fullWidth
              label="Notify me (minutes before event)"
              name="notificationTime"
              type="number"
              value={settings.notificationTime}
              onChange={handleChange}
              margin="normal"
              inputProps={{ min: 1 }}
            />

            <Box sx={{ mt: 3 }}>
              <Button type="submit" variant="contained" color="primary">
                Save Settings
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

// ✅ Default export for use in App.jsx
export default Settings;
