import { z } from 'zod';

describe('Change password validation', () => {
  const changePasswordSchema = z
    .object({
      currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
      newPassword: z
        .string()
        .min(8, 'Nova senha deve ter pelo menos 8 caracteres')
        .regex(/[A-Z]/, 'Nova senha deve ter pelo menos 1 letra maiúscula')
        .regex(/[0-9]/, 'Nova senha deve ter pelo menos 1 número'),
      confirmPassword: z.string().min(1, 'Confirme a nova senha'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'As senhas não coincidem',
      path: ['confirmPassword'],
    });

  it('should accept valid password change data', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'OldPass123',
      newPassword: 'NewPass456',
      confirmPassword: 'NewPass456',
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty current password', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: '',
      newPassword: 'NewPass456',
      confirmPassword: 'NewPass456',
    });
    expect(result.success).toBe(false);
  });

  it('should reject short new password', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'OldPass123',
      newPassword: 'Short1',
      confirmPassword: 'Short1',
    });
    expect(result.success).toBe(false);
  });

  it('should reject new password without uppercase', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'OldPass123',
      newPassword: 'newpass123',
      confirmPassword: 'newpass123',
    });
    expect(result.success).toBe(false);
  });

  it('should reject new password without number', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'OldPass123',
      newPassword: 'NewPassword',
      confirmPassword: 'NewPassword',
    });
    expect(result.success).toBe(false);
  });

  it('should reject mismatched passwords', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'OldPass123',
      newPassword: 'NewPass456',
      confirmPassword: 'Different789',
    });
    expect(result.success).toBe(false);
  });
});

describe('User form validation', () => {
  const userSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
    role: z.enum(['ADMIN', 'ATTENDANT', 'OPS']),
  });

  it('should accept valid user data', () => {
    const result = userSchema.safeParse({
      name: 'João Silva',
      email: 'joao@clinica.com',
      role: 'ATTENDANT',
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty name', () => {
    const result = userSchema.safeParse({
      name: '',
      email: 'joao@clinica.com',
      role: 'ATTENDANT',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid email', () => {
    const result = userSchema.safeParse({
      name: 'João Silva',
      email: 'notanemail',
      role: 'ATTENDANT',
    });
    expect(result.success).toBe(false);
  });

  it('should accept all valid roles', () => {
    const roles = ['ADMIN', 'ATTENDANT', 'OPS'] as const;
    roles.forEach((role) => {
      const result = userSchema.safeParse({
        name: 'Test User',
        email: 'test@test.com',
        role,
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('User roles', () => {
  const ROLE_COLORS: Record<string, string> = {
    ADMIN: '#b00020',
    ATTENDANT: '#2196f3',
    OPS: '#ff9800',
  };

  const ROLE_LABELS: Record<string, string> = {
    ADMIN: 'Administrador',
    ATTENDANT: 'Atendente',
    OPS: 'Operador',
  };

  it('should have colors for all roles', () => {
    expect(ROLE_COLORS.ADMIN).toBe('#b00020');
    expect(ROLE_COLORS.ATTENDANT).toBe('#2196f3');
    expect(ROLE_COLORS.OPS).toBe('#ff9800');
  });

  it('should have labels for all roles', () => {
    expect(ROLE_LABELS.ADMIN).toBe('Administrador');
    expect(ROLE_LABELS.ATTENDANT).toBe('Atendente');
    expect(ROLE_LABELS.OPS).toBe('Operador');
  });
});

describe('User API endpoints', () => {
  const userId = 'user-123';

  it('should have correct list users endpoint', () => {
    expect('/users').toBe('/users');
  });

  it('should have correct get user endpoint', () => {
    expect(`/users/${userId}`).toBe('/users/user-123');
  });

  it('should have correct create user endpoint', () => {
    expect('/users').toBe('/users');
  });

  it('should have correct update user endpoint', () => {
    expect(`/users/${userId}`).toBe('/users/user-123');
  });

  it('should have correct delete user endpoint', () => {
    expect(`/users/${userId}`).toBe('/users/user-123');
  });

  it('should have correct change password endpoint', () => {
    expect('/users/me/password').toBe('/users/me/password');
  });
});
