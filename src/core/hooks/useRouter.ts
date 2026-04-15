import { useRouter as useExpoRouter } from 'expo-router';

export const useRouter = () => {
  const router = useExpoRouter();

  const navigate = (path: string) => {
    router.push(path as any);
  };

  const replace = (path: string) => {
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
