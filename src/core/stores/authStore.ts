import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { api } from '@core/services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'ATTENDANT' | 'VIEWER' | 'OPS';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),

  clearToken: () => {
    set({ user: null, token: null });
    SecureStore.deleteItemAsync('token');
    SecureStore.deleteItemAsync('refreshToken');
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      set({ user: null, token: null });
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('refreshToken');
    }
  },

  loadUser: async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        set({ isLoading: false });
        return;
      }
      set({ token });
      const response = await api.get('/auth/me');
      set({ user: response.data, isLoading: false });
    } catch {
      set({ user: null, token: null, isLoading: false });
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('refreshToken');
    }
  },
}));
