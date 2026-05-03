import { create } from 'zustand';
import type { DispatchSession, DispatchStreamEvent } from '@features/dispatch/api/dispatch.api';
import type { Lead } from '@features/leads/api/leads.api';

interface SelectionState {
  selectedLeads: Set<string>;
  isSelectionMode: boolean;
  selectLead: (id: string) => void;
  deselectLead: (id: string) => void;
  toggleLead: (id: string) => void;
  clearSelection: () => void;
  selectAll: (leads: Lead[]) => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedLeads: new Set(),
  isSelectionMode: false,
  selectLead: (id) =>
    set((state) => {
      const newSet = new Set(state.selectedLeads);
      newSet.add(id);
      return { selectedLeads: newSet, isSelectionMode: true };
    }),
  deselectLead: (id) =>
    set((state) => {
      const newSet = new Set(state.selectedLeads);
      newSet.delete(id);
      return {
        selectedLeads: newSet,
        isSelectionMode: newSet.size > 0,
      };
    }),
  toggleLead: (id) =>
    set((state) => {
      const newSet = new Set(state.selectedLeads);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return {
        selectedLeads: newSet,
        isSelectionMode: newSet.size > 0,
      };
    }),
  clearSelection: () => set({ selectedLeads: new Set(), isSelectionMode: false }),
  selectAll: (leads) =>
    set({
      selectedLeads: new Set(leads.map((l) => l.id)),
      isSelectionMode: leads.length > 0,
    }),
}));

interface DispatchState {
  currentSession: DispatchSession | null;
  events: DispatchStreamEvent[];
  isDispatching: boolean;
  setCurrentSession: (session: DispatchSession | null) => void;
  addEvent: (event: DispatchStreamEvent) => void;
  clearEvents: () => void;
  setIsDispatching: (isDispatching: boolean) => void;
}

export const useDispatchStore = create<DispatchState>((set) => ({
  currentSession: null,
  events: [],
  isDispatching: false,
  setCurrentSession: (session) => set({ currentSession: session }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  clearEvents: () => set({ events: [] }),
  setIsDispatching: (isDispatching) => set({ isDispatching }),
}));
