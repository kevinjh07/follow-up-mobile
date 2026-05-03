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