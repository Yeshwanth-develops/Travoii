import { io, Socket } from "socket.io-client";

let socket: Socket | undefined;

export function getSocket(): Socket {
  if (!socket) {
    socket = io({
      path: "/api/socket",
    });

    socket.on("connect", () => {
      console.log("⚡ Connected to socket:", socket?.id);
    });
  }
  return socket;
}