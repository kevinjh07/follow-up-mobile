import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Text, Title, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '@features/auth/api/auth.api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@navigation/types';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

const forgotSchema = z.object({
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export function ForgotPasswordScreen() {
  const navigation = useNavigation<NavigationProp>();

  const { control, handleSubmit } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationFn: (data: ForgotFormData) => forgotPassword(data.email),
  });

  const onSubmit = (data: ForgotFormData) => mutate(data);

  if (isSuccess) {
    return (
      <SafeAreaView style={styles.flex}>
        <View style={styles.container}>
          <Title style={styles.title}>E-mail enviado</Title>
          <Text style={styles.message}>
            Enviamos um link de recuperação para seu e-mail. Verifique sua caixa de entrada.
          </Text>
          <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
            Voltar ao login
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flex}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
            <Title style={styles.title}>Recuperar senha</Title>
            <Text style={styles.subtitle}>
              Informe seu e-mail para receber um link de recuperação de senha.
            </Text>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value }, fieldState: { error: fieldError } }) => (
                <View>
                  <TextInput
                    placeholder="E-mail"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    error={!!fieldError}
                    style={styles.input}
                    mode="outlined"
                  />
                  {fieldError && <HelperText type="error">{fieldError.message}</HelperText>}
                </View>
              )}
            />

            {error && (
              <HelperText type="error" style={styles.apiError}>
                Não foi possível enviar o e-mail. Tente novamente.
              </HelperText>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={isPending}
              disabled={isPending}
              style={styles.button}
            >
              Enviar link
            </Button>

            <Button mode="text" onPress={() => navigation.goBack()} style={styles.backButton}>
              Voltar ao login
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: { fontSize: 28, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 32, color: '#666' },
  message: { fontSize: 16, textAlign: 'center', marginBottom: 32, color: '#333' },
  input: { marginBottom: 8, backgroundColor: '#fff' },
  button: { marginTop: 16, paddingVertical: 4 },
  backButton: { marginTop: 8 },
  apiError: { marginTop: 8 },
});
