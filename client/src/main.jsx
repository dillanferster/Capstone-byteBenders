// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./tailwind.css";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { msalInstance } from "./outlook/authConfig"; // Import the initialized MSAL instance
import { MsalProvider } from "@azure/msal-react"; // Optional, if you install msal-react for simplified context

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </BrowserRouter>
  </React.StrictMode>
);
