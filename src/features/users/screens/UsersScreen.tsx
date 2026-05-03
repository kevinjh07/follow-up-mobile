import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { Text, Appbar, FAB, Card, Chip, Searchbar, Button } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, deleteUser, type User, type UserRole } from '@features/users/api/users.api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';
import { UserFormDialog } from './UserFormDialog';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ROLE_COLORS: Record<UserRole, string> = {
  ADMIN: '#b00020',
  ATTENDANT: '#2196f3',
  OPS: '#ff9800',
};

const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  ATTENDANT: 'Atendente',
  OPS: 'Operador',
};

const ALL_ROLES: UserRole[] = ['ADMIN', 'ATTENDANT', 'OPS'];

export function UsersScreen() {
  const navigation = useNavigation<NavigationProp>();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { data: users, refetch, isRefetching } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
      Alert.alert('Erro', 'Não foi possível excluir o usuário');
    },
  });

  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    return users.filter((user) => {
      const matchesSearch =
        !searchQuery.trim() ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        selectedRoles.length === 0 || selectedRoles.includes(user.role);

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, selectedRoles]);

  const toggleRole = (role: UserRole) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowUserForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleDeleteUser = (user: User) => {
    Alert.alert(
      'Excluir Usuário',
      `Tem certeza que deseja excluir "${user.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteMutation.mutate(user.id) },
      ]
    );
  };

  const renderItem = ({ item }: { item: User }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </View>
          <Chip
            style={[styles.roleChip, { backgroundColor: ROLE_COLORS[item.role] }]}
            textStyle={styles.roleChipText}
          >
            {ROLE_LABELS[item.role]}
          </Chip>
        </View>
        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={() => handleEditUser(item)}
            compact
            style={styles.actionButton}
          >
            Editar
          </Button>
          <Button
            mode="outlined"
            onPress={() => handleDeleteUser(item)}
            compact
            textColor="#b00020"
            style={styles.actionButton}
          >
            Excluir
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.flex}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} accessibilityLabel="Voltar" />
        <Appbar.Content title="Usuários" />
      </Appbar.Header>

      <Searchbar
        placeholder="Buscar por nome ou e-mail"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={ALL_ROLES}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
          renderItem={({ item }) => (
            <Chip
              mode={selectedRoles.includes(item) ? 'flat' : 'outlined'}
              selected={selectedRoles.includes(item)}
              onPress={() => toggleRole(item)}
              style={[
                styles.filterChip,
                selectedRoles.includes(item) && { backgroundColor: ROLE_COLORS[item] },
              ]}
              textStyle={
                selectedRoles.includes(item) ? styles.chipTextSelected : { color: ROLE_COLORS[item] }
              }
            >
              {ROLE_LABELS[item]}
            </Chip>
          )}
        />
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        contentContainerStyle={filteredUsers.length === 0 ? styles.center : undefined}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>Nenhum usuário encontrado</Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAddUser}
        accessibilityLabel="Adicionar usuário"
      />

      <UserFormDialog
        visible={showUserForm}
        user={editingUser}
        onDismiss={() => setShowUserForm(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  searchbar: { margin: 8 },
  filtersContainer: { marginHorizontal: 8, marginBottom: 8 },
  filtersList: { gap: 8 },
  filterChip: { marginRight: 4 },
  chipTextSelected: { color: '#fff' },
  card: { margin: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardInfo: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  email: { fontSize: 14, color: '#666', marginTop: 2 },
  roleChip: { height: 28 },
  roleChipText: { color: '#fff', fontSize: 11 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  actionButton: { flex: 1 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
});