import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRegister } from '../hooks/use-register';

export const RegisterScreen = () => {
  const {
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
  } = useRegister();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.abstractCircle} />

        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>T</Text>
          </View>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Únete y reduce el desperdicio</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre completo</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
              placeholder="Tu nombre"
              placeholderTextColor="#9ca3af"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="tu@correo.com"
              placeholderTextColor="#9ca3af"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#9ca3af"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar contraseña</Text>
            <TextInput
              style={[
                styles.input,
                confirmPassword.length > 0 &&
                  password !== confirmPassword &&
                  styles.inputError,
              ]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="new-password"
              placeholder="Repite tu contraseña"
              placeholderTextColor="#9ca3af"
              editable={!isLoading}
            />
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <Text style={styles.errorText}>Las contraseñas no coinciden</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.buttonPrimary, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonPrimaryText}>Crear cuenta</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>O continuar con</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.buttonGoogle}
          onPress={handleGoogleRegister}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.googleIconPlaceholder}>G</Text>
          <Text style={styles.buttonGoogleText}>Registrarse con Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginRow}
          onPress={goToLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
          <Text style={styles.loginLink}>Inicia sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  abstractCircle: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(251, 146, 60, 0.12)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoBadge: {
    width: 72,
    height: 72,
    backgroundColor: '#f97316',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '900',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '500',
  },
  form: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111827',
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  buttonPrimary: {
    backgroundColor: '#f97316',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonPrimaryText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    color: '#9ca3af',
    paddingHorizontal: 16,
    fontWeight: '500',
  },
  buttonGoogle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    height: 56,
    marginBottom: 24,
  },
  googleIconPlaceholder: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ef4444',
    marginRight: 10,
  },
  buttonGoogleText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '700',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#6b7280',
    fontSize: 14,
  },
  loginLink: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: '700',
  },
});
