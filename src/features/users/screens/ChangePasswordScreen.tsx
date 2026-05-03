import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Title, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { changePassword } from '@features/users/api/users.api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@navigation/types';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
    newPassword: z
      .string()
      .min(8, 'Nova senha deve ter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'Nova senha deve ter pelo menos 1 letra maiúscula')
      .regex(/[0-9]/, 'Nova senha deve ter pelo menos 1 número'),
    confirmPassword: z.string().min(1, 'Confirme a nova senha'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof changePasswordSchema>;

export function ChangePasswordScreen() {
  const navigation = useNavigation<NavigationProp>();

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => changePassword(data.currentPassword, data.newPassword),
    onSuccess: () => {
      navigation.goBack();
    },
  });

  const onSubmit = (data: FormData) => mutation.mutate(data);

  return (
    <SafeAreaView style={styles.flex}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
            <Title style={styles.title}>Alterar Senha</Title>

            <Controller
              control={control}
              name="currentPassword"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View>
                  <TextInput
                    label="Senha atual"
                    placeholder="Senha atual"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    error={!!error}
                    style={styles.input}
                    mode="outlined"
                  />
                  {error && <HelperText type="error">{error.message}</HelperText>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View>
                  <TextInput
                    label="Nova senha"
                    placeholder="Nova senha"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    error={!!error}
                    style={styles.input}
                    mode="outlined"
                  />
                  {error && <HelperText type="error">{error.message}</HelperText>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View>
                  <TextInput
                    label="Confirmar nova senha"
                    placeholder="Confirmar nova senha"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    error={!!error}
                    style={styles.input}
                    mode="outlined"
                  />
                  {error && <HelperText type="error">{error.message}</HelperText>}
                </View>
              )}
            />

            {mutation.isError && (
              <HelperText type="error" style={styles.apiError}>
                Não foi possível alterar a senha. Verifique sua senha atual.
              </HelperText>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={mutation.isPending}
              disabled={mutation.isPending}
              style={styles.button}
            >
              Alterar Senha
            </Button>

            <Button mode="text" onPress={() => navigation.goBack()} style={styles.backButton}>
              Cancelar
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
  title: { fontSize: 28, textAlign: 'center', marginBottom: 32 },
  input: { marginBottom: 8, backgroundColor: '#fff' },
  button: { marginTop: 16, paddingVertical: 4 },
  backButton: { marginTop: 8 },
  apiError: { marginTop: 8 },
});
