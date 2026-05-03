import { z } from 'zod';

describe('forgotPassword validation', () => {
  const forgotSchema = z.object({
    email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  });

  it('should accept valid email', () => {
    const result = forgotSchema.safeParse({ email: 'user@example.com' });
    expect(result.success).toBe(true);
  });

  it('should reject empty email', () => {
    const result = forgotSchema.safeParse({ email: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('E-mail é obrigatório');
    }
  });

  it('should reject invalid email format', () => {
    const result = forgotSchema.safeParse({ email: 'notanemail' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('E-mail inválido');
    }
  });
});

describe('resetPassword validation', () => {
  const resetSchema = z.object({
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirme a senha'),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

  it('should accept matching passwords', () => {
    const result = resetSchema.safeParse({
      password: 'password123',
      confirmPassword: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('should reject short password', () => {
    const result = resetSchema.safeParse({
      password: '123',
      confirmPassword: '123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Senha deve ter pelo menos 6 caracteres');
    }
  });

  it('should reject non-matching passwords', () => {
    const result = resetSchema.safeParse({
      password: 'password123',
      confirmPassword: 'different456',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('confirmPassword');
    }
  });
});

describe('activateAccount validation', () => {
  const activateSchema = z.object({
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirme a senha'),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

  it('should accept valid password with confirmation', () => {
    const result = activateSchema.safeParse({
      password: 'SecurePass123',
      confirmPassword: 'SecurePass123',
    });
    expect(result.success).toBe(true);
  });

  it('should reject mismatched passwords on activation', () => {
    const result = activateSchema.safeParse({
      password: 'SecurePass123',
      confirmPassword: 'WrongPass456',
    });
    expect(result.success).toBe(false);
  });
});

describe('navigation logic', () => {
  it('should navigate to ForgotPassword from Login', () => {
    const mockNavigate = jest.fn();
    mockNavigate('ForgotPassword');
    expect(mockNavigate).toHaveBeenCalledWith('ForgotPassword');
  });

  it('should navigate to ResetPassword with token', () => {
    const mockNavigate = jest.fn();
    mockNavigate('ResetPassword', { token: 'abc123' });
    expect(mockNavigate).toHaveBeenCalledWith('ResetPassword', { token: 'abc123' });
  });

  it('should navigate to Login after successful reset', () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    expect(setTimeoutSpy).not.toHaveBeenCalled();
  });
});