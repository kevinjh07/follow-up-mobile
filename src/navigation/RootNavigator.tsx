import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthGate } from './authGuard';
import { LoginScreen } from '@features/auth';
import { ForgotPasswordScreen } from '@features/auth/screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from '@features/auth/screens/ResetPasswordScreen';
import { ActivateAccountScreen } from '@features/auth/screens/ActivateAccountScreen';
import { ChangePasswordScreen } from '@features/users/screens/ChangePasswordScreen';
import { UsersScreen } from '@features/users/screens/UsersScreen';
import { MainTabs } from './MainTabs';
import { navigationRef } from './navigationRef';
import type { RootStackParamList } from '@navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <AuthGate>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{ title: 'Recuperar Senha' }}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPasswordScreen}
            options={{ title: 'Nova Senha' }}
          />
          <Stack.Screen
            name="ActivateAccount"
            component={ActivateAccountScreen}
            options={{ title: 'Ativar Conta' }}
          />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePasswordScreen}
            options={{ title: 'Alterar Senha', headerShown: true }}
          />
          <Stack.Screen
            name="Users"
            component={UsersScreen}
            options={{ title: 'Usuários', headerShown: true }}
          />
        </Stack.Navigator>
      </AuthGate>
    </NavigationContainer>
  );
}

export default RootNavigator;
