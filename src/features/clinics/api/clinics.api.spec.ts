import { fetchClinics, fetchClinic, createClinic, updateClinic, deleteClinic } from './clinics.api';
import { api } from '@core/services/api';

jest.mock('@core/services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('clinics.api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch clinics list', async () => {
    const mockResponse = { data: [{ id: '1', name: 'Clinica A' }] };
    (api.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await fetchClinics();

    expect(api.get).toHaveBeenCalledWith('/clinics');
    expect(result).toEqual(mockResponse.data);
  });

  it('should fetch single clinic by id', async () => {
    const mockResponse = { data: { id: '1', name: 'Clinica A' } };
    (api.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await fetchClinic('1');

    expect(api.get).toHaveBeenCalledWith('/clinics/1');
    expect(result).toEqual(mockResponse.data);
  });

  it('should create clinic', async () => {
    const newClinic = { name: 'Nova Clinica', cnpj: '12345678901234' };
    const mockResponse = { data: { id: '2', ...newClinic } };
    (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await createClinic(newClinic);

    expect(api.post).toHaveBeenCalledWith('/clinics', newClinic);
    expect(result).toEqual(mockResponse.data);
  });

  it('should update clinic', async () => {
    const updateData = { name: 'Clinica Atualizada' };
    const mockResponse = { data: { id: '1', ...updateData } };
    (api.put as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await updateClinic('1', updateData);

    expect(api.put).toHaveBeenCalledWith('/clinics/1', updateData);
    expect(result).toEqual(mockResponse.data);
  });

  it('should delete clinic', async () => {
    (api.delete as jest.Mock).mockResolvedValueOnce({});

    await deleteClinic('1');

    expect(api.delete).toHaveBeenCalledWith('/clinics/1');
  });
});
