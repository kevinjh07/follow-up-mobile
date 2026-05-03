import type { ConnectionStatus } from './api/whatsapp.api';

export interface Clinic {
  id: string;
  name: string;
  cnpj: string;
  whatsappStatus: ConnectionStatus;
  leadsCount: number;
  createdAt: string;
}

export type NewClinic = Pick<Clinic, 'name' | 'cnpj'>;
