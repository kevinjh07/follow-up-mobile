import { View, StyleSheet } from 'react-native';
import { Text, FAB, useTheme } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { api } from '@core/services/api';
import type { Lead } from '@core/types';

export function LeadsScreen() {
  const theme = useTheme();

  const { data: leads, isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: () => api.get<Lead[]>('/leads').then((res) => res.data),
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
      {leads && leads.length > 0 ? (
        <Text>Total de leads: {leads.length}</Text>
      ) : (
        <View style={styles.center}>
          <Text>Nenhum lead encontrado</Text>
        </View>
      )}
      <FAB icon="plus" style={styles.fab} onPress={() => {}} label="Novo Lead" />
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
