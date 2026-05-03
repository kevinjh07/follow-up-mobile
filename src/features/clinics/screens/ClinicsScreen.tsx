import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchClinics } from '@features/clinics/api/clinics.api';
import { useClinicStore } from '@features/clinics/stores/clinicStore';
import type { Clinic } from '@features/clinics/api/clinics.api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainTabsParamList } from '@navigation/types';
import { ClinicsListView } from './ClinicsListView';

type NavigationProp = NativeStackNavigationProp<MainTabsParamList, 'Clinics'>;

function ClinicsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const setActiveClinic = useClinicStore((s) => s.setActiveClinic);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: clinics,
    isLoading: _isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['clinics'],
    queryFn: fetchClinics,
  });

  const filteredClinics = React.useMemo(() => {
    if (!clinics) return [];
    if (!searchQuery.trim()) return clinics;
    const query = searchQuery.toLowerCase();
    return clinics.filter((c) => c.name.toLowerCase().includes(query) || c.cnpj.includes(query));
  }, [clinics, searchQuery]);

  const handleClinicPress = (clinic: Clinic) => {
    setActiveClinic(clinic);
    navigation.navigate('ClinicDetail');
  };

  const handleAddClinic = () => {
    setActiveClinic(null);
    navigation.navigate('ClinicForm');
  };

  return (
    <ClinicsListView
      clinics={filteredClinics}
      isLoading={_isLoading}
      isRefetching={isRefetching}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onClinicPress={handleClinicPress}
      onAddClinic={handleAddClinic}
      onRefresh={refetch}
    />
  );
}

export { ClinicsScreen };
