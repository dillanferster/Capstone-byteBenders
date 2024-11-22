// client/src/components/emails/EmailList.jsx
import React from "react";
import { List, ListItem, ListItemText, Paper, Typography } from "@mui/material";

const EmailList = ({ emails, selectedEmail, onEmailClick }) => {
  return (
    <Paper sx={{ width: "300px", height: "100%", overflow: "auto" }}>
      <List>
        {emails.map((email) => (
          <ListItem
            button
            key={email.id}
            selected={selectedEmail?.id === email.id}
            onClick={() => onEmailClick(email)}
          >
            <ListItemText
              primary={email.subject}
              secondary={
                <>
                  <Typography component="span" variant="body2">
                    {email.from.emailAddress.name}
                  </Typography>
                  <br />
                  {new Date(email.receivedDateTime).toLocaleDateString()}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default EmailList;
