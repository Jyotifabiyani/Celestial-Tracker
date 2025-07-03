import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import { Delete, Notifications } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const RemindersPage = () => {
  const [reminders, setReminders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadReminders = () => {
      const savedReminders = localStorage.getItem('celestialReminders');
      if (savedReminders) {
        try {
          const parsed = JSON.parse(savedReminders);
          // Convert string dates back to Date objects
          const withDates = parsed.map(r => ({
            ...r,
            date: r.date ? new Date(r.date) : new Date()
          }));
          setReminders(withDates);
        } catch (error) {
          console.error('Error parsing reminders:', error);
        }
      }
    };

    // Load immediately
    loadReminders();

    // Set up storage event listener
    const handleStorageChange = (e) => {
      if (e.key === 'celestialReminders') {
        loadReminders();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleDelete = (id) => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    localStorage.setItem('celestialReminders', JSON.stringify(updated));
  };

  const handleViewEvent = (id) => {
    if (id.startsWith('custom-')) {
      // Handle custom reminders differently if needed
      return;
    }
    navigate(`/event/${id}`);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Notifications sx={{ mr: 1 }} />
          Your Celestial Reminders
        </Typography>
        
        <Divider sx={{ mb: 3 }} />

        {reminders.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            No reminders set yet. Set reminders by clicking events in the calendar.
          </Alert>
        ) : (
          <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
            {reminders.map(reminder => (
              <ListItem 
                key={reminder.id}
                sx={{
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                  mb: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.05)'
                  }
                }}
                onClick={() => handleViewEvent(reminder.id)}
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(reminder.id);
                    }}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={reminder.title}
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                  secondary={
                    <>
                      <Box component="span" display="block">
                        {reminder.date.toLocaleString()}
                      </Box>
                      {reminder.description && (
                        <Box component="span" display="block" mt={1}>
                          {reminder.description}
                        </Box>
                      )}
                    </>
                  }
                />
                {reminder.imageUrl && (
                  <Box sx={{ ml: 2 }}>
                    <img 
                      src={reminder.imageUrl} 
                      alt={reminder.title}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 4
                      }}
                    />
                  </Box>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
};

export default RemindersPage;