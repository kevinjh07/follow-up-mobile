import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLead, updateLead } from '@features/leads/api/leads.api';
import { useLeadStore } from '@features/leads/stores/leadStore';
import type { NewLead } from '@features/leads/api/leads.api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabsParamList } from '@navigation/types';

type NavigationProp = NativeStackNavigationProp<MainTabsParamList, 'Leads'>;

const leadSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
});

type FormData = z.infer<typeof leadSchema>;

function LeadFormScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { selectedLead, setSelectedLead } = useLeadStore();
  const queryClient = useQueryClient();

  const isEditing = !!selectedLead?.id;

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: selectedLead?.name || '',
      email: selectedLead?.email || '',
      phone: selectedLead?.phone || '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) => {
      if (isEditing) {
        return updateLead(selectedLead!.id, data);
      }
      return createLead({ ...data, clinicId: selectedLead?.clinicId || '' } as NewLead);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setSelectedLead(null);
      navigation.goBack();
    },
  });

  const onSubmit = (data: FormData) => mutate(data);

  return (
    <View style={styles.flex}>
      <ScrollView style={styles.content}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Nome"
              placeholder="Nome do lead"
              value={value}
              onChangeText={onChange}
              style={styles.input}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="E-mail"
              placeholder="E-mail"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Telefone"
              placeholder="Telefone"
              value={value}
              onChangeText={onChange}
              keyboardType="phone-pad"
              style={styles.input}
            />
          )}
        />

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isPending}
          disabled={isPending}
          style={styles.button}
          accessibilityRole="button"
          accessibilityLabel={isEditing ? 'Salvar alterações' : 'Criar lead'}
        >
          {isEditing ? 'Salvar' : 'Criar'}
        </Button>

        {isEditing && (
          <Button
            mode="outlined"
            onPress={() => {
              setSelectedLead(null);
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
});

export { LeadFormScreen };
