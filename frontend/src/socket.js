import { io } from "socket.io-client";

const socket = io(
  "https://customer-support-ticket-bot.onrender.com",
  {
    transports: ["websocket"],
  }
);

export default socket;