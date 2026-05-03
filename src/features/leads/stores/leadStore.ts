import { create } from 'zustand';
import type { Lead } from '@features/leads/api/leads.api';

interface LeadState {
  selectedLead: Lead | null;
  setSelectedLead: (lead: Lead | null) => void;
}

export const useLeadStore = create<LeadState>((set) => ({
  selectedLead: null,
  setSelectedLead: (lead) => set({ selectedLead: lead }),
}));
