// client/src/components/emails/EmailDetails.jsx
import React from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Tooltip,
} from "@mui/material";
import { Reply, Delete, Create } from "@mui/icons-material";

const EmailDetails = ({ selectedEmail, onReply, onDelete, onCreateTask }) => {
  if (!selectedEmail) {
    return (
      <Paper sx={{ p: 2, height: "100%" }}>
        <Typography align="center" color="text.secondary">
          Select an email to view
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, height: "100%", overflow: "auto" }}>
      <Box>
        <Typography variant="h6">{selectedEmail.subject}</Typography>
        <Typography variant="subtitle2">
          From: {selectedEmail.from.emailAddress.name}
        </Typography>
        <Box sx={{ my: 2 }}>
          <Button startIcon={<Reply />} onClick={onReply}>
            Reply
          </Button>
          <Button startIcon={<Create />} onClick={onCreateTask}>
            Create Task
          </Button>
          <Button startIcon={<Delete />} onClick={onDelete} color="error">
            Delete
          </Button>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <div
        style={{ maxHeight: "500px" }}
        dangerouslySetInnerHTML={{ __html: selectedEmail.body.content }}
      />
    </Paper>
  );
};

export default EmailDetails;
