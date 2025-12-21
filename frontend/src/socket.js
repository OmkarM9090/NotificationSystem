import { io } from "socket.io-client";

const BACKEND_URL = "http://localhost:5000";

export const connectSocket = (token) => {
  return io(BACKEND_URL, {
    auth: {
      token
    }
  });
};
