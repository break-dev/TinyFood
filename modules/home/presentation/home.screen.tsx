import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLogout } from "../logic/use-logout";

export const HomeScreen = () => {
  const { isLoading, handleLogout } = useLogout();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.abstractTop} />

      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>¡Bienvenido!</Text>
          <Text style={styles.userName}>{""}</Text>
          <Text style={styles.userEmail}>{""}</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>🚪</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardEmoji}>🥦</Text>
          <Text style={styles.cardTitle}>Tu despensa está lista</Text>
          <Text style={styles.cardSubtitle}>
            Próximamente podrás registrar alimentos con una foto y recibir
            sugerencias de recetas personalizadas.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  abstractTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#9ca3af",
    marginBottom: 4,
  },
  userName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: "#9ca3af",
  },
  logoutBtn: {
    width: 48,
    height: 48,
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
  },
});
