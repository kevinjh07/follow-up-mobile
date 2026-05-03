import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import {
  requestNotificationPermissions,
  getExpoPushToken,
  addNotificationResponseReceivedListener,
} from '@core/services/notifications';

export function useNotifications() {
  const navigation = useNavigation();

  useEffect(() => {
    const setupNotifications = async () => {
      await requestNotificationPermissions();
      const token = await getExpoPushToken();
      if (token) {
        console.log('Push token:', token);
      }
    };

    setupNotifications();

    const subscription = addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.route) {
        navigation.navigate(data.route as never);
      }
    });

    return () => subscription.remove();
  }, [navigation]);
}