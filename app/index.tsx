import { Redirect } from "expo-router";
import { routes } from "../common/utils/variables/routes";

export default function Index() {
  return <Redirect href={routes.auth as any} />;
}
