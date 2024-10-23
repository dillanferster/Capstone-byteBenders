// backend/emailRoutes.js

/**
 * This file contains the restful routes for authenticating users with Azure AD and fetching emails from Microsoft Graph API.
 * Author: Gigi Vu (gigi-vu2804)
 *
 */

// Import required modules
const express = require("express"); // Import express module
const emailRoutes = express.Router(); // Create a new expess router object
const cca = require("./middleware/azureAuthConfig"); // import MSAL client
require("dotenv").config({ path: "./.env" });
// const axios = require("axios");
/**
 * Route to initiate email authentication. 
 * This route generates an authentication URL using cca.getAuthCodeUrl() for the user to log in via Azure AD.
 * Reference:
 // https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-node-samples/auth-code
 */
emailRoutes.route("/email-inbox/login").get(async (req, res) => {
  try {
    const authUrl = await cca.getAuthCodeUrl({
      // getAuthCodeUrl method from MSAL Library
      scopes: ["https://graph.microsoft.com/.default"], // set scope (access to all Microsoft Graph API endpoints)
      redirectUri: process.env.AZURE_REDIRECT_URI, // the URL where the user will be redirected after authentication
      prompt: "consent",
    });

    // Log the redirect URI for debugging
    console.log("Redirect URI:", process.env.AZURE_REDIRECT_URI);

    res.redirect(authUrl); // Redirect user to Azure login page
  } catch (error) {
    console.error("Error generating auth URL:", error);
    res.status(500).send("Failed to initiate authentication");
  }
});

/**
 * Retry mechanism for acquiring token
 */
// async function acquireTokenWithRetry(tokenRequest) {
//   let retry = 0;
//   const maxRetries = 3;

//   while (retry < maxRetries) {
//     try {
//       const response = await axios.post(
//         "https://login.microsoftonline.com/consumers/oauth2/v2.0/token",
//         null,
//         {
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//           params: tokenRequest,
//         }
//       );

//       console.log("Token acquired:", response.data);
//       return response.data; // Return the token response if successful
//     } catch (error) {
//       // Retry on network-related errors
//       if (
//         error.code === "ECONNRESET" ||
//         error.code === "ENOTFOUND" ||
//         error.response?.status >= 500
//       ) {
//         console.log(
//           `Network error encountered, retrying... (${retry + 1}/${maxRetries})`
//         );
//         retry++;
//         await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
//       } else {
//         // If it's not a network error, throw the error immediately
//         throw error;
//       }
//     }
//   }
//   throw new Error("Failed to acquire token after multiple attempts");
// }

/**
 * Callback route to handle the response from Azure AD after authentication.
 * Once the user is authenticated, Azure AD redirects to this route with an authorization code.
 * For more info, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-node-samples/auth-code
 */
emailRoutes.route("/email-inbox/callback").get(async (req, res) => {
  const authorizationCode = req.query.code;
  console.log("Authorization code:", authorizationCode);

  if (!authorizationCode) {
    return res.status(400).send("Authorization code is missing");
  }
  // Request token using the authorization code from the query parameters
  // and the redirect URI used in the initial authentication request
  const tokenRequest = {
    code: authorizationCode,
    scopes: ["https://graph.microsoft.com/.default"],
    redirectUri: process.env.AZURE_REDIRECT_URI,
  };

  console.log("Token request:", JSON.stringify(tokenRequest, null, 2));

  try {
    const response = await cca.acquireTokenByCode(tokenRequest);
    console.log("Token response:", JSON.stringify(response, null, 2));

    // Store the access token in a secure HttpOnly cookie
    res.cookie("accessToken", response.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res.redirect("http://localhost:5173/email-inbox/");
  } catch (error) {
    console.error("Error acquiring token:", error);
    if (error.errorCode) {
      console.error("Error code:", error.errorCode);
      console.error("Error message:", error.errorMessage);
      console.error("Correlation ID:", error.correlationId);
    }
    if (error.response) {
      console.error("Response Error:", error.response.data);
    }
    res.status(500).send("Failed to acquire token");
  }
});

// fetch emails route
emailRoutes.route("/email-inbox/emails").get(async (req, res) => {
  const accessToken = req.cookies.accessToken; // Get the access token from the cookie
  console.log("Access token in /email-inbox/emails route:", accessToken);

  if (!accessToken) {
    return res.status(401).send("Access token missing");
  }

  try {
    // Fetch emails from Microsoft Graph API
    const response = await fetch(
      "https://graph.microsoft.com/v1.0/me/messages",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    console.log("Graph API response status:", response.status);
    console.log("Graph API response data:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(
        `Graph API error: ${response.status} ${response.statusText}`
      );
    }

    res.json(data.value);
  } catch (error) {
    console.error(
      "Error fetching emails from Microsoft Graph API:",
      error.message
    );
    res.status(500).send("Failed to fetch emails");
  }
});

// Refresh token route
emailRoutes.route("/auth/refresh-token").post(async (req, res) => {
  const { refresh_token } = req.body;
  const tokenRequest = {
    refreshToken: refresh_token,
    scopes: ["https://graph.microsoft.com/.default"],
    clientId: process.env.AZURE_CLIENT_ID,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
  };

  try {
    const response = await cca.acquireTokenByRefreshToken(tokenRequest);
    res.json({
      access_token: response.accessToken,
      refresh_token: response.refreshToken,
    });
  } catch (error) {
    console.error("Failed to refresh token:", error);
    res.status(401).send("Failed to refresh token");
  }
});

/// Route to handle the front-channel logout from Azure AD
emailRoutes.route("/email/logout").get((req, res) => {
  // Check if this is a front-channel logout request
  const logoutToken = req.query.logout_token;

  // Clear the MSAL cache
  cca
    .getTokenCache()
    .clear()
    .then(() => {
      console.log("MSAL token cache cleared");
    })
    .catch((error) => {
      console.error("Error clearing MSAL token cache:", error);
    });

  // Clear the user session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error clearing session during logout:", err);
      return res.status(500).send("Logout failed");
    }

    console.log("User session cleared");

    // If it's a front-channel logout request, send a 200 OK response
    if (logoutToken) {
      return res.status(200).send("Logout successful");
    }

    // For manual logout, redirect to the login page or home page
    res.redirect("http://localhost:5173/email-inbox/");
  });
});

module.exports = emailRoutes;
