import React, { createContext, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

const socket = io("http://localhost:3000", {
  transports: ["websocket", "polling"], // Force WebSocket transport
  reconnection: true, // Enable reconnection
  reconnectionAttempts: 5, // Retry up to 5 times
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
  );
};
