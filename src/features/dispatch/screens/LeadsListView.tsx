import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, Searchbar, Chip, FAB, Checkbox, Appbar } from 'react-native-paper';
import type { Lead } from '@features/leads/api/leads.api';

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

export interface LeadsListViewProps {
  leads: Lead[];
  filteredLeads: Lead[];
  isLoading: boolean;
  isRefetching: boolean;
  error: unknown;
  searchQuery: string;
  selectedStatuses: string[];
  selectedLeads: Set<string>;
  isSelectionMode: boolean;
  onSearchChange: (query: string) => void;
  onToggleStatus: (status: string) => void;
  onLeadPress: (lead: Lead) => void;
  onLeadLongPress: (lead: Lead) => void;
  onToggleLead: (leadId: string) => void;
  onRefresh: () => void;
  onAddLead: () => void;
  onCancelSelection: () => void;
  onDispatch: () => void;
}

export function LeadsListView({
  filteredLeads,
  isLoading,
  isRefetching,
  error,
  searchQuery,
  selectedStatuses,
  selectedLeads,
  isSelectionMode,
  onSearchChange,
  onToggleStatus,
  onLeadPress,
  onLeadLongPress,
  onToggleLead,
  onRefresh,
  onAddLead,
  onCancelSelection,
  onDispatch,
}: LeadsListViewProps) {
  const renderItem = ({ item }: { item: Lead }) => {
    const isSelected = selectedLeads.has(item.id);

    return (
      <Card
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => onLeadPress(item)}
        onLongPress={() => onLeadLongPress(item)}
      >
        <Card.Content style={styles.cardContent}>
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={isSelected ? 'checked' : 'unchecked'}
              onPress={() => onToggleLead(item.id)}
            />
          </View>
          <View style={styles.cardBody}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] }]}>
                <Text style={styles.statusText}>{STATUS_LABELS[item.status]}</Text>
              </View>
            </View>
            <Text style={styles.contact}>{item.email}</Text>
            <Text style={styles.contact}>{item.phone}</Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const showEmptyState = isLoading || error || filteredLeads.length === 0;

  return (
    <View style={styles.container}>
      <Appbar.Header>
        {isSelectionMode ? (
          <>
            <Appbar.Action icon="close" onPress={onCancelSelection} />
            <Appbar.Content title={`${selectedLeads.size} selecionados`} />
            <Appbar.Action icon="send" onPress={onDispatch} disabled={selectedLeads.size === 0} />
          </>
        ) : (
          <Appbar.Content title="Leads" />
        )}
      </Appbar.Header>

      <Searchbar
        placeholder="Buscar por nome, e-mail ou telefone"
        onChangeText={onSearchChange}
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
              onPress={() => onToggleStatus(item)}
              style={[
                styles.filterChip,
                selectedStatuses.includes(item) && { backgroundColor: STATUS_COLORS[item] },
              ]}
              textStyle={
                selectedStatuses.includes(item)
                  ? styles.chipTextSelected
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
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />}
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

      {!isSelectionMode && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={onAddLead}
          accessibilityLabel="Adicionar lead"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { margin: 8 },
  cardSelected: { borderColor: '#6200ee', borderWidth: 2 },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  checkboxContainer: { marginRight: 8 },
  cardBody: { flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: 'bold', flex: 1 },
  contact: { fontSize: 13, color: '#666', marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
  searchbar: { margin: 8 },
  filtersContainer: { marginHorizontal: 8, marginBottom: 8 },
  filtersList: { gap: 8 },
  filterChip: { marginRight: 4 },
  chipTextSelected: { color: '#fff' },
});
