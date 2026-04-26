import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.EXPO_PUBLIC_SOCKET_URL || "http://localhost:3000";

export const socket: Socket = io(SOCKET_URL, {
  auth: {
    token: "",
  },
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 60,
  reconnectionDelay: 1000,
  transports: ["websocket"],
});
