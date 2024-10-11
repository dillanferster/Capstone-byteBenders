// EmailPage.js
import React, { useState, useEffect } from "react";
import { fetchEmails } from "../../outlook/graphService";
import { signIn, signOut } from "../../outlook/authService";
import Button from "@mui/material/Button";
const EmailPage = () => {
  const [emails, setEmails] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const loadEmails = async () => {
      if (loggedIn) {
        const emailData = await fetchEmails();
        setEmails(emailData);
      }
    };
    loadEmails();
  }, [loggedIn]);

  const handleLogin = async () => {
    const account = await signIn();
    if (account) {
      setLoggedIn(true);
    }
  };

  const handleLogout = () => {
    signOut();
    setLoggedIn(false);
    setEmails([]);
  };

  return (
    <div>
      <h1>Email Inbox</h1>
      {!loggedIn ? (
        <Button variant="contained" color="warning" onClick={handleLogin}>
          Sign in with Outlook
        </Button>
      ) : (
        <button onClick={handleLogout}>Sign out</button>
      )}

      {loggedIn && emails.length > 0 ? (
        <div>
          <h2>Your Emails</h2>
          <ul>
            {emails.map((email) => (
              <li key={email.id}>
                <h3>{email.subject}</h3>
                <p>From: {email.from?.emailAddress?.name}</p>
                <p>{email.bodyPreview}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        loggedIn && <p>No emails to display</p>
      )}
    </div>
  );
};

export default EmailPage;
