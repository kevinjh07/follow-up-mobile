import { api } from '@core/services/api';

export type DispatchSessionStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';

export type DispatchStreamEventType = 'progress' | 'done' | 'error' | 'sending';

export interface DispatchProgressEvent {
  type: 'progress';
  result: {
    leadId: string;
    phone: string;
    success: boolean;
    messageId?: string;
    error?: string;
  };
  index: number;
  total: number;
}

export interface DispatchDoneEvent {
  type: 'done';
  sessionId: string;
  total: number;
  successful: number;
  failed: number;
  duration: number;
}

export interface DispatchErrorEvent {
  type: 'error';
  error: string;
}

export interface DispatchSendingEvent {
  type: 'sending';
  leadId: string;
  phone: string;
}

export type DispatchStreamEvent =
  | DispatchProgressEvent
  | DispatchDoneEvent
  | DispatchErrorEvent
  | DispatchSendingEvent;

export interface DispatchSession {
  id: string;
  clinicId: string;
  status: DispatchSessionStatus;
  total: number;
  successful: number;
  failed: number;
  createdAt: string;
  updatedAt: string;
}

export interface DispatchLog {
  id: string;
  sessionId: string;
  clinicId: string;
  leadId: string;
  phone: string;
  success: boolean;
  messageId?: string;
  error?: string;
  sentAt: string;
}

export async function startDispatch(clinicId: string, leadIds: string[]): Promise<DispatchSession> {
  const response = await api.post(`/dispatch/${clinicId}/selected`, { leadIds });
  return response.data;
}

export async function startQuickDispatch(
  clinicId: string,
  leads: { phone: string; name: string }[],
  consent: boolean,
): Promise<DispatchSession> {
  const response = await api.post(`/dispatch/${clinicId}/quick-stream`, { leads, consent });
  return response.data;
}

export async function getDispatchSessionStatus(sessionId: string): Promise<DispatchSession> {
  const response = await api.get(`/dispatch/sessions/${sessionId}/status`);
  return response.data;
}

export async function getActiveDispatchSessions(): Promise<DispatchSession[]> {
  const response = await api.get('/dispatch/sessions/active');
  return response.data;
}

export async function getDispatchLogs(clinicId?: string): Promise<DispatchLog[]> {
  const params = clinicId ? { clinicId } : {};
  const response = await api.get('/dispatch/logs', { params });
  return response.data;
}

export async function cancelDispatchSession(sessionId: string): Promise<void> {
  await api.delete(`/dispatch/sessions/${sessionId}`);
}
