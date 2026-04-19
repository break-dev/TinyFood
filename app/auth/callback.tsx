import { View, ActivityIndicator, StyleSheet } from "react-native";

/**
 * Pantalla visible mientras el _layout.tsx procesa el callback OAuth.
 * La lógica del intercambio de código vive en _layout.tsx (Linking.addEventListener).
 */
export default function AuthCallback() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#f97316" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
});
