import { fetchLeads, fetchLead, createLead, updateLead, deleteLead, updateLeadStatus } from './leads.api';
import { api } from '@core/services/api';

jest.mock('@core/services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  },
}));

describe('leads.api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch leads list', async () => {
    const mockResponse = { data: [{ id: '1', name: 'Lead A' }] };
    (api.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await fetchLeads();

    expect(api.get).toHaveBeenCalledWith('/leads', { params: {} });
    expect(result).toEqual(mockResponse.data);
  });

  it('should fetch leads by clinic id', async () => {
    const mockResponse = { data: [{ id: '1', name: 'Lead A' }] };
    (api.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await fetchLeads('clinic-1');

    expect(api.get).toHaveBeenCalledWith('/leads', { params: { clinicId: 'clinic-1' } });
    expect(result).toEqual(mockResponse.data);
  });

  it('should fetch single lead by id', async () => {
    const mockResponse = { data: { id: '1', name: 'Lead A' } };
    (api.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await fetchLead('1');

    expect(api.get).toHaveBeenCalledWith('/leads/1');
    expect(result).toEqual(mockResponse.data);
  });

  it('should create lead', async () => {
    const newLead = { name: 'Novo Lead', email: 'lead@test.com', phone: '123456789', clinicId: 'c1' };
    const mockResponse = { data: { id: '2', ...newLead } };
    (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await createLead(newLead);

    expect(api.post).toHaveBeenCalledWith('/leads', newLead);
    expect(result).toEqual(mockResponse.data);
  });

  it('should update lead', async () => {
    const updateData = { name: 'Lead Atualizado' };
    const mockResponse = { data: { id: '1', ...updateData } };
    (api.put as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await updateLead('1', updateData);

    expect(api.put).toHaveBeenCalledWith('/leads/1', updateData);
    expect(result).toEqual(mockResponse.data);
  });

  it('should delete lead', async () => {
    (api.delete as jest.Mock).mockResolvedValueOnce({});

    await deleteLead('1');

    expect(api.delete).toHaveBeenCalledWith('/leads/1');
  });

  it('should update lead status', async () => {
    const mockResponse = { data: { id: '1', status: 'CLOSURE' } };
    (api.patch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await updateLeadStatus('1', 'CLOSURE');

    expect(api.patch).toHaveBeenCalledWith('/leads/1/status', { status: 'CLOSURE' });
    expect(result).toEqual(mockResponse.data);
  });
});