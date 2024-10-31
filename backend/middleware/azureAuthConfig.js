// backend/middleware/azureAuthConfig.js
import { ConfidentialClientApplication } from "@azure/msal-node";
import { config as dotenvConfig } from "dotenv";

// Load environment variables from .env file
dotenvConfig();

const config = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/consumers`,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
  },
  //// MSAL logger (For Debugging only)
  // system: {
  //   loggerOptions: {
  //     loggerCallback(loglevel, message, containsPii) {
  //       console.log(message);
  //     },
  //     piiLoggingEnabled: false,
  //     logLevel: msal.LogLevel.Verbose,
  //   },
  // },
};

console.log("MSAL Config:", JSON.stringify(config, null, 2)); // Gigi debug log

const cca = new ConfidentialClientApplication(config);

export default cca;
