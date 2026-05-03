import { api } from '@core/services/api';
import type { ConnectionStatus } from './whatsapp.api';

export interface Clinic {
  id: string;
  name: string;
  cnpj: string;
  whatsappStatus: ConnectionStatus;
  leadsCount: number;
  createdAt: string;
}

export type NewClinic = Pick<Clinic, 'name' | 'cnpj'>;

export async function fetchClinics(): Promise<Clinic[]> {
  const response = await api.get('/clinics');
  return response.data;
}

export async function fetchClinic(id: string): Promise<Clinic> {
  const response = await api.get(`/clinics/${id}`);
  return response.data;
}

export async function createClinic(data: NewClinic): Promise<Clinic> {
  const response = await api.post('/clinics', data);
  return response.data;
}

export async function updateClinic(id: string, data: Partial<NewClinic>): Promise<Clinic> {
  const response = await api.put(`/clinics/${id}`, data);
  return response.data;
}

export async function deleteClinic(id: string): Promise<void> {
  await api.delete(`/clinics/${id}`);
}

export async function exportClinicLeads(clinicId: string): Promise<string> {
  const response = await api.post(`/clinics/${clinicId}/export`);
  return response.data.jobId;
}
