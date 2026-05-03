import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Dialog, Portal, Text, Button, ActivityIndicator } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { fetchWhatsAppQRCode } from '@features/clinics/api/whatsapp.api';
import { useRoute, RouteProp } from '@react-navigation/native';
import type { MainTabsParamList } from '@navigation/types';

type QRCodeRouteProp = RouteProp<MainTabsParamList, 'QRCodeDialog'>;

interface QRCodeDialogProps {
  visible: boolean;
  onDismiss: () => void;
}

export function QRCodeDialog({ visible, onDismiss }: QRCodeDialogProps) {
  const route = useRoute<QRCodeRouteProp>();
  const { clinicId } = route.params;

  const { data: qrCode, isLoading, error } = useQuery({
    queryKey: ['whatsapp-qr', clinicId],
    queryFn: () => fetchWhatsAppQRCode(clinicId),
    enabled: visible,
    refetchInterval: 5000,
  });

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title style={styles.title}>
          <Text style={styles.titleIcon}>📱</Text> Conectar WhatsApp
        </Dialog.Title>
        <Dialog.Content>
          {isLoading && (
            <View style={styles.center}>
              <ActivityIndicator size="large" />
              <Text style={styles.loadingText}>Gerando QR Code...</Text>
            </View>
          )}
          {error && (
            <View style={styles.center}>
              <Text style={styles.error}>Erro ao carregar QR Code</Text>
              <Button onPress={onDismiss}>Fechar</Button>
            </View>
          )}
          {qrCode && (
            <View style={styles.qrContainer}>
              <Image
                source={{ uri: qrCode }}
                style={styles.qrImage}
                resizeMode="contain"
              />
              <Text style={styles.instruction}>
                Escaneie o QR Code com seu WhatsApp
              </Text>
              <Text style={styles.timeout}>O código expira em 60 segundos</Text>
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
  titleIcon: { fontSize: 24, marginRight: 8 },
  center: { alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12 },
  error: { color: '#b00020', marginBottom: 12 },
  qrContainer: { alignItems: 'center' },
  qrImage: { width: 250, height: 250, backgroundColor: '#fff' },
  instruction: { marginTop: 16, textAlign: 'center', fontWeight: 'bold' },
  timeout: { marginTop: 8, textAlign: 'center', color: '#666', fontSize: 12 },
});