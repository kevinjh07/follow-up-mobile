import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

export function createTestQueryClient() {
  return createQueryClient();
}

interface WrapperProps {
  children: React.ReactNode;
}

function createWrapper(queryClient: QueryClient) {
  return function TestWrapper({ children }: WrapperProps) {
    return (
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>{children}</NavigationContainer>
      </QueryClientProvider>
    );
  };
}

export interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: React.ReactElement,
  { queryClient = createQueryClient(), ...renderOptions }: RenderWithProvidersOptions = {},
) {
  const Wrapper = createWrapper(queryClient);

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
}

export { createWrapper };
export { createQueryClient };
export type { WrapperProps };
