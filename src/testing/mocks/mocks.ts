/* eslint-disable no-undef */
/* global jest */
// @ts-nocheck

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    replace: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({}),
}));

jest.mock('react-native-paper', () => ({
  useTheme: () => ({
    colors: {
      primary: '#6200ee',
      background: '#ffffff',
      surface: '#ffffff',
      text: '#000000',
    },
  }),
  TextInput: 'TextInput',
  Button: 'Button',
  Text: 'Text',
  Title: 'Title',
}));

jest.mock('@core/stores/authStore', () => ({
  useAuthStore: jest.fn((selector?: (state: unknown) => unknown) => {
    const state = {
      user: null,
      token: null,
      isLoading: false,
      setUser: jest.fn(),
      setToken: jest.fn(),
      logout: jest.fn(),
      loadUser: jest.fn(),
      clearToken: jest.fn(),
    };
    return selector ? selector(state) : state;
  }),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: undefined, isLoading: false, error: null, refetch: jest.fn() }),
  useMutation: () => ({ mutate: jest.fn(), isPending: false }),
}));

jest.mock('@core/services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    defaults: { headers: { common: {} } },
    interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
  },
}));
