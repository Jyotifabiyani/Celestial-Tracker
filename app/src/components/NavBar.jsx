import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { 
  NightsStay, 
  CalendarToday, 
  Settings,
  Notifications,
  Chat as ChatIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <AppBar 
      position="static"
      sx={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        boxShadow: '0 4px 20px rgba(123, 97, 255, 0.3)',
        borderBottom: '1px solid rgba(123, 97, 255, 0.3)'
      }}
    >
      <Toolbar sx={{ padding: '0 24px' }}>
        <IconButton 
          edge="start" 
          sx={{ 
            color: 'white',
            marginRight: '16px',
            '&:hover': {
              transform: 'scale(1.1)',
              transition: 'transform 0.3s ease'
            }
          }}
          aria-label="logo"
        >
          <NightsStay sx={{ fontSize: '2rem' }} />
        </IconButton>
        
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            color: '#fff',
            textShadow: '0 0 8px rgba(123, 97, 255, 0.6)',
            fontWeight: 'bold',
            letterSpacing: '1px'
          }}
        >
          Celestial Tracker
        </Typography>
        
        <Button 
          sx={{
            color: '#e0e0e0',
            margin: '0 8px',
            '&:hover': {
              color: '#7b61ff',
              backgroundColor: 'rgba(123, 97, 255, 0.1)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}
          component={Link} 
          to="/" 
          startIcon={<NightsStay sx={{ color: 'white' }} />}
        >
          Events
        </Button>
        
        <Button 
          sx={{
            color: '#e0e0e0',
            margin: '0 8px',
            '&:hover': {
              color: '#7b61ff',
              backgroundColor: 'rgba(123, 97, 255, 0.1)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}
          component={Link} 
          to="/calendar" 
          startIcon={<CalendarToday sx={{ color: 'white' }} />}
        >
          Calendar
        </Button>
        
        <Button 
          sx={{
            color: '#e0e0e0',
            margin: '0 8px',
            '&:hover': {
              color: '#7b61ff',
              backgroundColor: 'rgba(123, 97, 255, 0.1)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}
          component={Link} 
          to="/reminders" 
          startIcon={<Notifications sx={{ color: 'white' }} />}
        >
          Reminders
        </Button>
        
        <Button 
          sx={{
            color: '#e0e0e0',
            margin: '0 8px',
            '&:hover': {
              color: '#7b61ff',
              backgroundColor: 'rgba(123, 97, 255, 0.1)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}
          component={Link} 
          to="/chatbot" 
          startIcon={<ChatIcon sx={{ color: 'white' }} />}
        >
          Space Chat
        </Button>
        
        <Button 
          sx={{
            color: '#e0e0e0',
            margin: '0 8px',
            '&:hover': {
              color: '#7b61ff',
              backgroundColor: 'rgba(123, 97, 255, 0.1)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}
          component={Link} 
          to="/settings" 
          startIcon={<Settings sx={{ color: 'white' }} />}
        >
          Settings
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;