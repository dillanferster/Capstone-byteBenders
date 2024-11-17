// src/components/NotificationListener.jsx
import { useEffect } from "react";
import { useSocket } from "../contexts/SocketContext.jsx";

const NotificationListener = () => {
  const socket = useSocket();
    
  useEffect(() => {
    if (!socket) return;
    const handleNotification = (data) => {
        console.log('Notification received:', data);
        alert(`Notification: ${data.message}`);
    };

    socket.on('projectNotification', handleNotification);
    socket.on('taskNotification', handleNotification);

    return () => {
        socket.off('projectNotification', handleNotification);
        socket.off('taskNotification', handleNotification);
    };
}, [socket]);

 return null; // This component does not render anything
};


export default NotificationListener;
