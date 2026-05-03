import { api } from '@core/services/api';

export async function forgotPassword(email: string): Promise<void> {
  await api.post('/auth/forgot-password', { email });
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await api.post('/auth/reset-password', { token, password });
}

export async function activateAccount(token: string, password: string): Promise<void> {
  await api.post('/auth/activate', { token, password });
}
