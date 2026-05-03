import { api } from '@core/services/api';

export interface PrivacyExport {
  leadId: string;
  clinicId: string;
  phone: string;
  data: {
    leads: unknown[];
    dispatchLogs: unknown[];
    quickDispatchItems: unknown[];
    suppressions: unknown[];
  };
  exportedAt: string;
}

export interface OptOutRequest {
  leadId?: string;
  clinicId?: string;
  phone: string;
  reason?: string;
}

export interface AnonymizeRequest {
  leadId?: string;
  clinicId?: string;
  phone: string;
}

export async function exportPrivacyData(leadId?: string, phone?: string): Promise<PrivacyExport> {
  const params: Record<string, string> = {};
  if (leadId) params.leadId = leadId;
  if (phone) params.phone = phone;

  const response = await api.get('/privacy/data-subjects/export', { params });
  return response.data;
}

export async function requestOptOut(data: OptOutRequest): Promise<void> {
  await api.post('/privacy/data-subjects/opt-out', data);
}

export async function anonymizeData(data: AnonymizeRequest): Promise<void> {
  await api.post('/privacy/data-subjects/anonymize', data);
}