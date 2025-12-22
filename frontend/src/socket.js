import { io } from "socket.io-client";

// 🔌 Socket connection utility using environment variables
// This allows easy switching between local development and production URLs
const BACKEND_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

/**
 * Connect to Socket.IO server with JWT authentication
 * @param {string} token - JWT token for authentication
 * @returns {Socket} Socket.IO instance
 */
export const connectSocket = (token) => {
  return io(BACKEND_URL, {
    auth: {
      token
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  });
};
