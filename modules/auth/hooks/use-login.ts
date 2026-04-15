import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { AuthService } from '../services/auth.service';

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
    const response = await AuthService.loginWithEmail({ email, password });
    setIsLoading(false);

    if (response.success && response.data) {
      router.replace('/home');
    } else {
      Alert.alert('Error al iniciar sesión', response.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) throw new Error('No se pudo obtener el token de Google.');

      const response = await AuthService.loginWithGoogle(idToken);
      setIsLoading(false);

      if (response.success && response.data) {
        router.replace('/home');
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('Aviso', 'Inicio de sesión con Google cancelado o fallido.');
    }
  };

  const goToRegister = () => router.push('/register');

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleLogin,
    handleGoogleLogin,
    goToRegister,
  };
}
