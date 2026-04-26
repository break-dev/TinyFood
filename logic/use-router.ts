import { useRouter as useExpoRouter } from "expo-router";
import { AppRoute } from "../common/utils/variables/routes";

export const useRouter = () => {
  const router = useExpoRouter();

  const navigate = (path: AppRoute) => {
    router.push(path as any);
  };

  const replace = (path: AppRoute) => {
    router.replace(path as any);
  };

  const back = () => {
    router.back();
  };

  return {
    navigate,
    replace,
    back,
    query: {}, // Se puede extender para manejar params tipados
  };
};
