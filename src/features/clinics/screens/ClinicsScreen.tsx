import React from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Text, Card, List, FAB } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { fetchClinics } from '@features/clinics/api/clinics.api';
import { useClinicStore } from '@features/clinics/stores/clinicStore';
import type { Clinic } from '@features/clinics/api/clinics.api';

function ClinicsScreen() {
  const setActiveClinic = useClinicStore((s) => s.setActiveClinic);

  const {
    data: clinics,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['clinics'],
    queryFn: fetchClinics,
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" accessibilityLabel="Carregando clínicas" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Erro ao carregar clínicas</Text>
      </View>
    );
  }

  if (!clinics || clinics.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Nenhuma clínica encontrada</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Clinic }) => (
    <Card style={styles.card} onPress={() => setActiveClinic(item)}>
      <Card.Content>
        <List.Item
          title={item.name}
          description={`${item.leadsCount} leads`}
          right={() => (
            <View
              style={[
                styles.badge,
                item.whatsappStatus === 'connected' ? styles.badgeConnected : styles.badgeDisconnected,
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
      <FlatList
        testID="clinics-list"
        data={clinics}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        contentContainerStyle={clinics.length === 0 ? styles.center : undefined}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {}}
        accessibilityRole="button"
        accessibilityLabel="Adicionar clínica"
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
  error: { color: 'red', textAlign: 'center' },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { color: '#fff', fontSize: 12 },
  badgeConnected: { backgroundColor: '#6200ee' },
  badgeDisconnected: { backgroundColor: '#999' },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
});

export { ClinicsScreen };
