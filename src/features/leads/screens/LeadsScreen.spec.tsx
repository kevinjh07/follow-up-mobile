import React from 'react';
import { render, screen } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import { LeadsScreen } from './LeadsScreen';
import { useQuery } from '@tanstack/react-query';

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
}));

jest.mock('@features/leads/api/leads.api', () => ({
  fetchLeads: jest.fn(),
}));

jest.mock('@features/clinics/stores/clinicStore', () => ({
  useClinicStore: () => ({ activeClinic: { id: 'clinic-1', name: 'Clinica Teste' } }),
}));

describe('LeadsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
      isRefetching: false,
    });

    render(<LeadsScreen />);

    expect(screen.getByText(/carregando/i)).toBeTruthy();
  });

  it('should render error state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: 'Erro' },
      refetch: jest.fn(),
      isRefetching: false,
    });

    render(<LeadsScreen />);

    expect(screen.getByText(/erro ao carregar leads/i)).toBeTruthy();
  });

  it('should render empty state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      isRefetching: false,
    });

    render(<LeadsScreen />);

    expect(screen.getByText(/nenhum lead encontrado/i)).toBeTruthy();
  });

  it('should render leads list', () => {
    const mockLeads = [
      { id: '1', name: 'Lead A', status: 'OUTREACH' },
      { id: '2', name: 'Lead B', status: 'CLOSURE' },
    ];
    (useQuery as jest.Mock).mockReturnValue({
      data: mockLeads,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      isRefetching: false,
    });

    render(<LeadsScreen />);

    expect(screen.getByText('Lead A')).toBeTruthy();
    expect(screen.getByText('Lead B')).toBeTruthy();
  });

  it('should render lead status', () => {
    const mockLeads = [{ id: '1', name: 'Lead A', status: 'TESTIMONIAL' }];
    (useQuery as jest.Mock).mockReturnValue({
      data: mockLeads,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      isRefetching: false,
    });

    render(<LeadsScreen />);

    expect(screen.getByText('TESTIMONIAL')).toBeTruthy();
  });

  it('should show FAB for adding lead', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      isRefetching: false,
    });

    render(<LeadsScreen />);

    expect(screen.getByLabelText(/adicionar lead/i)).toBeTruthy();
  });

  it('should call refetch on pull-to-refresh', () => {
    const mockRefetch = jest.fn();
    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: mockRefetch,
      isRefetching: false,
    });

    render(<LeadsScreen />);

    const flatList = screen.getByTestId('leads-list');
    flatList.props.refreshControl.props.onRefresh();
    expect(mockRefetch).toHaveBeenCalled();
  });
});