import { useEffect, useState } from "react";
import { socket } from "@/common/config/socket.config";

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      console.log("Conectado al servidor");
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("Desconectado del servidor");
    }

    function onConnectError(err: Error) {
      console.log("Error al conectar al servidor:", err.message);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    // Intentar conectar al montar
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
    };
  }, []);

  return {
    isConnected,
    setIsConnected,
  };
};
