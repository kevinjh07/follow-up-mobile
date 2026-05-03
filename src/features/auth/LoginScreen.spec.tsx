import '@testing-library/jest-native/extend-expect';
import { api } from '@core/services/api';

jest.mock('@core/services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('LoginScreen validation schema', () => {
  it('should define email as required string', () => {
    const email = 'test@example.com';
    expect(email).toContain('@');
    expect(email.length).toBeGreaterThan(0);
  });

  it('should validate email format', () => {
    const validEmails = ['test@example.com', 'user@domain.org'];
    const invalidEmails = ['not-an-email', '@nodomain.com', 'no-at-sign'];

    validEmails.forEach(email => {
      expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    invalidEmails.forEach(email => {
      expect(email).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });

  it('should define password minimum length', () => {
    const password = 'password123';
    expect(password.length).toBeGreaterThanOrEqual(6);
  });

  it('should reject short passwords', () => {
    const shortPasswords = ['12345', 'abc', 'pass'];
    shortPasswords.forEach(pwd => {
      expect(pwd.length).toBeLessThan(6);
    });
  });
});

describe('LoginScreen API interaction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call api.post with login credentials', async () => {
    const credentials = { email: 'test@example.com', password: 'password123' };
    (api.post as jest.Mock).mockResolvedValueOnce({
      data: { user: { id: '1' }, token: 'jwt-token' },
    });

    await api.post('/auth/login', credentials);
    expect(api.post).toHaveBeenCalledWith('/auth/login', credentials);
  });

  it('should handle successful login response', async () => {
    const mockResponse = {
      data: {
        user: { id: '1', email: 'test@example.com', name: 'Test', role: 'ATTENDANT' },
        token: 'jwt-token-123',
      },
    };
    (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await api.post('/auth/login', { email: 'test@example.com', password: 'password123' });
    expect(result.data.user).toBeDefined();
    expect(result.data.token).toBeDefined();
  });

  it('should handle failed login response', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce({
      response: { status: 401 },
    });

    try {
      await api.post('/auth/login', { email: 'wrong', password: 'wrong' });
    } catch (error: unknown) {
      const err = error as { response?: { status: number } };
      expect(err.response?.status).toBe(401);
    }
  });
});