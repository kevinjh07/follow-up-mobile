import { fetchLeads, fetchLead, createLead, updateLead, deleteLead, updateLeadStatus, type Lead } from './leads.api';
import { api } from '@core/services/api';

jest.mock('@core/services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockApi = api as jest.MockedObject<typeof api>;

const mockLeads = [
  { id: 'lead-1', name: 'Lead A', email: 'lead-a@test.com', phone: '111', status: 'OUTREACH' as const, clinicId: 'clinic-1', createdAt: '2024-01-01' },
  { id: 'lead-2', name: 'Lead B', email: 'lead-b@test.com', phone: '222', status: 'CLOSURE' as const, clinicId: 'clinic-2', createdAt: '2024-01-02' },
];

describe('leads.api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchLeads', () => {
    it('should fetch all leads when no clinicId provided', async () => {
      (mockApi.get as jest.Mock).mockResolvedValueOnce({ data: mockLeads });

      const leads = await fetchLeads();

      expect(mockApi.get).toHaveBeenCalledWith('/leads', { params: {} });
      expect(leads).toEqual(mockLeads);
    });

    it('should fetch leads filtered by clinicId', async () => {
      (mockApi.get as jest.Mock).mockResolvedValueOnce({ data: [mockLeads[0]] });

      const leads = await fetchLeads('clinic-1');

      expect(mockApi.get).toHaveBeenCalledWith('/leads', { params: { clinicId: 'clinic-1' } });
      expect(leads).toEqual([mockLeads[0]]);
      expect(leads.length).toBe(1);
    });

    it('should return lead array with correct structure', async () => {
      (mockApi.get as jest.Mock).mockResolvedValueOnce({ data: mockLeads });

      const leads = await fetchLeads();

      leads.forEach(lead => {
        expect(lead).toHaveProperty('id');
        expect(lead).toHaveProperty('name');
        expect(lead).toHaveProperty('email');
        expect(lead).toHaveProperty('status');
      });
    });
  });

  describe('fetchLead', () => {
    it('should fetch single lead by id', async () => {
      (mockApi.get as jest.Mock).mockResolvedValueOnce({ data: mockLeads[0] });

      const lead = await fetchLead('lead-1');

      expect(mockApi.get).toHaveBeenCalledWith('/leads/lead-1');
      expect(lead).toEqual(mockLeads[0]);
    });

    it('should return lead with all properties', async () => {
      (mockApi.get as jest.Mock).mockResolvedValueOnce({ data: mockLeads[0] });

      const lead = await fetchLead('lead-1');

      expect(lead).toHaveProperty('id');
      expect(lead).toHaveProperty('name');
      expect(lead).toHaveProperty('email');
      expect(lead).toHaveProperty('phone');
      expect(lead).toHaveProperty('status');
      expect(lead).toHaveProperty('clinicId');
      expect(lead).toHaveProperty('createdAt');
    });
  });

  describe('createLead', () => {
    it('should create new lead', async () => {
      const newLeadData = {
        name: 'Novo Lead',
        email: 'novo@test.com',
        phone: '999999999',
        clinicId: 'clinic-1',
      };
      const createdLead = { id: 'new-lead-id', ...newLeadData, status: 'OUTREACH' as const, createdAt: '2024-01-01' };
      (mockApi.post as jest.Mock).mockResolvedValueOnce({ data: createdLead });

      const created = await createLead(newLeadData);

      expect(mockApi.post).toHaveBeenCalledWith('/leads', newLeadData);
      expect(created.id).toBe('new-lead-id');
      expect(created.name).toBe(newLeadData.name);
    });

    it('should return created lead with correct properties', async () => {
      const newLeadData = {
        name: 'Novo Lead',
        email: 'novo@test.com',
        phone: '999999999',
        clinicId: 'clinic-1',
      };
      const createdLead = { id: 'new-lead-id', ...newLeadData, status: 'OUTREACH' as const, createdAt: '2024-01-01' };
      (mockApi.post as jest.Mock).mockResolvedValueOnce({ data: createdLead });

      const created = await createLead(newLeadData);

      expect(created.status).toBe('OUTREACH');
    });
  });

  describe('updateLead', () => {
    it('should update lead with partial data', async () => {
      const updateData = { name: 'Lead Atualizado' };
      const updatedLead = { ...mockLeads[0], ...updateData };
      (mockApi.put as jest.Mock).mockResolvedValueOnce({ data: updatedLead });

      const updated = await updateLead('lead-1', updateData);

      expect(mockApi.put).toHaveBeenCalledWith('/leads/lead-1', updateData);
      expect(updated.name).toBe('Lead Atualizado');
    });

    it('should preserve unchanged fields', async () => {
      const updateData = { name: 'Nome Alterado' };
      const updatedLead = { ...mockLeads[0], ...updateData };
      (mockApi.put as jest.Mock).mockResolvedValueOnce({ data: updatedLead });

      const updated = await updateLead('lead-1', updateData);

      expect(updated.email).toBe(mockLeads[0].email);
      expect(updated.phone).toBe(mockLeads[0].phone);
    });
  });

  describe('updateLeadStatus', () => {
    it('should update lead status to CLOSURE', async () => {
      const updatedLead = { ...mockLeads[0], status: 'CLOSURE' as const };
      (mockApi.patch as jest.Mock).mockResolvedValueOnce({ data: updatedLead });

      const updated = await updateLeadStatus('lead-1', 'CLOSURE');

      expect(mockApi.patch).toHaveBeenCalledWith('/leads/lead-1/status', { status: 'CLOSURE' });
      expect(updated.status).toBe('CLOSURE');
    });

    it('should update lead status to FINALIZED', async () => {
      const updatedLead = { ...mockLeads[0], status: 'FINALIZED' as const };
      (mockApi.patch as jest.Mock).mockResolvedValueOnce({ data: updatedLead });

      const updated = await updateLeadStatus('lead-1', 'FINALIZED');

      expect(updated.status).toBe('FINALIZED');
    });

    it('should accept all valid status values', async () => {
      const statuses: Lead['status'][] = ['OUTREACH', 'TESTIMONIAL', 'CLOSURE', 'FINALIZED'];

      for (const status of statuses) {
        const updatedLead = { ...mockLeads[0], status };
        (mockApi.patch as jest.Mock).mockResolvedValueOnce({ data: updatedLead });

        const updated = await updateLeadStatus('lead-1', status);
        expect(updated.status).toBe(status);
      }
    });
  });

  describe('deleteLead', () => {
    it('should call delete with correct id', async () => {
      (mockApi.delete as jest.Mock).mockResolvedValueOnce({ data: undefined });

      await deleteLead('lead-1');

      expect(mockApi.delete).toHaveBeenCalledWith('/leads/lead-1');
    });

    it('should not throw on successful delete', async () => {
      (mockApi.delete as jest.Mock).mockResolvedValueOnce({ data: undefined });

      await expect(deleteLead('lead-1')).resolves.not.toThrow();
    });
  });
});