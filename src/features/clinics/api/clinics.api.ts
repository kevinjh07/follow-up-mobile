import { api } from '@core/services/api';

export interface Clinic {
  id: string;
  name: string;
  cnpj: string;
  whatsappStatus: 'disconnected' | 'connecting' | 'connected';
  leadsCount: number;
  createdAt: string;
}

export async function fetchClinics(): Promise<Clinic[]> {
  const response = await api.get('/clinics');
  return response.data;
}

export async function fetchClinic(id: string): Promise<Clinic> {
  const response = await api.get(`/clinics/${id}`);
  return response.data;
}

export async function createClinic(data: Partial<Clinic>): Promise<Clinic> {
  const response = await api.post('/clinics', data);
  return response.data;
}

export async function updateClinic(id: string, data: Partial<Clinic>): Promise<Clinic> {
  const response = await api.put(`/clinics/${id}`, data);
  return response.data;
}

export async function deleteClinic(id: string): Promise<void> {
  await api.delete(`/clinics/${id}`);
}
