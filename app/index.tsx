import { Redirect } from "expo-router";
import { routes } from "../common/variables/routes";

export default function Index() {
  return <Redirect href={routes.auth as any} />;
}
