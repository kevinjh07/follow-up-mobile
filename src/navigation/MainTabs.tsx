import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LeadsScreen } from '@features/dispatch/screens/LeadsDispatchScreen';
import { LeadDetailScreen } from '@features/leads/screens/LeadDetailScreen';
import { LeadFormScreen } from '@features/leads/screens/LeadFormScreen';
import { ClinicsScreen } from '@features/clinics/screens/ClinicsScreen';
import { ClinicDetailScreen } from '@features/clinics/screens/ClinicDetailScreen';
import { ClinicFormScreen } from '@features/clinics/screens/ClinicFormScreen';
import { ProfileScreen } from '@features/profile/ProfileScreen';
import { DispatchConfirmScreen } from '@features/dispatch/screens/DispatchConfirmScreen';
import { DispatchProgressScreen } from '@features/dispatch/screens/DispatchProgressScreen';
import type { MainTabsParamList } from '@navigation/types';

type ClinicsStackParamList = {
  ClinicsList: undefined;
  ClinicDetail: undefined;
  ClinicForm: undefined;
};

type LeadsStackParamList = {
  LeadsList: undefined;
  LeadDetail: undefined;
  LeadForm: undefined;
  DispatchConfirm: undefined;
  DispatchProgress: { sessionId: string };
};

const Tab = createBottomTabNavigator<MainTabsParamList>();
const ClinicsStack = createNativeStackNavigator<ClinicsStackParamList>();
const LeadsStack = createNativeStackNavigator<LeadsStackParamList>();

function ClinicsStackScreen() {
  return (
    <ClinicsStack.Navigator screenOptions={{ headerShown: false }}>
      <ClinicsStack.Screen name="ClinicsList" component={ClinicsScreen} />
      <ClinicsStack.Screen name="ClinicDetail" component={ClinicDetailScreen} />
      <ClinicsStack.Screen name="ClinicForm" component={ClinicFormScreen} />
    </ClinicsStack.Navigator>
  );
}

function LeadsStackScreen() {
  return (
    <LeadsStack.Navigator screenOptions={{ headerShown: false }}>
      <LeadsStack.Screen name="LeadsList" component={LeadsScreen} />
      <LeadsStack.Screen name="LeadDetail" component={LeadDetailScreen} />
      <LeadsStack.Screen name="LeadForm" component={LeadFormScreen} />
      <LeadsStack.Screen name="DispatchConfirm" component={DispatchConfirmScreen} />
      <LeadsStack.Screen name="DispatchProgress" component={DispatchProgressScreen} />
    </LeadsStack.Navigator>
  );
}

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#6200ee',
      }}
    >
      <Tab.Screen
        name="Leads"
        component={LeadsStackScreen}
        options={{
          title: 'Leads',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Clinics"
        component={ClinicsStackScreen}
        options={{
          title: 'Clínicas',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="hospital-building" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}