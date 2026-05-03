import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, List, FAB, Searchbar } from 'react-native-paper';
import type { Clinic } from '@features/clinics/api/clinics.api';

const WHATSAPP_STATUS_COLORS: Record<string, string> = {
  disconnected: '#999',
  qr_pending: '#f0a500',
  code_pending: '#2196f3',
  connected: '#4caf50',
};

export interface ClinicsListViewProps {
  clinics: Clinic[];
  isLoading: boolean;
  isRefetching: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClinicPress: (clinic: Clinic) => void;
  onAddClinic: () => void;
  onRefresh: () => void;
}

export function ClinicsListView({
  clinics,
  isRefetching,
  searchQuery,
  onSearchChange,
  onClinicPress,
  onAddClinic,
  onRefresh,
}: ClinicsListViewProps) {
  const renderItem = ({ item }: { item: Clinic }) => (
    <Card style={styles.card} onPress={() => onClinicPress(item)}>
      <Card.Content>
        <List.Item
          title={item.name}
          description={`${item.leadsCount} leads`}
          right={() => (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    WHATSAPP_STATUS_COLORS[item.whatsappStatus] || WHATSAPP_STATUS_COLORS.disconnected,
                },
              ]}
            >
              <Text style={styles.badgeText}>{item.whatsappStatus}</Text>
            </View>
          )}
          accessibilityRole="button"
          accessibilityLabel={`Clínica ${item.name}, ${item.leadsCount} leads`}
        />
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar clínica por nome ou CNPJ"
        onChangeText={onSearchChange}
        value={searchQuery}
        style={styles.searchbar}
      />
      <FlatList
        testID="clinics-list"
        data={clinics}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />}
        contentContainerStyle={clinics.length === 0 ? styles.center : undefined}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>{searchQuery ? 'Nenhuma clínica encontrada' : 'Nenhuma clínica cadastrada'}</Text>
          </View>
        }
      />
      <FAB icon="plus" style={styles.fab} onPress={onAddClinic} accessibilityLabel="Adicionar clínica" />
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
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'center',
  },
  badgeText: { color: '#fff', fontSize: 12 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
  searchbar: { margin: 8 },
});