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
    });
    res.redirect(authUrl); // Redirect user to Azure login page
  } catch (error) {
    console.error("Error generating auth URL:", error);
    res.status(500).send("Failed to initiate authentication");
  }
});

/**
 * Callback route to handle the response from Azure AD after authentication.
 * Once the user is authenticated, Azure AD redirects to this route with an authorization code.
 * For more info, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-node-samples/auth-code
 */
emailRoutes.route("/email-inbox/callback").get(async (req, res) => {
  const authorizationCode = req.query.code; // This is the auth code received from Azure
  console.log("Authorization code:", authorizationCode);
  // Request token using the authorization code from the query parameters
  // and the redirect URI used in the initial authentication request
  const tokenRequest = {
    code: authorizationCode,
    scopes: [
      "https://graph.microsoft.com/Mail.Read",
      "https://graph.microsoft.com/Mail.ReadWrite",
      "https://graph.microsoft.com/Mail.Send",
      "https://graph.microsoft.com/User.Read",
    ],
    redirectUri: process.env.AZURE_REDIRECT_URI, // Ensure this matches what is in Azure App Registration
  };

  // Acquire token using the authorization code
  try {
    const response = await cca.acquireTokenByCode(tokenRequest);
    console.log("Token response:", response); // Log token response to check if it's acquired properly
    req.session.accessToken = response.accessToken; // Store access token in session
    res.redirect("http://localhost:5173/email-inbox/"); // Redirect to frontend after authentication

    // Send the accessToken to the client (in JSON format, for example)
    // res.json({ accessToken });
  } catch (error) {
    console.error("Error acquiring token:", error);
    res.status(500).send("Authentication failed");
  }
});

// fetch emails route
emailRoutes.route("/email-inbox/emails").get(async (req, res) => {
  // Get access token from session
  const accessToken = req.session.accessToken;
  console.log("Access token:", accessToken); // Access token debugging

  // Token check
  // If access token is missing, return 401 error
  if (!accessToken) {
    return res
      .status(401)
      .send("User not authenticated or access token mising");
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

    // Check if response is successful
    if (!response.ok) {
      // Return a more detailed error message
      const errorMessage = await response.text();
      throw new Error(
        `Failed to fetch emails: ${errorMessage}, status code: ${response.status}`
      );
    }

    const data = await response.json(); // Parse response data in json format
    res.json(data.value); // Return values of data object to the client side
  } catch (error) {
    console.error(
      "Error fetching emails from Microsoft Graph API:",
      error.message
    );
    res.status(500).send("Failed to fetch emails");
  }
});

// Route to handle the front-channel logout from Azure AD
emailRoutes.route("/email/logout").get((req, res) => {
  // Clear the user session when Azure logs out
  req.session.destroy((err) => {
    if (err) {
      console.error("Error clearing session during front-channel logout:", err);
      return res.status(500).send("Logout failed");
    }

    console.log("User session cleared via front-channel logout");
    res.redirect("http://localhost:5173/home"); // Redirect to the login page or home page after logout
  });
});

module.exports = emailRoutes;
