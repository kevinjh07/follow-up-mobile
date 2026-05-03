import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, List, FAB, Searchbar } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { fetchClinics } from '@features/clinics/api/clinics.api';
import { useClinicStore } from '@features/clinics/stores/clinicStore';
import type { Clinic } from '@features/clinics/api/clinics.api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainTabsParamList } from '@navigation/types';

type NavigationProp = NativeStackNavigationProp<MainTabsParamList, 'Clinics'>;

const WHATSAPP_STATUS_COLORS: Record<string, string> = {
  disconnected: '#999',
  qr_pending: '#f0a500',
  code_pending: '#2196f3',
  connected: '#4caf50',
};

function ClinicsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const setActiveClinic = useClinicStore((s) => s.setActiveClinic);
  const [searchQuery, setSearchQuery] = React.useState('');

  const {
    data: clinics,
    isLoading: _isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['clinics'],
    queryFn: fetchClinics,
  });

  const filteredClinics = React.useMemo(() => {
    if (!clinics) return [];
    if (!searchQuery.trim()) return clinics;
    const query = searchQuery.toLowerCase();
    return clinics.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.cnpj.includes(query)
    );
  }, [clinics, searchQuery]);

  const handleClinicPress = (clinic: Clinic) => {
    setActiveClinic(clinic);
    navigation.navigate('ClinicDetail');
  };

  const handleAddClinic = () => {
    setActiveClinic(null);
    navigation.navigate('ClinicForm');
  };

  const renderItem = ({ item }: { item: Clinic }) => (
    <Card style={styles.card} onPress={() => handleClinicPress(item)}>
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
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      <FlatList
        testID="clinics-list"
        data={filteredClinics}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        contentContainerStyle={filteredClinics.length === 0 ? styles.center : undefined}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>{searchQuery ? 'Nenhuma clínica encontrada' : 'Nenhuma clínica cadastrada'}</Text>
          </View>
        }
      />
      <FAB icon="plus" style={styles.fab} onPress={handleAddClinic} accessibilityLabel="Adicionar clínica" />
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

export { ClinicsScreen };