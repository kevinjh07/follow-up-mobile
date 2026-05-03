import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Dialog,
  Portal,
  Text,
  Button,
  TextInput,
  HelperText,
  SegmentedButtons,
} from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser, updateUser, type User } from '@features/users/api/users.api';

const userSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  role: z.enum(['ADMIN', 'ATTENDANT', 'OPS']),
});

type FormData = z.infer<typeof userSchema>;

interface UserFormDialogProps {
  visible: boolean;
  user: User | null;
  onDismiss: () => void;
}

export function UserFormDialog({ visible, user, onDismiss }: UserFormDialogProps) {
  const queryClient = useQueryClient();
  const isEditing = !!user;

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || 'ATTENDANT',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      if (isEditing) {
        return updateUser(user.id, data);
      }
      return createUser(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      reset();
      onDismiss();
    },
  });

  React.useEffect(() => {
    if (visible) {
      reset({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'ATTENDANT',
      });
    }
  }, [visible, user, reset]);

  const onSubmit = (data: FormData) => mutation.mutate(data);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</Dialog.Title>
        <Dialog.Content>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <TextInput
                  label="Nome"
                  placeholder="Nome completo"
                  value={value}
                  onChangeText={onChange}
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
            name="email"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <TextInput
                  label="E-mail"
                  placeholder="email@exemplo.com"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  keyboardType="email-address"
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
            name="role"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View style={styles.roleContainer}>
                <Text style={styles.roleLabel}>Perfil:</Text>
                <SegmentedButtons
                  value={value}
                  onValueChange={onChange}
                  buttons={[
                    { value: 'ATTENDANT', label: 'Atendente' },
                    { value: 'ADMIN', label: 'Admin' },
                    { value: 'OPS', label: 'Ops' },
                  ]}
                  style={styles.segmented}
                />
                {error && <HelperText type="error">{error.message}</HelperText>}
              </View>
            )}
          />

          {mutation.isError && (
            <HelperText type="error" style={styles.apiError}>
              Não foi possível salvar o usuário.
            </HelperText>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancelar</Button>
          <Button
            onPress={handleSubmit(onSubmit)}
            loading={mutation.isPending}
            disabled={mutation.isPending}
          >
            {isEditing ? 'Salvar' : 'Criar'}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  input: { marginBottom: 8, backgroundColor: '#fff' },
  roleContainer: { marginTop: 8 },
  roleLabel: { fontSize: 14, marginBottom: 8, color: '#666' },
  segmented: { marginBottom: 8 },
  apiError: { marginTop: 8 },
});
