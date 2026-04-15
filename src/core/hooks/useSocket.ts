import { useEffect, useState } from 'react';
import { socket } from '../socket/socket.config';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      console.log('Connected to WS Server');
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log('Disconnected from WS Server');
    }

    function onConnectError(err: Error) {
      console.log('WS Connection Error:', err.message);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    // Intentar conectar al montar
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
    };
  }, []);

  const emit = (event: string, body: any, token?: string) => {
    socket.emit(event, {
        token,
        event,
        body
    });
  };

  return {
    isConnected,
    socket,
    emit
  };
};
