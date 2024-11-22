// client/src/components/emails/EmailSidebar.jsx
import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import { Inbox, Send, Drafts } from "@mui/icons-material";

const EmailSidebar = ({ onFolderSelect, currentFolder }) => {
  const folders = [
    { name: "Inbox", icon: <Inbox /> },
    { name: "Sent", icon: <Send /> },
    { name: "Drafts", icon: <Drafts /> },
  ];

  return (
    <Paper sx={{ width: "200px", height: "100%" }}>
      <List>
        {folders.map((folder) => (
          <ListItem
            button
            key={folder.name}
            selected={currentFolder === folder.name}
            onClick={() => onFolderSelect(folder.name)}
          >
            <ListItemIcon>{folder.icon}</ListItemIcon>
            <ListItemText primary={folder.name} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default EmailSidebar;
