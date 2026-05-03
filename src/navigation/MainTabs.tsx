import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LeadsScreen } from '@features/leads/LeadsScreen';
import { ClinicsScreen } from '@features/clinics/ClinicsScreen';
import { ProfileScreen } from '@features/profile/ProfileScreen';

export type MainTabsParamList = {
  Leads: undefined;
  Clinics: undefined;
  ClinicDetail: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

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
        component={LeadsScreen}
        options={{
          title: 'Leads',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Clinics"
        component={ClinicsScreen}
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
