import React, { useState, useEffect } from "react";
import { fetchEmails, logoutEmail } from "../../api.js";
import OutlookLoginButton from "../../components/OutlookLoginButton";
import Button from "@mui/material/Button";

const EmailPage = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState(null); // Add error state

  // hook used to perform a side effect when the component mounts (i.e., when it first renders)
  // functions inside run after component renders
  useEffect(() => {
    // check login status on component mount
    // call immediately after the component renders
    const checkLoginStatus = async () => {
      setLoading(true);
      try {
        const emailData = await fetchEmails();
        setEmails(emailData);
        setLoggedIn(true);
      } catch (error) {
        console.error("Failed to fetch emails:", error);
        setError("Failed to load emails. Please try again."); // Set error message
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    // Check login status on component mount
    checkLoginStatus();
  }, []); // [] only run the effect once

  // Handle logout
  const handleLogout = () => {
    try {
      logoutEmail();
      setLoggedIn(false);
      setEmails([]);
      setError(null); // Reset error state on logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Email Inbox</h1>
      <OutlookLoginButton />
      <Button variant="contained" color="warning" onClick={handleLogout}>
        Sign out
      </Button>

      {loggedIn && emails.length > 0 ? (
        <div>
          <h2>Your Emails</h2>
          <ul>
            {emails.map((email) => (
              <li key={email.id}>
                <h3>{email.subject}</h3>
                <p>
                  From: {email.from?.emailAddress?.name || "Unknown Sender"}
                </p>
                <p>{email.bodyPreview}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : loggedIn ? (
        error ? ( // If an error occurred, display it
          <p>{error}</p>
        ) : (
          <p>No emails to display</p>
        )
      ) : (
        <p>Please sign in to view your emails.</p>
      )}
    </div>
  );
};

export default EmailPage;
