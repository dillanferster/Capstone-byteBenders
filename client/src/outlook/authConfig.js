// authConfig.js
import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "YOUR_CLIENT_ID", // Replace with Azure app's client ID
    authority: "https://login.microsoftonline.com/common", // Or use a specific tenant ID
    redirectUri: "http://localhost:3000", // must match app settings in Azure
  },
  cache: {
    cacheLocation: "sessionStorage", // Options: "sessionStorage" or "localStorage"
    storeAuthStateInCookie: true, // Recommended for IE11 or Edge
  },
};

// Initialize the MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Export msalInstance and loginRequest as named exports
export { msalInstance, msalConfig };

// Request configuration object for login
export const loginRequest = {
  scopes: ["Mail.Read", "Mail.ReadWrite"], // adjust based on needed permissions
};
