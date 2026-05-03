import { api } from '@core/services/api';

export interface LeadFunnel {
  OUTREACH: number;
  TESTIMONIAL: number;
  CLOSURE: number;
  FINALIZED: number;
}

export interface ClinicLeadCount {
  clinicId: string;
  clinicName: string;
  count: number;
}

export interface DispatchDashboardSession {
  id: string;
  clinicId: string;
  clinicName: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  total: number;
  sent: number;
  errors: number;
  startedAt: string;
  endedAt?: string;
}

export interface DashboardStats {
  totalLeads: number;
  newLeadsToday: number;
  activeSessions: number;
  disconnectedClinics: number;
  successRate: number;
}

export async function fetchLeadFunnel(): Promise<LeadFunnel> {
  const response = await api.get('/leads/funnel');
  return response.data;
}

export async function fetchNewLeadsByClinic(): Promise<ClinicLeadCount[]> {
  const response = await api.get('/leads/new-by-clinic');
  return response.data;
}

export async function fetchDispatchDashboardSessions(): Promise<DispatchDashboardSession[]> {
  const response = await api.get('/dispatch/sessions/dashboard');
  return response.data;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [funnel, newByClinic, sessions] = await Promise.all([
    fetchLeadFunnel(),
    fetchNewLeadsByClinic(),
    fetchDispatchDashboardSessions(),
  ]);

  const totalLeads = Object.values(funnel).reduce((sum, count) => sum + count, 0);
  const newLeadsToday = newByClinic.reduce((sum, c) => sum + c.count, 0);
  const activeSessions = sessions.filter((s) => s.status === 'RUNNING' || s.status === 'QUEUED').length;
  const disconnectedClinics = 0;
  const totalSent = sessions.reduce((sum, s) => sum + s.sent, 0);
  const totalErrors = sessions.reduce((sum, s) => sum + s.errors, 0);
  const successRate = totalSent + totalErrors > 0 ? Math.round((totalSent / (totalSent + totalErrors)) * 100) : 0;

  return {
    totalLeads,
    newLeadsToday,
    activeSessions,
    disconnectedClinics,
    successRate,
  };
}