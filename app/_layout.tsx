import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import '../global.css';

export default function RootLayout() {
  useEffect(() => {
    // Inicializar Google Sign-In una sola vez al arrancar la app.
    // webClientId: ID del cliente web generado en Google Cloud Console.
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" options={{ title: 'Login' }} />
      <Stack.Screen name="register" options={{ title: 'Registro' }} />
      <Stack.Screen name="home" options={{ title: 'Home' }} />
    </Stack>
  );
}
