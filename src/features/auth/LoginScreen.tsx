import React from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Text, Title, useTheme } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@core/stores/authStore';
import { useMutation } from '@tanstack/react-query';
import { api } from '@core/services/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@navigation/types';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const loginSchema = z.object({
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória').min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: LoginFormData) => api.post('/auth/login', data),
    onSuccess: (response) => {
      setUser(response.data.user);
      setToken(response.data.token);
    },
    onError: (error: unknown) => {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 401) {
        Alert.alert('Erro', 'E-mail ou senha inválidos');
      } else {
        Alert.alert('Erro', 'Não foi possível conectar ao servidor');
      }
    },
  });

  const { control, handleSubmit, formState } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginFormData) => mutate(data);

  return (
    <SafeAreaView style={styles.flex}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.container}>
          <Title style={styles.title}>Follow-Up</Title>
          <Text style={styles.subtitle}>Gestão de Clínicas</Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="E-mail"
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                keyboardType="email-address"
                error={!!formState.errors.email}
                style={styles.input}
              />
            )}
          />
          {formState.errors.email && (
            <Text style={[styles.error, { color: theme.colors.error }]}>
              {formState.errors.email.message}
            </Text>
          )}

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Senha"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                error={!!formState.errors.password}
                style={styles.input}
              />
            )}
          />
          {formState.errors.password && (
            <Text style={[styles.error, { color: theme.colors.error }]}>
              {formState.errors.password.message}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
            disabled={isPending}
            style={styles.button}
            accessibilityRole="button"
            accessibilityLabel="Entrar"
          >
            Entrar
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotButton}
          >
            Esqueci minha senha
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 16,
    paddingVertical: 4,
  },
  forgotButton: {
    marginTop: 16,
  },
  error: {
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
});
