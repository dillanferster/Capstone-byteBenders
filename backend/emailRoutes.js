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
 * 'cca' is the MSAL client object
 * Reference source: https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-node-samples/auth-code
 * @returns void
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
 * Callback route to handle the response from Azure AD after authentication.
 * 'cca' is the MSAL client object
 * Once the user is authenticated, Azure AD redirects to this route with an authorization code.
 * Reference source: https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-node-samples/auth-code
 * @returns void
 */
emailRoutes.route("/email-inbox/callback").get(async (req, res) => {
  const authorizationCode = req.query.code;
  // Log the authorization code for debugging
  console.log("Authorization code:", authorizationCode);

  if (!authorizationCode) {
    return res.status(400).send("Authorization code is missing");
  }

  // Request token using the authorization code from the query parameters
  // and the redirect URI used in the initial authentication request
  const tokenRequest = {
    code: authorizationCode, // the authorization code from the query parameters
    scopes: ["https://graph.microsoft.com/.default"], // set scope (access to all Microsoft Graph API endpoints)
    redirectUri: process.env.AZURE_REDIRECT_URI, // the URL where the user will be redirected after authentication
  };
  // Log the token request for debugging
  console.log("Token request:", JSON.stringify(tokenRequest, null, 2));

  try {
    const response = await cca.acquireTokenByCode(tokenRequest);
    // Log the token response for debugging
    console.log("Token response:", JSON.stringify(response, null, 2));

    // Store the access token in a secure HttpOnly cookie
    // Not sure how this should be handled in the production environment
    res.cookie("accessToken", response.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // // only use secure connection in production environment
      sameSite: "strict", // prevents cookie to be sent with corss-site request - prevent CSRF attacks (forgery)
      maxAge: 3600000, // 1 hour (in milliseconds) - cookie expiration duration
    });

    res.redirect("http://localhost:5173/email-inbox/"); // Redirect user to the main email inbox page
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

/**
 * Route to fetch emails from Microsoft Graph API.
 * 'accessToken' is the access token stored in the cookie
 * This code was generated with the assistance of Claude AI.
 * The prompt used was: "Please rewrite this selection following these instructions: mention that this is from Claude AI and include the prompt use."
 * @returns void
 */
emailRoutes.route("/email-inbox/emails").get(async (req, res) => {
  const accessToken = req.cookies.accessToken; // Get the access token from the cookie
  // Log the access token for debugging
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
          Authorization: `Bearer ${accessToken}`, // Authorization header with the access token
          "Content-Type": "application/json", // Set the content type to JSON
        },
      }
    );
    const data = await response.json();

    // Log the Graph API response status and data for debugging
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

// /**
//  * Route to refresh the access token.
//  * 'refresh_token' is the refresh token stored in the cookie
//  * @returns void
//  */
// emailRoutes.route("/auth/refresh-token").post(async (req, res) => {
//   const { refresh_token } = req.body;
//   const tokenRequest = {
//     refreshToken: refresh_token,
//     scopes: ["https://graph.microsoft.com/.default"],
//     clientId: process.env.AZURE_CLIENT_ID,
//     clientSecret: process.env.AZURE_CLIENT_SECRET,
//   };

//   try {
//     const response = await cca.acquireTokenByRefreshToken(tokenRequest);
//     res.json({
//       access_token: response.accessToken,
//       refresh_token: response.refreshToken,
//     });
//   } catch (error) {
//     console.error("Failed to refresh token:", error);
//     res.status(401).send("Failed to refresh token");
//   }
// });

/// Route to handle the front-channel logout from Azure AD (DO NOT USE)
/// This route is not used in the Planzo app
/// Only applicable to let Azure AD handle user-initiated logouts on all applications linked to the same account
// emailRoutes.route("/email/logout").get((req, res) => {
//   // Check if this is a front-channel logout request
//   const logoutToken = req.query.logout_token;

//   // Clear the MSAL cache
//   cca
//     .getTokenCache()
//     .clear()
//     .then(() => {
//       console.log("MSAL token cache cleared");
//     })
//     .catch((error) => {
//       console.error("Error clearing MSAL token cache:", error);
//     });

//   // Clear the user session
//   req.session.destroy((err) => {
//     if (err) {
//       console.error("Error clearing session during logout:", err);
//       return res.status(500).send("Logout failed");
//     }

//     console.log("User session cleared");

//     // If it's a front-channel logout request, send a 200 OK response
//     if (logoutToken) {
//       return res.status(200).send("Logout successful");
//     }

//     // For manual logout, redirect to the login page or home page
//     res.redirect("http://localhost:5173/email-inbox/");
//   });
// });

/**
 * Route to send an email reply
 * 'accessToken' is the access token stored in the cookie
 * @returns void
 */
emailRoutes.route("/email-inbox/reply").post(async (req, res) => {
  const accessToken = req.cookies.accessToken; // Get the access token from the request's cookie
  const { messageId, comment } = req.body; // Get the message ID and comment from the request body

  if (!accessToken) {
    return res.status(401).send("Access token missing");
  }

  try {
    // Send the reply using Microsoft Graph API
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/messages/${messageId}/reply`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`, // Authorization header with the access token
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify({
          comment: comment,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Send email reply with Graph API error: ${response.status} ${response.statusText}`
      );
    }

    res.status(200).send("Reply sent successfully");
  } catch (error) {
    console.error("Error sending email reply:", error.message);
    res.status(500).send("Failed to send email reply");
  }
});

/**
 * Route to delete an email
 * 'accessToken' is the access token stored in the cookie
 * @returns void
 */
emailRoutes.route("/email-inbox/delete").delete(async (req, res) => {
  const accessToken = req.cookies.accessToken; // Get the access token from the request's cookie
  const { messageId } = req.body; // Get the message ID from the request body

  if (!accessToken) {
    return res.status(401).send("Access token missing");
  }

  try {
    // Delete the email using Microsoft Graph API
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/messages/${messageId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Graph API error: ${response.status} ${response.statusText}`
      );
    }

    res.status(200).send("Email deleted successfully");
  } catch (error) {
    console.error("Error deleting email:", error.message);
    res.status(500).send("Failed to delete email");
  }
});

/**
 * Route to send a new email
 * 'accessToken' is the access token stored in the cookie
 * @returns void
 */
emailRoutes.route("/email-inbox/send").post(async (req, res) => {
  const accessToken = req.cookies.accessToken; // Get the access token from the request's cookie
  const { to, cc, subject, content } = req.body; // Get the email details from the request body

  if (!accessToken) {
    return res.status(401).send("Access token missing");
  }

  try {
    // Send the email using Microsoft Graph API
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/sendMail`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            subject: subject,
            body: {
              contentType: "HTML",
              content: content,
            },
            toRecipients: to
              .split(",")
              .map((email) => ({ emailAddress: { address: email.trim() } })),
            ccRecipients: cc
              ? cc
                  .split(",")
                  .map((email) => ({ emailAddress: { address: email.trim() } }))
              : [],
          },
          saveToSentItems: "true",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Graph API error: ${response.status} ${response.statusText}`
      );
    }

    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
    res.status(500).send(`Failed to send email: ${error.message}`);
  }
});

/**
 * Manual Sign Out Route to sign out from Microsoft account
 * The Planzo app primarily handles user-initiated logouts, not front end channel logouts
 * @returns void
 */
emailRoutes.route("/email-inbox/signout").get(async (req, res) => {
  try {
    const tokenCache = cca.getTokenCache(); // Get the token cache
    const accounts = await tokenCache.getAllAccounts(); // Get all accounts from the token cache

    for (const account of accounts) {
      await tokenCache.removeAccount(account); // Remove the account from the token cache
    }

    // log the token cache cleared
    console.log("MSAL token cache cleared");

    // Clear the user session
    req.session.destroy((err) => {
      if (err) {
        console.error("Error clearing session during logout:", err);
        return res.status(500).send("Logout failed");
      }

      // Debug Log the user session cleared
      console.log("User session cleared");

      // Clear the access token cookie
      res.clearCookie("accessToken");

      // After successful logout
      const microsoftLogoutUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=${encodeURIComponent(
        "http://localhost:5173/email-inbox/"
      )}`;
      res.redirect(microsoftLogoutUrl);
    });
  } catch (error) {
    console.error("Error during signout:", error);
    res.status(500).json({ error: "Signout failed" });
  }
});

module.exports = emailRoutes;
