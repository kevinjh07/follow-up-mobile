// Test setup - runs before all tests
// Import this file via setupFiles in jest.config.js

declare const global: {
  fetch: jest.Mock;
};

const mockFetch = jest.fn().mockImplementation((url: string) => {
  const mockData: Record<string, object> = {
    '/auth/me': { id: 'user-1', email: 'test@example.com', name: 'Test User', role: 'ATTENDANT' },
    '/clinics': [
      {
        id: 'clinic-1',
        name: 'Clínica A',
        cnpj: '12345678901234',
        whatsappStatus: 'connected',
        leadsCount: 10,
        createdAt: '2024-01-01',
      },
      {
        id: 'clinic-2',
        name: 'Clínica B',
        cnpj: '98765432109876',
        whatsappStatus: 'disconnected',
        leadsCount: 5,
        createdAt: '2024-01-02',
      },
    ],
    '/leads': [
      {
        id: 'lead-1',
        name: 'Lead A',
        email: 'lead-a@test.com',
        phone: '111',
        status: 'OUTREACH',
        clinicId: 'clinic-1',
        createdAt: '2024-01-01',
      },
      {
        id: 'lead-2',
        name: 'Lead B',
        email: 'lead-b@test.com',
        phone: '222',
        status: 'CLOSURE',
        clinicId: 'clinic-2',
        createdAt: '2024-01-02',
      },
    ],
    '/leads/lead-1': {
      id: 'lead-1',
      name: 'Lead A',
      email: 'lead-a@test.com',
      phone: '111',
      status: 'OUTREACH',
      clinicId: 'clinic-1',
      createdAt: '2024-01-01',
    },
    '/clinics/clinic-1': {
      id: 'clinic-1',
      name: 'Clínica A',
      cnpj: '12345678901234',
      whatsappStatus: 'connected',
      leadsCount: 10,
      createdAt: '2024-01-01',
    },
  };

  const response = mockData[url];
  if (response) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(response),
      data: response,
      status: 200,
    });
  }

  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    data: {},
    status: 200,
  });
});

(global as { fetch: jest.Mock }).fetch = mockFetch;
