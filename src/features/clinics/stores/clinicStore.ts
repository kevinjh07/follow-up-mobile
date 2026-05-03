import { create } from 'zustand';
import type { Clinic } from '../api/clinics.api';

interface ClinicState {
  activeClinic: Clinic | null;
  setActiveClinic: (clinic: Clinic | null) => void;
  clearClinic: () => void;
}

export const useClinicStore = create<ClinicState>((set) => ({
  activeClinic: null,
  setActiveClinic: (clinic) => set({ activeClinic: clinic }),
  clearClinic: () => set({ activeClinic: null }),
}));
