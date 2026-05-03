import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Title, Appbar, ActivityIndicator, useTheme } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import {
  fetchDashboardStats,
  fetchLeadFunnel,
  fetchDispatchDashboardSessions,
} from '@features/dashboard/api/dashboard.api';
import { BarChart } from 'react-native-gifted-charts';

const STATUS_COLORS = {
  OUTREACH: '#2196F3',
  TESTIMONIAL: '#FF9800',
  CLOSURE: '#9C27B0',
  FINALIZED: '#4CAF50',
};

const SESSION_STATUS_COLORS = {
  QUEUED: '#f0a500',
  RUNNING: '#2196f3',
  COMPLETED: '#4caf50',
  CANCELLED: '#999',
  FAILED: '#b00020',
};

export function DashboardScreen() {
  const theme = useTheme();

  const {
    data: stats,
    isLoading: statsLoading,
    refetch: statsRefetch,
    isRefetching: statsRefetching,
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  });

  const { data: funnel, isLoading: funnelLoading } = useQuery({
    queryKey: ['lead-funnel'],
    queryFn: fetchLeadFunnel,
  });

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['dispatch-sessions-dashboard'],
    queryFn: fetchDispatchDashboardSessions,
  });

  const isLoading = statsLoading || funnelLoading || sessionsLoading;

  const funnelData = funnel
    ? [
        { value: funnel.OUTREACH || 0, label: 'Prospecção', frontColor: STATUS_COLORS.OUTREACH },
        {
          value: funnel.TESTIMONIAL || 0,
          label: 'Depoimento',
          frontColor: STATUS_COLORS.TESTIMONIAL,
        },
        { value: funnel.CLOSURE || 0, label: 'Encerramento', frontColor: STATUS_COLORS.CLOSURE },
        { value: funnel.FINALIZED || 0, label: 'Finalizado', frontColor: STATUS_COLORS.FINALIZED },
      ]
    : [];

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="Dashboard" />
      </Appbar.Header>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={statsRefetching} onRefresh={statsRefetch} />}
      >
        <Title style={styles.sectionTitle}>Visão Geral</Title>
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statValue}>{stats?.totalLeads || 0}</Text>
              <Text style={styles.statLabel}>Total de Leads</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statValue}>{stats?.newLeadsToday || 0}</Text>
              <Text style={styles.statLabel}>Novos Hoje</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statValue}>{stats?.activeSessions || 0}</Text>
              <Text style={styles.statLabel}>Sessões Ativas</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statValue}>{stats?.successRate || 0}%</Text>
              <Text style={styles.statLabel}>Taxa de Sucesso</Text>
            </Card.Content>
          </Card>
        </View>

        <Title style={styles.sectionTitle}>Funil de Leads</Title>
        <Card style={styles.card}>
          <Card.Content>
            {funnelData.length > 0 ? (
              <View style={styles.chartContainer}>
                <BarChart
                  data={funnelData}
                  width={280}
                  height={180}
                  barWidth={50}
                  spacing={20}
                  roundedTop
                  hideRules
                  xAxisLabelTextStyle={{ fontSize: 10, color: '#666' }}
                  yAxisTextStyle={{ fontSize: 10, color: '#666' }}
                />
              </View>
            ) : (
              <Text style={styles.emptyText}>Nenhum dado disponível</Text>
            )}
          </Card.Content>
        </Card>

        <Title style={styles.sectionTitle}>Sessões de Disparo</Title>
        <Card style={styles.card}>
          <Card.Content>
            {sessions && sessions.length > 0 ? (
              sessions.slice(0, 5).map((session) => (
                <View key={session.id} style={styles.sessionItem}>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionClinic}>{session.clinicName}</Text>
                    <Text style={styles.sessionTime}>
                      {new Date(session.startedAt).toLocaleTimeString()}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.sessionStatus,
                      { backgroundColor: SESSION_STATUS_COLORS[session.status] },
                    ]}
                  >
                    <Text style={styles.sessionStatusText}>
                      {session.sent}/{session.total}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Nenhuma sessão em andamento</Text>
            )}
          </Card.Content>
        </Card>

        <Title style={styles.sectionTitle}>Status do WhatsApp</Title>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.whatsappSummary}>
              <View style={styles.whatsappStat}>
                <View style={[styles.statusDot, { backgroundColor: '#4caf50' }]} />
                <Text style={styles.whatsappStatText}>Conectados: -</Text>
              </View>
              <View style={styles.whatsappStat}>
                <View style={[styles.statusDot, { backgroundColor: '#b00020' }]} />
                <Text style={styles.whatsappStatText}>
                  Desconectados: {stats?.disconnectedClinics || 0}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, padding: 16 },
  sectionTitle: { marginTop: 16, marginBottom: 8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statCard: { flex: 1, minWidth: '45%' },
  statValue: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  statLabel: { fontSize: 12, color: '#666', textAlign: 'center', marginTop: 4 },
  card: { marginBottom: 16 },
  chartContainer: { alignItems: 'center', paddingVertical: 16 },
  emptyText: { textAlign: 'center', color: '#666', paddingVertical: 16 },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sessionInfo: { flex: 1 },
  sessionClinic: { fontSize: 14, fontWeight: 'bold' },
  sessionTime: { fontSize: 12, color: '#666' },
  sessionStatus: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  sessionStatusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  whatsappSummary: { gap: 8 },
  whatsappStat: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  whatsappStatText: { fontSize: 14 },
});
