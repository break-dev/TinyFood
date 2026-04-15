import Toast from 'react-native-toast-message';

export const useNotify = () => {
  const success = (message: string, title: string = 'Éxito') => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
    });
  };

  const error = (message: string, title: string = 'Error') => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
    });
  };

  const info = (message: string, title: string = 'Información') => {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
    });
  };

  return {
    success,
    error,
    info,
  };
};
