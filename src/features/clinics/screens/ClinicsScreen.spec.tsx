import React from 'react';
import { render, screen } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import { ClinicsScreen } from './ClinicsScreen';
import { useQuery } from '@tanstack/react-query';

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
}));

jest.mock('@features/clinics/api/clinics.api', () => ({
  fetchClinics: jest.fn(),
}));

describe('ClinicsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    });

    render(<ClinicsScreen />);

    expect(screen.getByText(/carregando/i)).toBeTruthy();
  });

  it('should render error state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: 'Erro' },
      refetch: jest.fn(),
    });

    render(<ClinicsScreen />);

    expect(screen.getByText(/erro ao carregar/i)).toBeTruthy();
  });

  it('should render empty state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<ClinicsScreen />);

    expect(screen.getByText(/nenhuma clínica/i)).toBeTruthy();
  });

  it('should render clinics list', async () => {
    const mockClinics = [
      { id: '1', name: 'Clínica A', whatsappStatus: 'connected' as const, leadsCount: 10 },
      { id: '2', name: 'Clínica B', whatsappStatus: 'disconnected' as const, leadsCount: 5 },
    ];
    (useQuery as jest.Mock).mockReturnValue({
      data: mockClinics,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<ClinicsScreen />);

    expect(screen.getByText('Clínica A')).toBeTruthy();
    expect(screen.getByText('Clínica B')).toBeTruthy();
    expect(screen.getByText('10 leads')).toBeTruthy();
    expect(screen.getByText('5 leads')).toBeTruthy();
  });

  it('should show whatsapp status badge', () => {
    const mockClinics = [
      { id: '1', name: 'Clínica A', whatsappStatus: 'connected' as const, leadsCount: 0 },
    ];
    (useQuery as jest.Mock).mockReturnValue({
      data: mockClinics,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<ClinicsScreen />);

    expect(screen.getByText(/conectado/i)).toBeTruthy();
  });

  it('should call fetchClinics on pull-to-refresh', async () => {
    const mockRefetch = jest.fn();
    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<ClinicsScreen />);

    const flatList = screen.getByTestId('clinics-list');
    flatList.props.onRefresh();
    expect(mockRefetch).toHaveBeenCalled();
  });
});
