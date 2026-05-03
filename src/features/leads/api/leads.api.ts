import { api } from '@core/services/api';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'OUTREACH' | 'TESTIMONIAL' | 'CLOSURE' | 'FINALIZED';
  clinicId: string;
  createdAt: string;
}

export type NewLead = Pick<Lead, 'name' | 'email' | 'phone' | 'clinicId'>;

export async function fetchLeads(clinicId?: string): Promise<Lead[]> {
  const params = clinicId ? { clinicId } : {};
  const response = await api.get('/leads', { params });
  return response.data;
}

export async function fetchLead(id: string): Promise<Lead> {
  const response = await api.get(`/leads/${id}`);
  return response.data;
}

export async function createLead(data: NewLead): Promise<Lead> {
  const response = await api.post('/leads', data);
  return response.data;
}

export async function updateLead(id: string, data: Partial<NewLead>): Promise<Lead> {
  const response = await api.put(`/leads/${id}`, data);
  return response.data;
}

export async function deleteLead(id: string): Promise<void> {
  await api.delete(`/leads/${id}`);
}

export async function updateLeadStatus(id: string, status: Lead['status']): Promise<Lead> {
  const response = await api.patch(`/leads/${id}/status`, { status });
  return response.data;
}

export async function optOutLead(id: string): Promise<Lead> {
  const response = await api.patch(`/leads/${id}/opt-out`);
  return response.data;
}

export async function anonymizeLead(id: string): Promise<void> {
  await api.delete(`/leads/${id}`);
}
