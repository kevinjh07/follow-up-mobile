import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Appbar } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClinic, updateClinic } from '@features/clinics/api/clinics.api';
import { useClinicStore } from '@features/clinics/stores/clinicStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainTabsParamList } from '@navigation/types';

type NavigationProp = NativeStackNavigationProp<MainTabsParamList>;

const clinicSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  cnpj: z.string().min(1, 'CNPJ é obrigatório'),
});

type FormData = z.infer<typeof clinicSchema>;

function ClinicFormScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { activeClinic, setActiveClinic } = useClinicStore();
  const queryClient = useQueryClient();

  const isEditing = !!activeClinic?.id;

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(clinicSchema),
    defaultValues: {
      name: activeClinic?.name || '',
      cnpj: activeClinic?.cnpj || '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) => {
      if (isEditing) {
        return updateClinic(activeClinic!.id, data);
      }
      return createClinic(data);
    },
    onSuccess: (clinic) => {
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
      if (!isEditing) {
        setActiveClinic(clinic);
      }
      navigation.goBack();
    },
    onError: () => {
      Alert.alert('Erro', 'Não foi possível salvar a clínica');
    },
  });

  const onSubmit = (data: FormData) => mutate(data);

  return (
    <View style={styles.flex}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} accessibilityLabel="Voltar" />
        <Appbar.Content title={isEditing ? 'Editar Clínica' : 'Nova Clínica'} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <View>
              <TextInput
                label="Nome da Clínica"
                placeholder="Nome"
                value={value}
                onChangeText={onChange}
                style={styles.input}
                mode="outlined"
              />
              {error && <View style={styles.errorText}>{error.message}</View>}
            </View>
          )}
        />

        <Controller
          control={control}
          name="cnpj"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <View>
              <TextInput
                label="CNPJ"
                placeholder="CNPJ"
                value={value}
                onChangeText={onChange}
                style={styles.input}
                mode="outlined"
                keyboardType="numeric"
              />
              {error && <View style={styles.errorText}>{error.message}</View>}
            </View>
          )}
        />

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isPending}
          disabled={isPending}
          style={styles.button}
          accessibilityRole="button"
          accessibilityLabel={isEditing ? 'Salvar alterações' : 'Criar clínica'}
        >
          {isEditing ? 'Salvar' : 'Criar'}
        </Button>

        {isEditing && (
          <Button
            mode="outlined"
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.button}
            accessibilityRole="button"
            accessibilityLabel="Cancelar"
          >
            Cancelar
          </Button>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 16 },
  input: { marginBottom: 8, backgroundColor: '#fff' },
  button: { marginTop: 8 },
  errorText: { color: '#b00020', fontSize: 12, marginTop: -4, marginBottom: 8, marginLeft: 8 },
});

export { ClinicFormScreen };
