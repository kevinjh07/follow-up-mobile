import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '@core/stores/authStore';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const handleRefresh = async (originalRequest: RetryableRequestConfig) => {
  originalRequest._retry = true;
  const refreshToken = await SecureStore.getItemAsync('refreshToken');
  const response = await axios.post(
    `${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'}/auth/refresh`,
    { refreshToken },
  );
  const { token, refreshToken: newRefreshToken } = response.data;
  await SecureStore.setItemAsync('token', token);
  await SecureStore.setItemAsync('refreshToken', newRefreshToken);
  originalRequest.headers.Authorization = `Bearer ${token}`;
  return api(originalRequest);
};

const handleAuthError = async () => {
  await SecureStore.deleteItemAsync('token');
  await SecureStore.deleteItemAsync('refreshToken');
  useAuthStore.getState().clearToken();
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    if (!originalRequest) return Promise.reject(error);

    const isUnauthorized = error.response?.status === 401;
    const hasRefresh = await SecureStore.getItemAsync('refreshToken');

    if (isUnauthorized && hasRefresh && !originalRequest._retry) {
      try {
        return await handleRefresh(originalRequest);
      } catch {
        await handleAuthError();
      }
    }
    return Promise.reject(error);
  },
);

export { api };
