// graphService.js
import { Client } from "@microsoft/microsoft-graph-client";
import { msalInstance } from "./authConfig";

const getToken = async () => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    const silentRequest = {
      account: accounts[0],
      scopes: ["Mail.Read"],
    };
    const tokenResponse = await msalInstance.acquireTokenSilent(silentRequest);
    return tokenResponse.accessToken;
  }
};

const graphClient = Client.init({
  authProvider: async (done) => {
    try {
      const token = await getToken();
      done(null, token);
    } catch (error) {
      done(error, null);
    }
  },
});

export const fetchEmails = async () => {
  try {
    const messages = await graphClient.api("/me/messages").get();
    return messages.value;
  } catch (error) {
    console.error("Error fetching emails:", error);
  }
};
