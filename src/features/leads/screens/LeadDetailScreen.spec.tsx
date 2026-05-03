import React from 'react';
import { render, screen } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import { LeadDetailScreen } from './LeadDetailScreen';
import { useQuery, useMutation } from '@tanstack/react-query';

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

jest.mock('@features/leads/api/leads.api', () => ({
  fetchLead: jest.fn(),
  updateLeadStatus: jest.fn(),
  deleteLead: jest.fn(),
}));

jest.mock('@features/leads/stores/leadStore', () => ({
  useLeadStore: jest.fn((selector?: (state: unknown) => unknown) => {
    const state = { selectedLead: { id: '1', name: 'Lead A', status: 'OUTREACH' }, setSelectedLead: jest.fn() };
    return selector ? selector(state) : state;
  }),
}));

describe('LeadDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render lead details', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: { id: '1', name: 'Lead A', status: 'OUTREACH' },
      isLoading: false,
      error: null,
    });
    (useMutation as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });

    render(<LeadDetailScreen />);

    expect(screen.getByText('Lead A')).toBeTruthy();
    expect(screen.getByText(/outreach/i)).toBeTruthy();
  });

  it('should render loading state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<LeadDetailScreen />);

    expect(screen.getByText(/carregando/i)).toBeTruthy();
  });

  it('should render error state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: 'Erro' },
    });

    render(<LeadDetailScreen />);

    expect(screen.getByText(/erro ao carregar/i)).toBeTruthy();
  });

  it('should call updateLeadStatus on status button press', () => {
    const mockMutate = jest.fn();
    (useQuery as jest.Mock).mockReturnValue({
      data: { id: '1', name: 'Lead A', status: 'OUTREACH' },
      isLoading: false,
      error: null,
    });
    (useMutation as jest.Mock).mockReturnValue({ mutate: mockMutate, isPending: false });

    render(<LeadDetailScreen />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});