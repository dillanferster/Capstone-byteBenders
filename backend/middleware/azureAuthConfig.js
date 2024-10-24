// backend/middleware/azureAuthConfig.js
const msal = require("@azure/msal-node");
require("dotenv").config();

const config = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/consumers`,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose,
    },
  },
};

console.log("MSAL Config:", JSON.stringify(config, null, 2)); // Gigi debug log

const cca = new msal.ConfidentialClientApplication(config);

module.exports = cca;
