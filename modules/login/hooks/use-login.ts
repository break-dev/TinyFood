import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { LoginService } from '../services/login.service';
import { LoginRequest } from '../services/requests';

export function useLogin() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Incompleto', 'Ingresa tu correo y contraseña.');
      return;
    }

    setIsLoading(true);
    const payload: LoginRequest = { email, password };

    const response = await LoginService.authenticate(payload, () => {
      setIsLoading(false);
    });

    if (response.success) {
      // Almacenar el token localmente según preferencia (ej. SecureStore)
      router.replace('/home');
    } else {
      Alert.alert('Error', response.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      // Faltarían inicializar las librerías nativas con GoogleSignin.configure({...})
      // import { GoogleSignin } from '@react-native-google-signin/google-signin';
      // await GoogleSignin.hasPlayServices();
      // const userInfo = await GoogleSignin.signIn();
      const mockedToken = 'google-123';
      
      const payload: LoginRequest = { token: mockedToken };
      const response = await LoginService.authenticate(payload, () => {
        setIsLoading(false);
      });
      
      if (response.success) {
        router.replace('/home');
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('Aviso', 'Inicio de sesión por Google cancelado o fallido.');
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleLogin,
    handleGoogleLogin,
  };
}
