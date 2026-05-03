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