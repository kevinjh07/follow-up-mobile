import { View, StyleSheet } from 'react-native';
import { Text, List, useTheme } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { api } from '@core/services/api';
import type { Clinic } from '@core/types';

export function ClinicsScreen() {
  const theme = useTheme();

  const { data: clinics, isLoading } = useQuery({
    queryKey: ['clinics'],
    queryFn: () => api.get<Clinic[]>('/clinics').then((res) => res.data),
  });

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {clinics && clinics.length > 0 ? (
        clinics.map((clinic) => (
          <List.Item
            key={clinic.id}
            title={clinic.name}
            description={clinic.active ? 'Ativa' : 'Inativa'}
            left={(props) => <List.Icon {...props} icon="hospital-building" />}
          />
        ))
      ) : (
        <View style={styles.center}>
          <Text>Nenhuma clínica encontrada</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
