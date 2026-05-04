import { io } from "socket.io-client";

let socket: any;
socket.on("connect", () => {
  console.log("⚡ Connected to socket:", socket.id);
});

export function getSocket() {
  if (!socket) {
    socket = io({
      path: "/api/socket",
    });
  }
  return socket;
}