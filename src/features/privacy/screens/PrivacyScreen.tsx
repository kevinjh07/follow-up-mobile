import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Appbar, Card, Title, Divider, TextInput } from 'react-native-paper';
import { useMutation } from '@tanstack/react-query';
import { exportPrivacyData, requestOptOut } from '@features/privacy/api/privacy.api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function PrivacyScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [phone, setPhone] = useState('');

  const exportMutation = useMutation({
    mutationFn: () => exportPrivacyData(undefined, phone || undefined),
    onSuccess: () => {
      Alert.alert(
        'Sucesso',
        'Solicitação de exportação enviada. Você receberá um e-mail com os dados.',
      );
    },
    onError: () => {
      Alert.alert('Erro', 'Não foi possível processar a solicitação.');
    },
  });

  const optOutMutation = useMutation({
    mutationFn: () => requestOptOut({ phone }),
    onSuccess: () => {
      Alert.alert('Sucesso', 'Opt-out registrado. Este número não receberá mais mensagens.');
      setPhone('');
    },
    onError: () => {
      Alert.alert('Erro', 'Não foi possível registrar o opt-out.');
    },
  });

  return (
    <View style={styles.flex}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} accessibilityLabel="Voltar" />
        <Appbar.Content title="Privacidade" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Exportar Meus Dados</Title>
            <Divider style={styles.divider} />
            <Text style={styles.description}>
              Solicite uma cópia de todos os seus dados pessoais存储 em nosso sistema.
            </Text>
            <TextInput
              label="Telefone (opcional)"
              placeholder="11999999999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.input}
              mode="outlined"
            />
            <Button
              mode="contained"
              onPress={() => exportMutation.mutate()}
              loading={exportMutation.isPending}
              disabled={exportMutation.isPending}
              style={styles.button}
            >
              Solicitar Exportação
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Bloquear Contato (Opt-out)</Title>
            <Divider style={styles.divider} />
            <Text style={styles.description}>
              Registre um número de telefone para não receber mais mensagens.
            </Text>
            <TextInput
              label="Telefone"
              placeholder="11999999999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.input}
              mode="outlined"
            />
            <Button
              mode="outlined"
              onPress={() => optOutMutation.mutate()}
              loading={optOutMutation.isPending}
              disabled={optOutMutation.isPending || !phone}
              style={styles.button}
              textColor="#b00020"
            >
              Registrar Opt-out
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Seus Direitos (LGPD)</Title>
            <Divider style={styles.divider} />
            <Text style={styles.description}>
              De acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a:
            </Text>
            <Text style={styles.rightItem}>
              • Confirmar a existência de tratamento de seus dados
            </Text>
            <Text style={styles.rightItem}>• Acessar seus dados pessoais</Text>
            <Text style={styles.rightItem}>• Corrigir dados incompletos ou desatualizados</Text>
            <Text style={styles.rightItem}>
              • Anonimizar, bloquear ou eliminar dados desnecessários
            </Text>
            <Text style={styles.rightItem}>• Solicitar a portabilidade dos dados</Text>
            <Text style={styles.rightItem}>• Eliminar dados tratados com consentimento</Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flex: 1, padding: 16 },
  card: { marginBottom: 16 },
  divider: { marginVertical: 12 },
  description: { fontSize: 14, color: '#666', marginBottom: 16 },
  input: { marginBottom: 8, backgroundColor: '#fff' },
  button: { marginTop: 8 },
  rightItem: { fontSize: 14, color: '#333', marginBottom: 8 },
});
