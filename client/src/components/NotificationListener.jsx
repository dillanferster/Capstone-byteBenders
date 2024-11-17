// src/components/NotificationListener.jsx
import { useEffect } from "react";
import { useSocket } from "../contexts/SocketContext";

const NotificationListener = () => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Listen for all notifications
    socket.on("Notification", (data) => {
      console.log("Notification received:",data);

      // Show notification alert (you can customize this with a toast or UI component)
      alert(`Notification: ${data.message}`);
    });

    return () => {
      socket.off("Notification");
    };
  }, [socket]);

  return null; // This component does not render anything
};

export default NotificationListener;
