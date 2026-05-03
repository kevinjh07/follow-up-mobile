import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme, List } from 'react-native-paper';
import { useAuthStore } from '@core/stores/authStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function ProfileScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  function handleLogout() {
    logout();
  }

  function handleChangePassword() {
    navigation.navigate('ChangePassword');
  }

  function handleManageUsers() {
    navigation.navigate('Users');
  }

  function handlePrivacy() {
    navigation.navigate('Privacy');
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={styles.name}>{user?.name || 'Usuário'}</Text>
        <Text style={styles.email}>{user?.email || ''}</Text>
        <Text style={styles.role}>Perfil: {user?.role || 'N/A'}</Text>
      </View>

      <List.Section>
        <List.Item
          title="Alterar Senha"
          left={(props) => <List.Icon {...props} icon="lock" />}
          onPress={handleChangePassword}
        />
        {isAdmin && (
          <List.Item
            title="Gerenciar Usuários"
            left={(props) => <List.Icon {...props} icon="account-group" />}
            onPress={handleManageUsers}
          />
        )}
        <List.Item
          title="Privacidade"
          left={(props) => <List.Icon {...props} icon="shield-account" />}
          onPress={handlePrivacy}
        />
        <List.Item title="Sobre" left={(props) => <List.Icon {...props} icon="information" />} />
      </List.Section>

      <Button mode="outlined" onPress={handleLogout} style={styles.logoutButton}>
        Sair
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    opacity: 0.5,
  },
  logoutButton: {
    marginTop: 24,
    borderColor: '#f44336',
  },
});