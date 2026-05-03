import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import { ClinicDetailScreen } from './ClinicDetailScreen';
import { useQuery, useMutation } from '@tanstack/react-query';

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

jest.mock('@features/clinics/api/clinics.api', () => ({
  fetchClinic: jest.fn(),
  updateClinic: jest.fn(),
}));

jest.mock('@features/clinics/stores/clinicStore', () => ({
  useClinicStore: jest.fn((selector?: (state: unknown) => unknown) => {
    const state = { activeClinic: { id: '1', name: 'Clinica A' } };
    return selector ? selector(state) : state;
  }),
}));

describe('ClinicDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render clinic details', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: { id: '1', name: 'Clinica A', cnpj: '12345678901234', whatsappStatus: 'connected' },
      isLoading: false,
      error: null,
    });
    (useMutation as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });

    render(<ClinicDetailScreen />);

    expect(screen.getByText('Clinica A')).toBeTruthy();
    expect(screen.getByText('12.345.678/9012-34')).toBeTruthy();
  });

  it('should render loading state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<ClinicDetailScreen />);

    expect(screen.getByText(/carregando/i)).toBeTruthy();
  });

  it('should render error state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: 'Erro' },
    });

    render(<ClinicDetailScreen />);

    expect(screen.getByText(/erro ao carregar/i)).toBeTruthy();
  });

  it('should show edit form when edit button pressed', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: { id: '1', name: 'Clinica A', cnpj: '12345678901234' },
      isLoading: false,
      error: null,
    });
    (useMutation as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });

    render(<ClinicDetailScreen />);

    fireEvent.press(screen.getByLabelText(/editar/i));
    expect(screen.getByText(/salvar/i)).toBeTruthy();
  });

  it('should call updateClinic on form submit', async () => {
    const mockMutate = jest.fn();
    (useQuery as jest.Mock).mockReturnValue({
      data: { id: '1', name: 'Clinica A', cnpj: '12345678901234' },
      isLoading: false,
      error: null,
    });
    (useMutation as jest.Mock).mockReturnValue({ mutate: mockMutate, isPending: false });

    render(<ClinicDetailScreen />);

    fireEvent.press(screen.getByLabelText(/editar/i));
    fireEvent.changeText(screen.getByDisplayValue('Clinica A'), 'Clinica Atualizada');
    fireEvent.press(screen.getByText(/salvar/i));

    expect(mockMutate).toHaveBeenCalled();
  });

  it('should show export button', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: { id: '1', name: 'Clinica A' },
      isLoading: false,
      error: null,
    });

    render(<ClinicDetailScreen />);

    expect(screen.getByLabelText(/exportar leads/i)).toBeTruthy();
  });
});
