import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  Button,
  Appbar,
  Card,
  Title,
  Paragraph,
  Divider,
  ActivityIndicator,
  Portal,
} from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchClinic, deleteClinic, exportClinicLeads } from '@features/clinics/api/clinics.api';
import {
  fetchWhatsAppStatus,
  startWhatsAppInstance,
  disconnectWhatsApp,
  ConnectionStatus,
} from '@features/clinics/api/whatsapp.api';
import { useClinicStore } from '@features/clinics/stores/clinicStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainTabsParamList } from '@navigation/types';
import { QRCodeDialog } from './QRCodeDialog';
import { PairingCodeDialog } from './PairingCodeDialog';

type NavigationProp = NativeStackNavigationProp<MainTabsParamList, 'Clinics'>;

const WHATSAPP_STATUS_LABELS: Record<ConnectionStatus, string> = {
  disconnected: 'Desconectado',
  qr_pending: 'QR Code Pendente',
  code_pending: 'Código de Pareamento',
  connected: 'Conectado',
};

const WHATSAPP_STATUS_COLORS: Record<ConnectionStatus, string> = {
  disconnected: '#999',
  qr_pending: '#f0a500',
  code_pending: '#2196f3',
  connected: '#4caf50',
};

function ClinicDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const queryClient = useQueryClient();
  const { activeClinic, setActiveClinic } = useClinicStore();
  const [showQRCode, setShowQRCode] = useState(false);
  const [showPairingCode, setShowPairingCode] = useState(false);

  const {
    data: clinic,
    isLoading: clinicLoading,
    error: clinicError,
  } = useQuery({
    queryKey: ['clinic', activeClinic?.id],
    queryFn: () => fetchClinic(activeClinic!.id),
    enabled: !!activeClinic?.id,
  });

  const { data: waStatus, isLoading: waLoading } = useQuery({
    queryKey: ['whatsapp-status', activeClinic?.id],
    queryFn: () => fetchWhatsAppStatus(activeClinic!.id),
    enabled: !!activeClinic?.id,
    refetchInterval: 10000,
  });

  const deleteMutation = useMutation({
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

  const exportMutation = useMutation({
    mutationFn: () => exportClinicLeads(activeClinic!.id),
    onSuccess: () => {
      Alert.alert('Sucesso', 'Exportação iniciada em segundo plano');
    },
    onError: () => {
      Alert.alert('Erro', 'Não foi possível iniciar a exportação');
    },
  });

  const connectMutation = useMutation({
    mutationFn: () => startWhatsAppInstance(activeClinic!.id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-status', activeClinic?.id] });
      if (data.status === 'qr_pending') {
        setShowQRCode(true);
      } else if (data.status === 'code_pending') {
        setShowPairingCode(true);
      }
    },
    onError: () => {
      Alert.alert('Erro', 'Não foi possível conectar WhatsApp');
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: () => disconnectWhatsApp(activeClinic!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-status', activeClinic?.id] });
      queryClient.invalidateQueries({ queryKey: ['clinic', activeClinic?.id] });
    },
    onError: () => {
      Alert.alert('Erro', 'Não foi possível desconectar WhatsApp');
    },
  });

  const handleDelete = () => {
    Alert.alert(
      'Excluir Clínica',
      `Tem certeza que deseja excluir "${clinic?.name}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteMutation.mutate() },
      ],
    );
  };

  const handleConnect = () => {
    Alert.alert('Conectar WhatsApp', 'Como você deseja conectar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'QR Code',
        onPress: () => {
          connectMutation.mutate();
          setShowQRCode(true);
        },
      },
      {
        text: 'Código de Pareamento',
        onPress: () => {
          connectMutation.mutate();
          setShowPairingCode(true);
        },
      },
    ]);
  };

  const handleDisconnect = () => {
    Alert.alert('Desconectar WhatsApp', 'Tem certeza que deseja desconectar?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Desconectar', style: 'destructive', onPress: () => disconnectMutation.mutate() },
    ]);
  };

  if (clinicLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" accessibilityLabel="Carregando detalhes" />
      </View>
    );
  }

  if (clinicError || !clinic) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Erro ao carregar clínica</Text>
        <Button onPress={() => navigation.goBack()}>Voltar</Button>
      </View>
    );
  }

  const waStatusValue = waStatus?.status || (clinic.whatsappStatus as ConnectionStatus);
  const isConnected = waStatusValue === 'connected';
  const isPending = waStatusValue === 'qr_pending' || waStatusValue === 'code_pending';

  return (
    <View style={styles.flex}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} accessibilityLabel="Voltar" />
        <Appbar.Content title={clinic.name} />
        <Appbar.Action
          icon="pencil"
          onPress={() => navigation.navigate('ClinicForm')}
          accessibilityLabel="Editar clínica"
        />
        <Appbar.Action
          icon="delete"
          onPress={handleDelete}
          accessibilityLabel="Excluir clínica"
          disabled={deleteMutation.isPending}
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
              <Text style={styles.label}>WhatsApp:</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: WHATSAPP_STATUS_COLORS[waStatusValue] },
                ]}
              >
                <Text style={styles.statusText}>{WHATSAPP_STATUS_LABELS[waStatusValue]}</Text>
              </View>
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>WhatsApp</Title>
            <Divider style={styles.divider} />
            {waLoading ? (
              <ActivityIndicator size="small" />
            ) : (
              <View style={styles.waActions}>
                {isConnected ? (
                  <Button
                    mode="outlined"
                    onPress={handleDisconnect}
                    loading={disconnectMutation.isPending}
                    style={styles.waButton}
                    textColor="#b00020"
                  >
                    Desconectar WhatsApp
                  </Button>
                ) : isPending ? (
                  <Button
                    mode="outlined"
                    onPress={() => {
                      if (waStatusValue === 'qr_pending') setShowQRCode(true);
                      else setShowPairingCode(true);
                    }}
                    style={styles.waButton}
                  >
                    Ver Código
                  </Button>
                ) : (
                  <Button
                    mode="contained"
                    onPress={handleConnect}
                    loading={connectMutation.isPending}
                    style={styles.waButton}
                  >
                    Conectar WhatsApp
                  </Button>
                )}
              </View>
            )}
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={() => exportMutation.mutate()}
          loading={exportMutation.isPending}
          disabled={exportMutation.isPending}
          style={styles.button}
          accessibilityRole="button"
          accessibilityLabel="Exportar leads"
        >
          Exportar Leads
        </Button>

        <Button
          mode="outlined"
          onPress={handleDelete}
          loading={deleteMutation.isPending}
          disabled={deleteMutation.isPending}
          style={styles.button}
          textColor="#b00020"
          accessibilityRole="button"
          accessibilityLabel="Excluir clínica"
        >
          Excluir Clínica
        </Button>
      </ScrollView>

      <Portal>
        <QRCodeDialog visible={showQRCode} onDismiss={() => setShowQRCode(false)} />
        <PairingCodeDialog visible={showPairingCode} onDismiss={() => setShowPairingCode(false)} />
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  content: { flex: 1, padding: 16 },
  card: { marginBottom: 16 },
  divider: { marginVertical: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  label: { fontWeight: 'bold', marginRight: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  button: { marginTop: 8 },
  error: { color: '#b00020', textAlign: 'center' },
  waActions: { marginTop: 8 },
  waButton: { marginTop: 8 },
});

export { ClinicDetailScreen };
