// src/components/NotificationListener.jsx
import { useEffect } from "react";
import { useSocket } from "../contexts/SocketContext";

const NotificationListener = () => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("notification", (message) => {
      console.log("Notification received:", message);
      alert(message.message); // Display the notification
    });

    return () => {
      socket.off("notification"); // Clean up the listener
    };
  }, [socket]);

  return null; // No UI is rendered by this component
};

export default NotificationListener;
