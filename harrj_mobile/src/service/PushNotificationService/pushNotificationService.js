import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onNotification: notification =>
    console.log('Local Notification', notification),
  popInitialNotification: true,
  requestPermissions: true,
});

PushNotification.createChannel(
  {
    channelId: 'channel-id',
    channelName: 'My channel',
    channelDescription: 'A channel to categorise your notifications',
    playSound: true,
    soundName: 'notification.mp3',
    vibrate: true,
  },
  created => console.log(`createChannel returned '${created}'`),
);

export const LocalNotification = () => {
  PushNotification.localNotification({
    channelId: 'channel-id',
    autoCancel: true,
    bigText: 'This is a Local Push Notification Test',
    subText: 'This is a Local Push Notification SubText Test',
    title: 'Local Push Notification Example',
    message: 'message',
    vibrate: true,
    vibration: 300,
    playSound: true,
    soundName: 'default',
  });
};
