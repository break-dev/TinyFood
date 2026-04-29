import { Redirect } from "expo-router";
import { routes } from "../common/utils/variables/routes";
import { useAuthState } from "../common/logic/use-auth-state";

export default function Index() {
  const { usuario, isInitialized } = useAuthState();

  if (!isInitialized) return null;

  return <Redirect href={(usuario ? routes.despensa : routes.auth) as any} />;
}
