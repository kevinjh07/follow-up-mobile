import { api } from '@core/services/api';

export type UserRole = 'ADMIN' | 'ATTENDANT' | 'OPS';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  clinicId?: string;
  createdAt: string;
}

export interface NewUser {
  email: string;
  name: string;
  role: UserRole;
  clinicId?: string;
}

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