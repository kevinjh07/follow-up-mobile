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