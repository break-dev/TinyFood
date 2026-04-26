import { Redirect } from "expo-router";
import { routes } from "../common/utils/variables/routes";
import { useAuthStore } from "../common/stores/auth.store";

export default function Index() {
  const { usuario, isInitialized } = useAuthStore();

  if (!isInitialized) return null;

  return <Redirect href={(usuario ? routes.home : routes.auth) as any} />;
}
