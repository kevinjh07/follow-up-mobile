import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Dialog, Portal, Text, Button, ActivityIndicator } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { fetchWhatsAppStatus } from '@features/clinics/api/whatsapp.api';
import { useRoute, RouteProp } from '@react-navigation/native';
import type { MainTabsParamList } from '@navigation/types';

type PairingCodeRouteProp = RouteProp<MainTabsParamList, 'PairingCodeDialog'>;

interface PairingCodeDialogProps {
  visible: boolean;
  onDismiss: () => void;
}

const CHAR_ARROW = '\u2192';

export function PairingCodeDialog({ visible, onDismiss }: PairingCodeDialogProps) {
  const route = useRoute<PairingCodeRouteProp>();
  const { clinicId } = route.params;

  const { data: status, isLoading, error } = useQuery({
    queryKey: ['whatsapp-status', clinicId],
    queryFn: () => fetchWhatsAppStatus(clinicId),
    enabled: visible,
    refetchInterval: 3000,
  });

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title style={styles.title}>Código de Pareamento</Dialog.Title>
        <Dialog.Content>
          {isLoading && (
            <View style={styles.center}>
              <ActivityIndicator size="large" />
              <Text style={styles.loadingText}>Obtendo código...</Text>
            </View>
          )}
          {error && (
            <View style={styles.center}>
              <Text style={styles.error}>Erro ao obter código</Text>
              <Button onPress={onDismiss}>Fechar</Button>
            </View>
          )}
          {status?.pairingCode && (
            <View style={styles.codeContainer}>
              <Text style={styles.instruction}>Digite este código no WhatsApp</Text>
              <Text style={styles.code}>{status.pairingCode}</Text>
              <Text style={styles.hint}>
                WhatsApp {CHAR_ARROW} Settings {CHAR_ARROW} Linked Devices {CHAR_ARROW} Link a Device
              </Text>
            </View>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Fechar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  title: { textAlign: 'center' },
  center: { alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12 },
  error: { color: '#b00020', marginBottom: 12 },
  codeContainer: { alignItems: 'center', padding: 16 },
  instruction: { marginBottom: 16, textAlign: 'center' },
  code: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 4,
    color: '#6200ee',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  hint: { marginTop: 16, textAlign: 'center', color: '#666', fontSize: 12 },
});