import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Button, Appbar, Card, Title, ProgressBar, Divider, ActivityIndicator } from 'react-native-paper';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getDispatchSessionStatus, cancelDispatchSession, type DispatchStreamEvent } from '@features/dispatch/api/dispatch.api';
import { useDispatchStore } from '@features/dispatch/stores/dispatchStore';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainTabsParamList } from '@navigation/types';

type NavigationProp = NativeStackNavigationProp<MainTabsParamList>;
type DispatchProgressRouteProp = RouteProp<MainTabsParamList, 'DispatchProgress'>;

export function DispatchProgressScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DispatchProgressRouteProp>();
  const { sessionId } = route.params || {};
  const { currentSession, setCurrentSession, events, addEvent, clearEvents } = useDispatchStore();
  const [progress, setProgress] = useState(0);

  const { data: session, isLoading } = useQuery({
    queryKey: ['dispatch-session', sessionId],
    queryFn: () => getDispatchSessionStatus(sessionId!),
    enabled: !!sessionId,
    refetchInterval: 2000,
  });

  useEffect(() => {
    if (session) {
      setCurrentSession(session);
      if (session.status === 'COMPLETED' || session.status === 'FAILED') {
        setProgress(1);
      } else if (session.total > 0) {
        setProgress((session.successful + session.failed) / session.total);
      }
    }
  }, [session]);

  const cancelMutation = useMutation({
    mutationFn: () => cancelDispatchSession(sessionId!),
    onSuccess: () => {
      clearEvents();
      navigation.goBack();
    },
    onError: () => {
      Alert.alert('Erro', 'Não foi possível cancelar o disparo');
    },
  });

  const handleCancel = () => {
    Alert.alert(
      'Cancelar Disparo',
      'Tem certeza que deseja cancelar o disparo em andamento?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', style: 'destructive', onPress: () => cancelMutation.mutate() },
      ]
    );
  };

  const getStatusLabel = () => {
    if (!session) return 'Carregando...';
    switch (session.status) {
      case 'QUEUED':
        return 'Aguardando...';
      case 'RUNNING':
        return 'Em andamento';
      case 'COMPLETED':
        return 'Concluído';
      case 'CANCELLED':
        return 'Cancelado';
      case 'FAILED':
        return 'Falhou';
      default:
        return session.status;
    }
  };

  const getStatusColor = () => {
    if (!session) return '#999';
    switch (session.status) {
      case 'COMPLETED':
        return '#4caf50';
      case 'CANCELLED':
        return '#999';
      case 'FAILED':
        return '#b00020';
      case 'RUNNING':
        return '#2196f3';
      default:
        return '#999';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} accessibilityLabel="Voltar" />
        <Appbar.Content title="Disparo em Andamento" />
      </Appbar.Header>

      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Progresso</Title>
            <Divider style={styles.divider} />
            <View style={styles.progressInfo}>
              <Text style={styles.statusLabel}>{getStatusLabel()}</Text>
              <Text style={styles.progressText}>
                {currentSession?.successful || 0} / {currentSession?.total || 0}
              </Text>
            </View>
            <ProgressBar
              progress={progress}
              color={getStatusColor()}
              style={styles.progressBar}
            />
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#4caf50' }]}>
                  {currentSession?.successful || 0}
                </Text>
                <Text style={styles.statLabel}>Enviados</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#b00020' }]}>
                  {currentSession?.failed || 0}
                </Text>
                <Text style={styles.statLabel}>Falhas</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {events.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Eventos Recentes</Title>
              <Divider style={styles.divider} />
              <FlatList
                data={events.slice(-10).reverse()}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => {
                  if (item.type === 'progress') {
                    return (
                      <Text style={styles.eventText}>
                        ✓ Enviado para {item.result.phone}
                      </Text>
                    );
                  }
                  if (item.type === 'error') {
                    return (
                      <Text style={[styles.eventText, { color: '#b00020' }]}>
                        ✗ Erro: {item.error}
                      </Text>
                    );
                  }
                  if (item.type === 'sending') {
                    return (
                      <Text style={styles.eventText}>
                        → Enviando para {item.phone}...
                      </Text>
                    );
                  }
                  return null;
                }}
              />
            </Card.Content>
          </Card>
        )}

        <View style={styles.actions}>
          {(currentSession?.status === 'QUEUED' || currentSession?.status === 'RUNNING') && (
            <Button
              mode="outlined"
              onPress={handleCancel}
              loading={cancelMutation.isPending}
              style={styles.cancelButton}
              textColor="#b00020"
            >
              Cancelar Disparo
            </Button>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  content: { flex: 1, padding: 16 },
  loadingText: { marginTop: 12 },
  card: { marginBottom: 16 },
  divider: { marginVertical: 12 },
  progressInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  statusLabel: { fontSize: 16, fontWeight: 'bold' },
  progressText: { fontSize: 16, color: '#666' },
  progressBar: { height: 8, borderRadius: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#666' },
  eventText: { fontSize: 12, marginBottom: 4 },
  actions: { marginTop: 16 },
  cancelButton: { borderColor: '#b00020' },
});