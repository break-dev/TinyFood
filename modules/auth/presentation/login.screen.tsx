import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLogin } from "../logic/use-login";

export const LoginScreen = () => {
  const { isLoading, handleGoogleLogin } = useLogin();

  return (
    <View style={styles.container}>
      <View style={styles.abstractCircle} />

      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>T</Text>
        </View>
        <Text style={styles.title}>TinyFood</Text>
        <Text style={styles.subtitle}>Reduce el desperdicio, come mejor</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.buttonGoogle, isLoading && styles.buttonDisabled]}
          onPress={handleGoogleLogin}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#374151" />
          ) : (
            <>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.buttonGoogleText}>Continuar con Google</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Solo se puede acceder con una cuenta de Google válida.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  abstractCircle: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(251, 146, 60, 0.12)",
  },
  header: {
    alignItems: "center",
    marginBottom: 56,
  },
  logoBadge: {
    width: 96,
    height: 96,
    backgroundColor: "#f97316",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  logoText: {
    color: "#ffffff",
    fontSize: 48,
    fontWeight: "900",
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
    textAlign: "center",
  },
  actions: {
    gap: 16,
  },
  buttonGoogle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    height: 56,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ef4444",
    marginRight: 10,
  },
  buttonGoogleText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "700",
  },
  disclaimer: {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 13,
    lineHeight: 18,
  },
});
