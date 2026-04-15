import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { AuthService } from '../services/auth.service';

export function useRegister() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Incompleto', 'Completa todos los campos.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    const response = await AuthService.registerWithEmail({ name, email, password });
    setIsLoading(false);

    if (response.success) {
      if (response.data) {
        // Supabase confirmó sin email verification
        router.replace('/home');
      } else {
        // Supabase requirió confirmación de email
        Alert.alert(
          'Verifica tu correo',
          'Te enviamos un correo de confirmación. Una vez confirmado podrás iniciar sesión.',
          [{ text: 'OK', onPress: () => router.replace('/') }],
        );
      }
    } else {
      Alert.alert('Error al registrarse', response.message);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) throw new Error('No se pudo obtener el token de Google.');

      // Supabase crea el usuario si no existe, o inicia sesión si ya existe
      const response = await AuthService.loginWithGoogle(idToken);
      setIsLoading(false);

      if (response.success && response.data) {
        router.replace('/home');
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('Aviso', 'Registro con Google cancelado o fallido.');
    }
  };

  const goToLogin = () => router.replace('/');

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    handleRegister,
    handleGoogleRegister,
    goToLogin,
  };
}
