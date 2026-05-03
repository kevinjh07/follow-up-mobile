export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'ATTENDANT' | 'OPS';
  clinicId?: string;
}

export interface Clinic {
  id: string;
  name: string;
  whatsappInstance?: string;
  active: boolean;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  cadenceStatus: 'OUTREACH' | 'TESTIMONIAL' | 'CLOSURE' | 'FINALIZED';
  clinicId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}
