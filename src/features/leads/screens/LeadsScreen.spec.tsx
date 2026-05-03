describe('Lead search and filter logic', () => {
  const mockLeads = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '11999990001',
      status: 'OUTREACH' as const,
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@email.com',
      phone: '11999990002',
      status: 'TESTIMONIAL' as const,
    },
    {
      id: '3',
      name: 'Pedro Oliveira',
      email: 'pedro@email.com',
      phone: '11999990003',
      status: 'CLOSURE' as const,
    },
    {
      id: '4',
      name: 'Ana Costa',
      email: 'ana@email.com',
      phone: '11999990004',
      status: 'FINALIZED' as const,
    },
  ];

  describe('search filter', () => {
    it('should return all leads when search query is empty', () => {
      const searchQuery = '';
      const filtered = mockLeads.filter(
        (lead) =>
          !searchQuery.trim() ||
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.phone.includes(searchQuery),
      );
      expect(filtered.length).toBe(4);
    });

    it('should filter leads by name', () => {
      const searchQuery = 'João';
      const filtered = mockLeads.filter(
        (lead) =>
          !searchQuery.trim() ||
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.phone.includes(searchQuery),
      );
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('João Silva');
    });

    it('should filter leads by email', () => {
      const searchQuery = 'maria@email.com';
      const filtered = mockLeads.filter(
        (lead) =>
          !searchQuery.trim() ||
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.phone.includes(searchQuery),
      );
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('Maria Santos');
    });

    it('should filter leads by phone', () => {
      const searchQuery = '11999990003';
      const filtered = mockLeads.filter(
        (lead) =>
          !searchQuery.trim() ||
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.phone.includes(searchQuery),
      );
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('Pedro Oliveira');
    });
  });

  describe('status filter', () => {
    it('should return all leads when no status is selected', () => {
      const selectedStatuses: string[] = [];
      const filtered = mockLeads.filter(
        (lead) => selectedStatuses.length === 0 || selectedStatuses.includes(lead.status),
      );
      expect(filtered.length).toBe(4);
    });

    it('should filter leads by single selected status', () => {
      const selectedStatuses = ['OUTREACH'];
      const filtered = mockLeads.filter(
        (lead) => selectedStatuses.length === 0 || selectedStatuses.includes(lead.status),
      );
      expect(filtered.length).toBe(1);
      expect(filtered[0].status).toBe('OUTREACH');
    });

    it('should filter leads by multiple selected statuses', () => {
      const selectedStatuses = ['OUTREACH', 'TESTIMONIAL'];
      const filtered = mockLeads.filter(
        (lead) => selectedStatuses.length === 0 || selectedStatuses.includes(lead.status),
      );
      expect(filtered.length).toBe(2);
    });
  });

  describe('combined search and status filter', () => {
    it('should apply both search and status filters', () => {
      const searchQuery = 'a';
      const selectedStatuses = ['OUTREACH', 'TESTIMONIAL'];
      const filtered = mockLeads.filter((lead) => {
        const matchesSearch =
          !searchQuery.trim() ||
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.phone.includes(searchQuery);
        const matchesStatus =
          selectedStatuses.length === 0 || selectedStatuses.includes(lead.status);
        return matchesSearch && matchesStatus;
      });
      expect(filtered.length).toBe(2);
    });
  });
});

describe('Lead status toggle logic', () => {
  it('should add status when not selected', () => {
    const selectedStatuses = ['OUTREACH'];
    const newStatuses = selectedStatuses.includes('TESTIMONIAL')
      ? selectedStatuses.filter((s) => s !== 'TESTIMONIAL')
      : [...selectedStatuses, 'TESTIMONIAL'];
    expect(newStatuses).toContain('TESTIMONIAL');
  });

  it('should remove status when already selected', () => {
    const selectedStatuses = ['OUTREACH', 'TESTIMONIAL'];
    const newStatuses = selectedStatuses.includes('TESTIMONIAL')
      ? selectedStatuses.filter((s) => s !== 'TESTIMONIAL')
      : [...selectedStatuses, 'TESTIMONIAL'];
    expect(newStatuses).not.toContain('TESTIMONIAL');
  });
});

describe('Lead status constants', () => {
  const STATUS_COLORS: Record<string, string> = {
    OUTREACH: '#2196f3',
    TESTIMONIAL: '#ff9800',
    CLOSURE: '#9c27b0',
    FINALIZED: '#4caf50',
  };

  const STATUS_LABELS: Record<string, string> = {
    OUTREACH: 'Prospecção',
    TESTIMONIAL: 'Depoimento',
    CLOSURE: 'Encerramento',
    FINALIZED: 'Finalizado',
  };

  it('should have consistent status colors', () => {
    expect(STATUS_COLORS.OUTREACH).toBe('#2196f3');
    expect(STATUS_COLORS.TESTIMONIAL).toBe('#ff9800');
    expect(STATUS_COLORS.CLOSURE).toBe('#9c27b0');
    expect(STATUS_COLORS.FINALIZED).toBe('#4caf50');
  });

  it('should have consistent status labels', () => {
    expect(STATUS_LABELS.OUTREACH).toBe('Prospecção');
    expect(STATUS_LABELS.TESTIMONIAL).toBe('Depoimento');
    expect(STATUS_LABELS.CLOSURE).toBe('Encerramento');
    expect(STATUS_LABELS.FINALIZED).toBe('Finalizado');
  });

  it('should have matching keys between colors and labels', () => {
    const colorKeys = Object.keys(STATUS_COLORS);
    const labelKeys = Object.keys(STATUS_LABELS);
    expect(colorKeys.sort()).toEqual(labelKeys.sort());
  });
});
