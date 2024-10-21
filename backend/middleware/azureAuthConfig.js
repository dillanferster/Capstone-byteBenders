// backend/middleware/azureAuthConfig.js
const { ConfidentialClientApplication } = require("@azure/msal-node"); // imports ConfidentialClientApplication class from msal-node library
require("dotenv").config({ path: "./.env" }); // imports dotenv , loads the environment variables from .env file

/**
 * This file configures the Microsoft Authentication Library (MSAL) to authenticate users using Azure AD.
 * Author: Gigi Vu (gigi-vu2804)
 */
/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL Node configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md
 */
const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
  },
  cache: {
    // Cache configuration
    cacheLocation: "sessionStorage", // or 'localStorage'
    storeAuthStateInCookie: true, // Set this to 'true' if you are having issues on IE11 or Edge
  },
};

/**
 * Initialize a confidential client application instance.
 * used across the application for authenticating users.
 * This holds sensitive information (like the client secret), making it suitable for server-side authentication.
 * For more info, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/initialize-confidential-client-application.md
 */

const cca = new ConfidentialClientApplication(msalConfig);

module.exports = cca;
