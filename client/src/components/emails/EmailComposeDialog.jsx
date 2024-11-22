// client/src/components/emails/EmailComposeDialog.jsx

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const EmailComposeDialog = ({
  open,
  onClose,
  isComposing,
  newEmail,
  setNewEmail,
  handleSendEmail,
  selectedEmail,
  handleReply,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          {isComposing ? "Compose Email" : selectedEmail?.subject}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {isComposing ? (
          <form noValidate autoComplete="off">
            <TextField
              fullWidth
              label="To"
              value={newEmail.to}
              onChange={(e) => setNewEmail({ ...newEmail, to: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="CC"
              value={newEmail.cc}
              onChange={(e) => setNewEmail({ ...newEmail, cc: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Subject"
              value={newEmail.subject}
              onChange={(e) =>
                setNewEmail({ ...newEmail, subject: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Content"
              value={newEmail.content}
              onChange={(e) =>
                setNewEmail({ ...newEmail, content: e.target.value })
              }
              margin="normal"
              multiline
              rows={4}
            />
          </form>
        ) : (
          <Tooltip
            title={
              selectedEmail?.from?.emailAddress?.address || "Unknown Email"
            }
          >
            <Typography gutterBottom>
              From:{" "}
              {selectedEmail?.from?.emailAddress?.name || "Unknown Sender"}
            </Typography>
          </Tooltip>
        )}
      </DialogContent>
      <DialogActions>
        {isComposing ? (
          <Button onClick={handleSendEmail}>Send</Button>
        ) : (
          <>
            <Button onClick={handleReply}>Reply</Button>
            <Button onClick={onClose}>Close</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EmailComposeDialog;
