import { api } from '@core/services/api';

export type ConnectionStatus = 'disconnected' | 'qr_pending' | 'code_pending' | 'connected';

export interface WhatsAppStatus {
  status: ConnectionStatus;
  qrCode?: string;
  pairingCode?: string;
}

export interface WhatsAppInstance {
  clinicId: string;
  status: ConnectionStatus;
}

export async function fetchWhatsAppInstances(): Promise<WhatsAppInstance[]> {
  const response = await api.get('/whatsapp/instances');
  return response.data;
}

export async function fetchWhatsAppStatus(clinicId: string): Promise<WhatsAppStatus> {
  const response = await api.get(`/whatsapp/instances/${clinicId}/status`);
  return response.data;
}

export async function fetchWhatsAppQRCode(clinicId: string): Promise<string> {
  const response = await api.get(`/whatsapp/instances/${clinicId}/qr`);
  return response.data.qrCode;
}

export async function startWhatsAppInstance(clinicId: string): Promise<WhatsAppStatus> {
  const response = await api.post('/whatsapp/instances/start', { clinicId });
  return response.data;
}

export async function startWhatsAppWithCode(clinicId: string): Promise<WhatsAppStatus> {
  const response = await api.post('/whatsapp/instances/start-with-code', { clinicId });
  return response.data;
}

export async function disconnectWhatsApp(clinicId: string): Promise<void> {
  await api.delete(`/whatsapp/instances/${clinicId}`);
}
