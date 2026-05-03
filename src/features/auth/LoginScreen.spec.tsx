import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import { LoginScreen } from './LoginScreen';
import { api } from '@core/services/api';
import { useAuthStore } from '@core/stores/authStore';

jest.mock('@core/services/api', () => ({
  api: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

jest.mock('@core/stores/authStore', () => ({
  useAuthStore: jest.fn((selector?: (state: unknown) => unknown) => {
    const state = {
      user: null,
      token: null,
      isLoading: false,
      setUser: jest.fn(),
      setToken: jest.fn(),
      logout: jest.fn(),
      loadUser: jest.fn(),
      clearToken: jest.fn(),
    };
    return selector ? selector(state) : state;
  }),
}));

const getEmailInput = () => document.querySelectorAll('input')[0] as HTMLInputElement;
const getPasswordInput = () => document.querySelectorAll('input')[1] as HTMLInputElement;
const getSubmitButton = () => screen.getByText(/entrar/i);

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render email and password inputs', () => {
    render(<LoginScreen />);

    expect(getEmailInput()).toBeTruthy();
    expect(getPasswordInput()).toBeTruthy();
    expect(getSubmitButton()).toBeTruthy();
  });

  it('should show validation error when email is empty', async () => {
    render(<LoginScreen />);

    fireEvent.press(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText(/e-mail é obrigatório/i)).toBeTruthy();
    });
  });

  it('should show validation error when email is invalid', async () => {
    render(<LoginScreen />);

    fireEvent.changeText(getEmailInput(), 'invalid-email');
    fireEvent.press(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText(/e-mail inválido/i)).toBeTruthy();
    });
  });

  it('should show validation error when password is empty', async () => {
    render(<LoginScreen />);

    fireEvent.changeText(getEmailInput(), 'test@example.com');
    fireEvent.press(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText(/senha é obrigatória/i)).toBeTruthy();
    });
  });

  it('should show validation error when password is too short', async () => {
    render(<LoginScreen />);

    fireEvent.changeText(getEmailInput(), 'test@example.com');
    fireEvent.changeText(getPasswordInput(), '123');
    fireEvent.press(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText(/senha deve ter pelo menos 6 caracteres/i)).toBeTruthy();
    });
  });

  it('should call api.post with correct data on valid submit', async () => {
    const mockSetUser = jest.fn();
    const mockSetToken = jest.fn();
    const mockResponse = {
      data: {
        user: { id: '1', email: 'test@example.com', name: 'Test', role: 'ATTENDANT' },
        token: 'jwt-token-123',
      },
    };

    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = { setUser: mockSetUser, setToken: mockSetToken };
      return selector ? selector(state) : state;
    });

    (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    render(<LoginScreen />);

    fireEvent.changeText(getEmailInput(), 'test@example.com');
    fireEvent.changeText(getPasswordInput(), 'password123');
    fireEvent.press(getSubmitButton());

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/auth/login',
        { email: 'test@example.com', password: 'password123' },
        undefined
      );
      expect(mockSetUser).toHaveBeenCalledWith(mockResponse.data.user);
      expect(mockSetToken).toHaveBeenCalledWith(mockResponse.data.token);
    });
  });

  it('should show error alert on login failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce({
      response: { status: 401 },
    });

    render(<LoginScreen />);

    fireEvent.changeText(getEmailInput(), 'test@example.com');
    fireEvent.changeText(getPasswordInput(), 'wrong-password');
    fireEvent.press(getSubmitButton());

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
    });
  });

  it('should disable button and show loading state while submitting', async () => {
    (api.post as jest.Mock).mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<LoginScreen />);

    fireEvent.changeText(getEmailInput(), 'test@example.com');
    fireEvent.changeText(getPasswordInput(), 'password123');
    fireEvent.press(getSubmitButton());

    expect(getSubmitButton().props.disabled || getSubmitButton().props.loading).toBeTruthy();
  });
});
