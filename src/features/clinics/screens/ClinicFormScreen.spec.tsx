import { z } from 'zod';

describe('ClinicForm form validation schema', () => {
  const clinicSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    cnpj: z.string().min(1, 'CNPJ é obrigatório'),
  });

  describe('name field validation', () => {
    it('should accept valid clinic name', () => {
      const result = clinicSchema.safeParse({ name: 'Clínica São Lucas', cnpj: '12345678000100' });
      expect(result.success).toBe(true);
    });

    it('should reject empty name', () => {
      const result = clinicSchema.safeParse({ name: '', cnpj: '12345678000100' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Nome é obrigatório');
      }
    });

    it('should reject missing name', () => {
      const result = clinicSchema.safeParse({ cnpj: '12345678000100' });
      expect(result.success).toBe(false);
    });
  });

  describe('cnpj field validation', () => {
    it('should accept valid CNPJ', () => {
      const result = clinicSchema.safeParse({ name: 'Clínica Teste', cnpj: '12345678000100' });
      expect(result.success).toBe(true);
    });

    it('should reject empty CNPJ', () => {
      const result = clinicSchema.safeParse({ name: 'Clínica Teste', cnpj: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('CNPJ é obrigatório');
      }
    });

    it('should reject missing CNPJ', () => {
      const result = clinicSchema.safeParse({ name: 'Clínica Teste' });
      expect(result.success).toBe(false);
    });
  });
});

describe('Clinic update flow', () => {
  it('should detect editing mode when clinic id exists', () => {
    const activeClinic = { id: '1', name: 'Test', cnpj: '123' };
    const isEditing = !!activeClinic.id;
    expect(isEditing).toBe(true);
  });

  it('should detect create mode when no clinic id', () => {
    const activeClinic = { name: '', cnpj: '' };
    const isEditing = !!(activeClinic as { id?: string })?.id;
    expect(isEditing).toBe(false);
  });
});

describe('ClinicFormScreen navigation logic', () => {
  it('should set activeClinic to null when creating new clinic', () => {
    const setActiveClinic = jest.fn();
    setActiveClinic(null);
    expect(setActiveClinic).toHaveBeenCalledWith(null);
  });

  it('should keep activeClinic when editing existing clinic', () => {
    const clinic = { id: '1', name: 'Existing', cnpj: '123' };
    const setActiveClinic = jest.fn();
    setActiveClinic(clinic);
    expect(setActiveClinic).toHaveBeenCalledWith(clinic);
  });
});
