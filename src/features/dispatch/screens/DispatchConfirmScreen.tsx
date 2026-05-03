import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Appbar, Card, Title, Divider, List } from 'react-native-paper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { startDispatch } from '@features/dispatch/api/dispatch.api';
import { useClinicStore } from '@features/clinics/stores/clinicStore';
import { useSelectionStore } from '@features/dispatch/stores/dispatchStore';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainTabsParamList, LeadsStackParamList } from '@navigation/types';

type DispatchConfirmNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabsParamList>,
  NativeStackNavigationProp<LeadsStackParamList>
>;

export function DispatchConfirmScreen() {
  const navigation = useNavigation<DispatchConfirmNavProp>();
  const queryClient = useQueryClient();
  const { activeClinic } = useClinicStore();
  const { selectedLeads, clearSelection } = useSelectionStore();

  const leadIds = Array.from(selectedLeads);

  const dispatchMutation = useMutation({
    mutationFn: () => startDispatch(activeClinic!.id, leadIds),
    onSuccess: (dispatchSession) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      clearSelection();
      navigation.navigate('DispatchProgress', { sessionId: dispatchSession.id });
    },
    onError: (error: unknown) => {
      const message = (error as { message?: string })?.message || 'Erro ao iniciar disparo';
      Alert.alert('Erro', message);
    },
  });

  const handleConfirm = () => {
    if (!activeClinic?.whatsappStatus || activeClinic.whatsappStatus === 'disconnected') {
      Alert.alert(
        'WhatsApp Desconectado',
        `A clínica "${activeClinic?.name}" está com o WhatsApp desconectado. Conecte antes de fazer o disparo.`,
        [{ text: 'OK' }],
      );
      return;
    }
    dispatchMutation.mutate();
  };

  return (
    <View style={styles.flex}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} accessibilityLabel="Voltar" />
        <Appbar.Content title="Confirmar Disparo" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Resumo do Disparo</Title>
            <Divider style={styles.divider} />
            <List.Item
              title="Clínica"
              description={activeClinic?.name}
              left={(props) => <List.Icon {...props} icon="hospital-building" />}
            />
            <List.Item
              title="Leads selecionados"
              description={`${leadIds.length} leads`}
              left={(props) => <List.Icon {...props} icon="account-group" />}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Importante</Title>
            <Divider style={styles.divider} />
            <Text style={styles.warningText}>
              • O disparo seguirá a cadência configurada (24h, 48h, 72h)
            </Text>
            <Text style={styles.warningText}>
              • Cada lead receberá mensagens conforme seu status atual
            </Text>
            <Text style={styles.warningText}>• Você pode acompanhar o progresso em tempo real</Text>
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.button}>
          Cancelar
        </Button>
        <Button
          mode="contained"
          onPress={handleConfirm}
          loading={dispatchMutation.isPending}
          disabled={dispatchMutation.isPending || leadIds.length === 0}
          style={styles.button}
        >
          Iniciar Disparo
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flex: 1, padding: 16 },
  card: { marginBottom: 16 },
  divider: { marginVertical: 12 },
  warningText: { fontSize: 14, color: '#666', marginBottom: 8 },
  footer: { flexDirection: 'row', padding: 16, gap: 12 },
  button: { flex: 1 },
});
