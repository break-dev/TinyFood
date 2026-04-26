import { Stack, Redirect } from "expo-router";
import { useAuthStore } from "../../common/stores/auth.store";
import { routes } from "../../common/utils/variables/routes";

export default function PrivateLayout() {
  const { session, isInitialized } = useAuthStore();

  if (!isInitialized) return null; // Estado de carga

  if (!session) {
    return <Redirect href={routes.auth as any} />;
  }

  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    />
  );
}
