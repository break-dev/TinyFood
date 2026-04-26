import { Stack, Redirect } from "expo-router";
import { useAuthStore } from "../../common/stores/auth.store";
import { routes } from "@/common/utils/variables/routes";

export default function PublicLayout() {
  const { usuario, isInitialized } = useAuthStore();

  if (!isInitialized) return null; // Estado de carga

  if (usuario) {
    return <Redirect href={routes.home as any} />;
  }

  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    />
  );
}
