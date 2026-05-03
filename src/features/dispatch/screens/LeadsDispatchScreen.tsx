import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchLeads } from '@features/leads/api/leads.api';
import { useClinicStore } from '@features/clinics/stores/clinicStore';
import { useSelectionStore } from '@features/dispatch/stores/dispatchStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Lead } from '@features/leads/api/leads.api';
import type { MainTabsParamList } from '@navigation/types';
import { LeadsListView } from './LeadsListView';

type NavigationProp = NativeStackNavigationProp<MainTabsParamList, 'Leads'>;

export function LeadsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { activeClinic } = useClinicStore();
  const { selectedLeads, isSelectionMode, toggleLead, clearSelection } = useSelectionStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const {
    data: leads,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['leads', activeClinic?.id],
    queryFn: () => fetchLeads(activeClinic!.id),
    enabled: !!activeClinic?.id,
  });

  const filteredLeads = React.useMemo(() => {
    if (!leads) return [];
    return leads.filter((lead) => {
      const matchesSearch =
        !searchQuery.trim() ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery);

      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(lead.status);

      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, selectedStatuses]);

  const handleToggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const handleLeadPress = (lead: Lead) => {
    if (isSelectionMode) {
      toggleLead(lead.id);
    } else {
      navigation.navigate('LeadDetail');
    }
  };

  const handleLeadLongPress = (lead: Lead) => {
    toggleLead(lead.id);
  };

  const handleAddLead = () => {
    clearSelection();
    navigation.navigate('LeadForm');
  };

  const handleDispatch = () => {
    if (selectedLeads.size === 0) return;
    navigation.navigate('DispatchConfirm');
  };

  const handleCancelSelection = () => {
    clearSelection();
  };

  return (
    <LeadsListView
      leads={leads || []}
      filteredLeads={filteredLeads}
      isLoading={isLoading}
      isRefetching={isRefetching}
      error={error}
      searchQuery={searchQuery}
      selectedStatuses={selectedStatuses}
      selectedLeads={selectedLeads}
      isSelectionMode={isSelectionMode}
      onSearchChange={setSearchQuery}
      onToggleStatus={handleToggleStatus}
      onLeadPress={handleLeadPress}
      onLeadLongPress={handleLeadLongPress}
      onToggleLead={toggleLead}
      onRefresh={refetch}
      onAddLead={handleAddLead}
      onCancelSelection={handleCancelSelection}
      onDispatch={handleDispatch}
    />
  );
}