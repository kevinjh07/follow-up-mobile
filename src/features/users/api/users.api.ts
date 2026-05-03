import { api } from '@core/services/api';
import type { User, NewUser } from '../types';

export type { User, NewUser, UserRole, UserStatus } from '../types';

export async function fetchUsers(): Promise<User[]> {
  const response = await api.get('/users');
  return response.data;
}

export async function fetchUser(id: string): Promise<User> {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

export async function createUser(data: NewUser): Promise<User> {
  const response = await api.post('/users', data);
  return response.data;
}

export async function updateUser(id: string, data: Partial<NewUser>): Promise<User> {
  const response = await api.patch(`/users/${id}`, data);
  return response.data;
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}

export async function resendInvitation(id: string): Promise<void> {
  await api.post(`/users/${id}/resend-invitation`);
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await api.patch('/users/me/password', { currentPassword, newPassword });
}
