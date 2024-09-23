// main.jsx
import React, { StrictMode } from "react"; // Import React and StrictMode
import { createRoot } from "react-dom/client"; // Import createRoot from react-dom/client
import App from "./App.jsx"; // Import your main App component
import "./index.css"; // Import custom CSS
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

// Render the App component to the root element
createRoot(document.getElementById("root")).render(
  // Wrap the App component in StrictMode for additional checks during development
  <StrictMode>
    <App />
  </StrictMode>
);
