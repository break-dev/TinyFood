import { io, Socket } from 'socket.io-client';

// En un MVP, puedes hardcodear la URL o usar una variable de entorno de Expo
const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false, // Lo manejamos manualmente con el hook
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});
