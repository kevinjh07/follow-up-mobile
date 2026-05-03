import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Appbar, Card, Title, Paragraph, Chip, Divider } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchLead, updateLeadStatus, deleteLead, optOutLead, anonymizeLead } from '@features/leads/api/leads.api';
import { useLeadStore } from '@features/leads/stores/leadStore';
import { useAuthStore } from '@core/stores/authStore';
import type { Lead } from '@features/leads/api/leads.api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabsParamList } from '@navigation/types';

type NavigationProp = NativeStackNavigationProp<MainTabsParamList, 'Leads'>;

const STATUS_LABELS: Record<Lead['status'], string> = {
  OUTREACH: 'Prospecção',
  TESTIMONIAL: 'Depoimento',
  CLOSURE: 'Encerramento',
  FINALIZED: 'Finalizado',
};

const STATUS_COLORS: Record<Lead['status'], string> = {
  OUTREACH: '#2196F3',
  TESTIMONIAL: '#FF9800',
  CLOSURE: '#9C27B0',
  FINALIZED: '#4CAF50',
};

function LeadDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { selectedLead, setSelectedLead } = useLeadStore();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === 'ADMIN';

  const { data: lead, isLoading, error } = useQuery({
    queryKey: ['lead', selectedLead?.id],
    queryFn: () => fetchLead(selectedLead!.id),
    enabled: !!selectedLead?.id,
  });

  const statusMutation = useMutation({
    mutationFn: (status: Lead['status']) => updateLeadStatus(selectedLead!.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead', selectedLead?.id] });
      Alert.alert('Sucesso', 'Status atualizado');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteLead(selectedLead!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setSelectedLead(null);
      navigation.goBack();
    },
  });

  const optOutMutation = useMutation({
    mutationFn: () => optOutLead(selectedLead!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead', selectedLead?.id] });
      Alert.alert('Sucesso', 'Lead marcado como opt-out');
    },
  });

  const anonymizeMutation = useMutation({
    mutationFn: () => anonymizeLead(selectedLead!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setSelectedLead(null);
      navigation.goBack();
    },
  });

  const handleOptOut = () => {
    Alert.alert(
      'Opt-out',
      `Registrar opt-out para "${lead?.name}"? Este lead não receberá mais mensagens.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => optOutMutation.mutate() },
      ]
    );
  };

  const handleAnonymize = () => {
    Alert.alert(
      'Anonimizar',
      `Anonimizar os dados de "${lead?.name}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Anonimizar', style: 'destructive', onPress: () => anonymizeMutation.mutate() },
      ]
    );
  };

  if (isLoading) {
    return <View style={styles.center}><Text>Carregando...</Text></View>;
  }

  if (error || !lead) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Erro ao carregar lead</Text>
        <Button onPress={() => navigation.goBack()}>Voltar</Button>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => {
          setSelectedLead(null);
          navigation.goBack();
        }} accessibilityLabel="Voltar" />
        <Appbar.Content title={lead.name} />
        <Appbar.Action
          icon="pencil"
          onPress={() => navigation.navigate('LeadForm')}
          accessibilityLabel="Editar lead"
        />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Informações</Title>
            <Divider style={styles.divider} />
            <Paragraph>E-mail: {lead.email}</Paragraph>
            <Paragraph>Telefone: {lead.phone}</Paragraph>
            <View style={styles.statusRow}>
              <Text style={styles.label}>Status:</Text>
              <Chip
                style={[styles.chip, { backgroundColor: STATUS_COLORS[lead.status] }]}
                textStyle={styles.chipText}
              >
                {STATUS_LABELS[lead.status]}
              </Chip>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Privacidade (LGPD)</Title>
            <Divider style={styles.divider} />
            <Button
              mode="outlined"
              onPress={handleOptOut}
              loading={optOutMutation.isPending}
              disabled={optOutMutation.isPending}
              style={styles.privacyButton}
            >
              Registrar Opt-out
            </Button>
            {isAdmin && (
              <Button
                mode="outlined"
                onPress={handleAnonymize}
                loading={anonymizeMutation.isPending}
                disabled={anonymizeMutation.isPending}
                style={styles.privacyButton}
                textColor="#b00020"
              >
                Anonimizar Dados
              </Button>
            )}
          </Card.Content>
        </Card>

        <Title style={styles.sectionTitle}>Alterar Status</Title>
        <View style={styles.statusButtons}>
          {(Object.keys(STATUS_LABELS) as Lead['status'][]).map((status) => (
            <Button
              key={status}
              mode={lead.status === status ? 'contained' : 'outlined'}
              onPress={() => statusMutation.mutate(status)}
              disabled={statusMutation.isPending}
              style={styles.statusButton}
              compact
            >
              {STATUS_LABELS[status]}
            </Button>
          ))}
        </View>

        <Button
          mode="outlined"
          onPress={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
          style={styles.deleteButton}
          textColor="#b00020"
          accessibilityRole="button"
          accessibilityLabel="Excluir lead"
        >
          Excluir Lead
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  content: { flex: 1, padding: 16 },
  card: { marginBottom: 16 },
  divider: { marginVertical: 12 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  label: { fontSize: 14, marginRight: 8 },
  chip: { height: 28 },
  chipText: { color: '#fff', fontSize: 12 },
  sectionTitle: { marginTop: 16, marginBottom: 8 },
  statusButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statusButton: { marginBottom: 4 },
  deleteButton: { marginTop: 24, borderColor: '#b00020' },
  error: { color: '#b00020', textAlign: 'center', marginBottom: 16 },
  privacyButton: { marginTop: 8 },
});

export { LeadDetailScreen };