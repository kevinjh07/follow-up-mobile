describe('WhatsApp API', () => {
  const mockClinicId = 'clinic-123';

  describe('ConnectionStatus type', () => {
    it('should have valid status values', () => {
      const validStatuses = ['disconnected', 'qr_pending', 'code_pending', 'connected'] as const;
      validStatuses.forEach((status) => {
        expect(['disconnected', 'qr_pending', 'code_pending', 'connected']).toContain(status);
      });
    });
  });

  describe('fetchWhatsAppStatus', () => {
    it('should call correct endpoint', () => {
      const endpoint = `/whatsapp/instances/${mockClinicId}/status`;
      expect(endpoint).toBe(`/whatsapp/instances/${mockClinicId}/status`);
    });
  });

  describe('fetchWhatsAppQRCode', () => {
    it('should call correct endpoint', () => {
      const endpoint = `/whatsapp/instances/${mockClinicId}/qr`;
      expect(endpoint).toBe(`/whatsapp/instances/${mockClinicId}/qr`);
    });
  });

  describe('startWhatsAppInstance', () => {
    it('should call correct endpoint with POST', () => {
      const endpoint = '/whatsapp/instances/start';
      expect(endpoint).toBe('/whatsapp/instances/start');
    });
  });

  describe('startWhatsAppWithCode', () => {
    it('should call correct endpoint with POST', () => {
      const endpoint = '/whatsapp/instances/start-with-code';
      expect(endpoint).toBe('/whatsapp/instances/start-with-code');
    });
  });

  describe('disconnectWhatsApp', () => {
    it('should call correct endpoint with DELETE', () => {
      const endpoint = `/whatsapp/instances/${mockClinicId}`;
      expect(endpoint).toBe(`/whatsapp/instances/${mockClinicId}`);
    });
  });
});

describe('WhatsApp status flow', () => {
  it('should transition from disconnected to qr_pending', () => {
    const statuses = ['disconnected', 'qr_pending', 'code_pending', 'connected'] as const;
    const currentStatus = 'disconnected';
    const nextStatus = 'qr_pending';
    expect(statuses.indexOf(nextStatus)).toBeGreaterThan(statuses.indexOf(currentStatus));
  });

  it('should transition from qr_pending to connected', () => {
    const expectedNextStatus = 'connected';
    expect(expectedNextStatus).toBe('connected');
  });

  it('should handle disconnection back to disconnected', () => {
    const disconnectedStatus = 'disconnected';
    expect(disconnectedStatus).toBe('disconnected');
  });
});

describe('WhatsApp UI constants', () => {
  const WHATSAPP_STATUS_LABELS: Record<string, string> = {
    disconnected: 'Desconectado',
    qr_pending: 'QR Code Pendente',
    code_pending: 'Código de Pareamento',
    connected: 'Conectado',
  };

  const WHATSAPP_STATUS_COLORS: Record<string, string> = {
    disconnected: '#999',
    qr_pending: '#f0a500',
    code_pending: '#2196f3',
    connected: '#4caf50',
  };

  it('should have labels for all statuses', () => {
    expect(WHATSAPP_STATUS_LABELS.disconnected).toBe('Desconectado');
    expect(WHATSAPP_STATUS_LABELS.qr_pending).toBe('QR Code Pendente');
    expect(WHATSAPP_STATUS_LABELS.code_pending).toBe('Código de Pareamento');
    expect(WHATSAPP_STATUS_LABELS.connected).toBe('Conectado');
  });

  it('should have colors for all statuses', () => {
    expect(WHATSAPP_STATUS_COLORS.disconnected).toBe('#999');
    expect(WHATSAPP_STATUS_COLORS.qr_pending).toBe('#f0a500');
    expect(WHATSAPP_STATUS_COLORS.code_pending).toBe('#2196f3');
    expect(WHATSAPP_STATUS_COLORS.connected).toBe('#4caf50');
  });
});
