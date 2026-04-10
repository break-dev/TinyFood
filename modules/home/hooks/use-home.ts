import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { HomeService } from '../services/home.service';
import { HomeItemData } from '../services/responses';

export function useHome() {
  const router = useRouter();
  
  const [metrics, setMetrics] = useState<HomeItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const response = await HomeService.fetchDashboard({ page: 1 }, () => {
      setIsLoading(false);
    });

    if (response.success && response.data) {
      setMetrics(response.data.metrics);
    } else {
      Alert.alert('Aviso', response.message);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Seguro que deseas salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sí, Salir', 
          style: 'destructive',
          onPress: () => router.replace('/')
        }
      ]
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    metrics,
    isLoading,
    refreshData: loadData,
    handleLogout
  };
}
