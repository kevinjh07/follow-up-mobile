import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, Searchbar, Chip, FAB } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { fetchLeads } from '@features/leads/api/leads.api';
import { useClinicStore } from '@features/clinics/stores/clinicStore';
import { useLeadStore } from '@features/leads/stores/leadStore';
import type { Lead } from '@features/leads/api/leads.api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainTabsParamList } from '@navigation/types';

type NavigationProp = NativeStackNavigationProp<MainTabsParamList, 'Leads'>;

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

const ALL_STATUSES = ['OUTREACH', 'TESTIMONIAL', 'CLOSURE', 'FINALIZED'];

function LeadsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { activeClinic } = useClinicStore();
  const { setSelectedLead } = useLeadStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([]);

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

      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(lead.status);

      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, selectedStatuses]);

  const showEmptyState = isLoading || error || filteredLeads.length === 0;

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
    );
  };

  const handleLeadPress = (lead: Lead) => {
    setSelectedLead(lead);
    navigation.navigate('LeadDetail');
  };

  const handleAddLead = () => {
    setSelectedLead(null);
    navigation.navigate('LeadForm');
  };

  const renderItem = ({ item }: { item: Lead }) => (
    <Card style={styles.card} onPress={() => handleLeadPress(item)}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <View
            style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] || '#999' }]}
          >
            <Text style={styles.statusText}>{STATUS_LABELS[item.status] || item.status}</Text>
          </View>
        </View>
        <Text style={styles.contact}>{item.email}</Text>
        <Text style={styles.contact}>{item.phone}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar por nome, e-mail ou telefone"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={ALL_STATUSES}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
          renderItem={({ item }) => (
            <Chip
              mode={selectedStatuses.includes(item) ? 'flat' : 'outlined'}
              selected={selectedStatuses.includes(item)}
              onPress={() => toggleStatus(item)}
              style={[
                styles.filterChip,
                selectedStatuses.includes(item) && {
                  backgroundColor: STATUS_COLORS[item],
                },
              ]}
              textStyle={
                selectedStatuses.includes(item)
                  ? styles.filterChipTextSelected
                  : { color: STATUS_COLORS[item] }
              }
            >
              {STATUS_LABELS[item]}
            </Chip>
          )}
        />
      </View>

      <FlatList
        data={filteredLeads}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        contentContainerStyle={showEmptyState ? styles.center : undefined}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>
              {searchQuery || selectedStatuses.length > 0
                ? 'Nenhum lead encontrado'
                : 'Nenhum lead cadastrado'}
            </Text>
          </View>
        }
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAddLead}
        accessibilityRole="button"
        accessibilityLabel="Adicionar lead"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: { margin: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: 'bold', flex: 1 },
  contact: { fontSize: 13, color: '#666', marginTop: 2 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
  searchbar: { margin: 8 },
  filtersContainer: { marginHorizontal: 8, marginBottom: 8 },
  filtersList: { gap: 8 },
  filterChip: { marginRight: 4 },
  filterChipTextSelected: { color: '#fff' },
});

export { LeadsScreen };
