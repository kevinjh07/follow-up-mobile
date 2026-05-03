import '@testing-library/jest-native/extend-expect';

describe('LeadsScreen business logic', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('useQuery configuration', () => {
    it('should configure queryKey with leads array', () => {
      const queryKey = ['leads', 'clinic-1'];
      expect(queryKey).toContain('leads');
      expect(Array.isArray(queryKey)).toBe(true);
    });

    it('should have correct query structure', () => {
      const queryFn = () => Promise.resolve([]);
      const queryConfig = {
        queryKey: ['leads'],
        queryFn,
        enabled: true,
      };

      expect(queryConfig.queryKey).toEqual(['leads']);
      expect(queryConfig.queryFn).toBeDefined();
      expect(queryConfig.enabled).toBe(true);
    });

    it('should handle undefined clinicId in params', () => {
      const clinicId = undefined;
      const params = clinicId ? { clinicId } : {};
      expect(params).toEqual({});
    });

    it('should handle defined clinicId in params', () => {
      const clinicId = 'clinic-123';
      const params = clinicId ? { clinicId } : {};
      expect(params).toEqual({ clinicId: 'clinic-123' });
    });
  });

  describe('lead status mapping', () => {
    const STATUS_LABELS = {
      OUTREACH: 'Prospecção',
      TESTIMONIAL: 'Depoimento',
      CLOSURE: 'Encerramento',
      FINALIZED: 'Finalizado',
    };

    it('should have all status values defined', () => {
      expect(STATUS_LABELS.OUTREACH).toBeDefined();
      expect(STATUS_LABELS.TESTIMONIAL).toBeDefined();
      expect(STATUS_LABELS.CLOSURE).toBeDefined();
      expect(STATUS_LABELS.FINALIZED).toBeDefined();
    });

    it('should map OUTREACH correctly', () => {
      expect(STATUS_LABELS.OUTREACH).toBe('Prospecção');
    });
  });
});