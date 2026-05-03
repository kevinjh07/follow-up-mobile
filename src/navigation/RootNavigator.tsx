import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthGate } from './authGuard';
import { LoginScreen } from '@features/auth';
import { MainTabs } from './MainTabs';
import { navigationRef } from './navigationRef';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <AuthGate>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </AuthGate>
    </NavigationContainer>
  );
}

export default RootNavigator;
