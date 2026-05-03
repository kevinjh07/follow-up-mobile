import React from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Text, Button, Appbar, Card, Title, Paragraph } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchClinic, updateClinic, exportClinicLeads } from '@features/clinics/api/clinics.api';
import { useClinicStore } from '@features/clinics/stores/clinicStore';
import type { Clinic } from '@features/clinics/api/clinics.api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabsParamList } from '@navigation/types';

type NavigationProp = NativeStackNavigationProp<MainTabsParamList, 'Clinics'>;

function ClinicDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { activeClinic } = useClinicStore();
  const queryClient = useQueryClient();

  const { data: clinic, isLoading, error } = useQuery({
    queryKey: ['clinic', activeClinic?.id],
    queryFn: () => fetchClinic(activeClinic!.id),
    enabled: !!activeClinic?.id,
  });

  useMutation({
    mutationFn: (data: Parameters<typeof updateClinic>[1]) => updateClinic(activeClinic!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
      queryClient.invalidateQueries({ queryKey: ['clinic', activeClinic?.id] });
    },
  });

  const { mutate: exportMutate, isPending: isExporting } = useMutation({
    mutationFn: () => exportClinicLeads(activeClinic!.id),
    onSuccess: () => {
      Alert.alert('Sucesso', 'Exportação iniciada');
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" accessibilityLabel="Carregando detalhes" />
      </View>
    );
  }

  if (error || !clinic) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Erro ao carregar clínica</Text>
        <Button onPress={() => navigation.goBack()}>Voltar</Button>
      </View>
    );
  }

  const handleExport = () => exportMutate();

  return (
    <View style={styles.flex}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} accessibilityLabel="Voltar" />
        <Appbar.Content title={clinic.name} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Detalhes</Title>
            <Paragraph>CNPJ: {clinic.cnpj}</Paragraph>
            <Paragraph>Status: {clinic.whatsappStatus}</Paragraph>
            <Paragraph>Leads: {clinic.leadsCount}</Paragraph>
          </Card.Content>
        </Card>

        <Button
          mode="outlined"
          onPress={handleExport}
          loading={isExporting}
          style={styles.button}
          accessibilityRole="button"
          accessibilityLabel="Exportar leads"
        >
          Exportar Leads
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: { flex: 1, padding: 16 },
  card: { marginBottom: 16 },
  button: { marginTop: 8 },
  error: { color: '#b00020', textAlign: 'center' },
});

export { ClinicDetailScreen };
