export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications.');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const scheduleNotification = (event, minutesBefore = 60) => {
  if (!('Notification' in window)) return;

  const notificationTime = new Date(event.date);
  notificationTime.setMinutes(notificationTime.getMinutes() - minutesBefore);

  const now = new Date();
  const timeUntilNotification = notificationTime - now;

  if (timeUntilNotification <= 0) return;

  setTimeout(() => {
    new Notification(`Upcoming Event: ${event.title}`, {
      body: `Don't miss the ${event.title} starting soon!`,
      icon: event.imageUrl,
    });
  }, timeUntilNotification);
};
