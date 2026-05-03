import { useEffect } from 'react';
import { Slot } from 'expo-router';
import { ThemeProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@core/stores/authStore';
import { theme } from '@core/theme';

const queryClient = new QueryClient();

export default function RootLayout() {
  const { loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Slot />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
