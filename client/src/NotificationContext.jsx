import React, { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        type: "info", // info, success, warning, error
    });

    const showNotification = useCallback((message, type = "info") => {
        setNotification({ open: true, message, type });
    }, []);

    const handleClose = () => {
        setNotification({ ...notification, open: false });
    };

    return (
        <NotificationContext.Provider value={showNotification}>
            {children}
            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={handleClose} severity={notification.type} variant="filled">
                    {notification.message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
