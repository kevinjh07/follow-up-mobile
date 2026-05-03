import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, ActivityIndicator, FAB } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { fetchLeads } from '@features/leads/api/leads.api';
import { useClinicStore } from '@features/clinics/stores/clinicStore';
import type { Lead } from '@features/leads/api/leads.api';

function LeadsScreen() {
  const { activeClinic } = useClinicStore();

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

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" accessibilityLabel="Carregando leads" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Erro ao carregar leads</Text>
      </View>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Nenhum lead encontrado</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Lead }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.status}>{item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={leads}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        contentContainerStyle={leads.length === 0 ? styles.center : undefined}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {}}
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
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: { fontSize: 16, fontWeight: 'bold' },
  status: { fontSize: 14, color: '#666', marginTop: 4 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
  error: { color: '#b00020', textAlign: 'center' },
});

export { LeadsScreen };
