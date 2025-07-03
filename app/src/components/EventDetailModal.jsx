import { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Divider,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Schedule,
  LocationOn,
  Notifications,
  NotificationsActive,
  Share,
  Close
} from '@mui/icons-material';
import CountdownTimer from './CountdownTimer';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: '600px' },
  bgcolor: 'rgba(30, 30, 30, 0.95)',
  border: '2px solid #3f51b5',
  borderRadius: '16px',
  boxShadow: '0 0 30px rgba(63, 81, 181, 0.5)',
  p: 4,
  color: '#ffffff',
  outline: 'none'
};

const EventDetailModal = ({ open, onClose, event, isReminder, onToggleReminder }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h2" sx={{ color: '#BBDEFB' }}>
            {event.title}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: '#ffffff' }}>
            <Close />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

        <Box mb={3}>
          <Typography variant="h6" color="primary" gutterBottom>
            Happening in:
          </Typography>
          <CountdownTimer targetDate={event.start} />
        </Box>

        <Box mb={2} display="flex" alignItems="center">
          <Schedule color="action" sx={{ mr: 1 }} />
          <Typography variant="body1" sx={{ color: '#ddd' }}>
            {event.start.toLocaleString()}
          </Typography>
        </Box>

        {event.resource?.location && (
          <Box mb={2} display="flex" alignItems="center">
            <LocationOn color="action" sx={{ mr: 1 }} />
            <Typography variant="body1" sx={{ color: '#ddd' }}>
              {event.resource.location}
            </Typography>
          </Box>
        )}

        {event.resource?.type && (
          <Box mb={3}>
            <Chip
              label={event.resource.type}
              color="primary"
              sx={{ backgroundColor: '#3f51b5', color: '#fff' }}
            />
          </Box>
        )}

        {event.resource?.description && (
          <Box mb={3}>
            <Typography variant="body1" paragraph sx={{ color: '#ccc' }}>
              {event.resource.description}
            </Typography>
          </Box>
        )}

        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            variant="contained"
            startIcon={isReminder ? <NotificationsActive /> : <Notifications />}
            onClick={() => onToggleReminder(event.id)}
            color={isReminder ? 'success' : 'primary'}
          >
            {isReminder ? 'Reminder Set' : 'Set Reminder'}
          </Button>

          <Tooltip title={copied ? "Copied!" : "Copy event link"}>
            <Button
              variant="outlined"
              startIcon={<Share />}
              onClick={handleShare}
              sx={{ color: '#ffffff', borderColor: '#ffffff' }}
            >
              Share
            </Button>
          </Tooltip>
        </Box>
      </Box>
    </Modal>
  );
};

export default EventDetailModal;