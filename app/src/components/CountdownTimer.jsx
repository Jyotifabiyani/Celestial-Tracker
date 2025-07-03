import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  function calculateTimeLeft() {
    const difference = new Date(targetDate) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {Object.keys(timeLeft).map((interval) => (
        <Box key={interval} sx={{ textAlign: 'center' }}>
          <Typography variant="h5" fontWeight="bold">
            {String(timeLeft[interval]).padStart(2, '0')}
          </Typography>
          <Typography variant="caption">{interval}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default CountdownTimer;