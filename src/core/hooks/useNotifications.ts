import { useEffect } from 'react';
import { useNavigation as useNav } from '@react-navigation/native';

const isExpoGo = !__DEV__;

export function useNotifications() {
  const navigation = useNav();

  useEffect(() => {
    if (isExpoGo) return;

    let subscription: { remove: () => void } | null = null;

    const setup = async () => {
      try {
        const {
          requestNotificationPermissions,
          getExpoPushToken,
          addNotificationResponseReceivedListener,
        } = await import('@core/services/notifications');

        await requestNotificationPermissions();
        const token = await getExpoPushToken();
        if (token) {
          console.log('Push token:', token);
        }

        subscription = addNotificationResponseReceivedListener((response) => {
          const data = response.notification.request.content.data;
          if (data?.route) {
            navigation.navigate(data.route as never);
          }
        });
      } catch {
        // Notifications not available
      }
    };

    setup();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [navigation]);
}