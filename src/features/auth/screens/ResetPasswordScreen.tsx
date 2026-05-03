import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Text, Title, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '@features/auth/api/auth.api';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@navigation/types';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>;
type ResetRouteProp = RouteProp<AuthStackParamList, 'ResetPassword'>;

const resetSchema = z.object({
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirme a senha'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type ResetFormData = z.infer<typeof resetSchema>;

export function ResetPasswordScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ResetRouteProp>();
  const token = route.params?.token || '';

  const { control, handleSubmit } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationFn: (data: ResetFormData) => resetPassword(token, data.password),
    onSuccess: () => {
      // Navigate to login after short delay
      setTimeout(() => navigation.navigate('Login'), 2000);
    },
  });

  const onSubmit = (data: ResetFormData) => mutate(data);

  if (isSuccess) {
    return (
      <SafeAreaView style={styles.flex}>
        <View style={styles.container}>
          <Title style={styles.title}>Senha redefinida</Title>
          <Text style={styles.message}>
            Sua senha foi alterada com sucesso. Você será redirecionado para o login.
          </Text>
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
            <Title style={styles.title}>Nova senha</Title>
            <Text style={styles.subtitle}>
              Informe sua nova senha.
            </Text>

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value }, fieldState: { error: fieldError } }) => (
                <View>
                  <TextInput
                    label="Nova senha"
                    placeholder="Senha"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    error={!!fieldError}
                    style={styles.input}
                    mode="outlined"
                  />
                  {fieldError && (
                    <HelperText type="error">{fieldError.message}</HelperText>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value }, fieldState: { error: fieldError } }) => (
                <View>
                  <TextInput
                    label="Confirmar senha"
                    placeholder="Confirmar senha"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    error={!!fieldError}
                    style={styles.input}
                    mode="outlined"
                  />
                  {fieldError && (
                    <HelperText type="error">{fieldError.message}</HelperText>
                  )}
                </View>
              )}
            />

            {error && (
              <HelperText type="error" style={styles.apiError}>
                Não foi possível redefinir a senha. O link pode ter expirado.
              </HelperText>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={isPending}
              disabled={isPending}
              style={styles.button}
            >
              Redefinir senha
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.backButton}
            >
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