import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Appbar, Card, Title, Paragraph, Divider, ActivityIndicator } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchClinic, deleteClinic, exportClinicLeads } from '@features/clinics/api/clinics.api';
import { useClinicStore } from '@features/clinics/stores/clinicStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainTabsParamList } from '@navigation/types';

type NavigationProp = NativeStackNavigationProp<MainTabsParamList, 'Clinics'>;

const WHATSAPP_STATUS_LABELS = {
  disconnected: 'Desconectado',
  connecting: 'Conectando',
  connected: 'Conectado',
};

const WHATSAPP_STATUS_COLORS = {
  disconnected: '#999',
  connecting: '#f0a500',
  connected: '#4caf50',
};

function ClinicDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const queryClient = useQueryClient();
  const { activeClinic, setActiveClinic } = useClinicStore();

  const { data: clinic, isLoading, error } = useQuery({
    queryKey: ['clinic', activeClinic?.id],
    queryFn: () => fetchClinic(activeClinic!.id),
    enabled: !!activeClinic?.id,
  });

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteClinic(activeClinic!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
      setActiveClinic(null);
      navigation.goBack();
    },
    onError: () => {
      Alert.alert('Erro', 'Não foi possível excluir a clínica');
    },
  });

  const { mutate: exportMutate, isPending: isExporting } = useMutation({
    mutationFn: () => exportClinicLeads(activeClinic!.id),
    onSuccess: () => {
      Alert.alert('Sucesso', 'Exportação iniciada em segundo plano');
    },
    onError: () => {
      Alert.alert('Erro', 'Não foi possível iniciar a exportação');
    },
  });

  const handleDelete = () => {
    Alert.alert(
      'Excluir Clínica',
      `Tem certeza que deseja excluir "${clinic?.name}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteMutate(),
        },
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate('ClinicForm');
  };

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

  return (
    <View style={styles.flex}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} accessibilityLabel="Voltar" />
        <Appbar.Content title={clinic.name} />
        <Appbar.Action icon="pencil" onPress={handleEdit} accessibilityLabel="Editar clínica" />
        <Appbar.Action
          icon="delete"
          onPress={handleDelete}
          accessibilityLabel="Excluir clínica"
          disabled={isDeleting}
        />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Detalhes</Title>
            <Divider style={styles.divider} />
            <Paragraph style={styles.infoRow}>
              <Text style={styles.label}>CNPJ:</Text> {clinic.cnpj}
            </Paragraph>
            <Paragraph style={styles.infoRow}>
              <Text style={styles.label}>Leads:</Text> {clinic.leadsCount}
            </Paragraph>
            <Paragraph style={styles.infoRow}>
              <Text style={styles.label}>WhatsApp:</Text>{' '}
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: WHATSAPP_STATUS_COLORS[clinic.whatsappStatus] },
                ]}
              >
                <Text style={styles.statusText}>
                  {WHATSAPP_STATUS_LABELS[clinic.whatsappStatus]}
                </Text>
              </View>
            </Paragraph>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={() => exportMutate()}
          loading={isExporting}
          disabled={isExporting}
          style={styles.button}
          accessibilityRole="button"
          accessibilityLabel="Exportar leads"
        >
          Exportar Leads
        </Button>

        <Button
          mode="outlined"
          onPress={handleDelete}
          loading={isDeleting}
          disabled={isDeleting}
          style={styles.button}
          textColor="#b00020"
          accessibilityRole="button"
          accessibilityLabel="Excluir clínica"
        >
          Excluir Clínica
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
  divider: { marginVertical: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  label: { fontWeight: 'bold', marginRight: 8 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  button: { marginTop: 8 },
  error: { color: '#b00020', textAlign: 'center' },
});

export { ClinicDetailScreen };