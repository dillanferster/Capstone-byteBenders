// authConfig.js
import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID, // Replace with Azure app's client ID
    authority:
      "https://login.microsoftonline.com/common" +
      import.meta.env.VITE_AZURE_TENANT_ID, // Or use a specific tenant ID
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI,
  },
  cache: {
    cacheLocation: "sessionStorage", // Options: "sessionStorage" or "localStorage"
    storeAuthStateInCookie: true,
  },
};

// Initialize the MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Request configuration object for login
export const loginRequest = {
  scopes: ["Mail.Read", "Mail.ReadWrite"], // adjust based on needed permissions
};

// Export msalInstance and msalConfig as named exports
export { msalInstance, msalConfig };
