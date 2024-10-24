import React, { useState, useEffect } from "react";
import {
  fetchEmails,
  logoutEmail,
  deleteEmail,
  sendEmailReply,
  sendEmail,
} from "../../api.js";
import {
  Button,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Grid,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  Delete,
  Refresh,
  Close,
  Inbox,
  Send,
  Drafts,
  Create,
  Search,
} from "@mui/icons-material";
import LoginButton from "../../components/OutlookLoginButton";

const EmailPage = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isComposing, setIsComposing] = useState(false); // New state for composing email
  const [newEmail, setNewEmail] = useState({
    to: "",
    cc: "",
    subject: "",
    content: "",
  });

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    setLoading(true);
    try {
      const emailData = await fetchEmails();
      setEmails(emailData);
      setLoggedIn(true);
    } catch (error) {
      console.error("Failed to fetch emails:", error);
      setError("Failed to load emails. Please try again.");
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      logoutEmail();
      setLoggedIn(false);
      setEmails([]);
      setError(null);
      navigate("/email-inbox");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsComposing(false); // Close composing dialog
  };

  const handleReply = async () => {
    if (!selectedEmail) return;

    const comment = prompt("Enter your reply:"); // Simple prompt for reply text
    if (!comment) return;

    try {
      await sendEmailReply(selectedEmail.id, comment);
      alert("Reply sent successfully!");
    } catch (error) {
      alert("Failed to send reply. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!selectedEmail) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this email?"
    );
    if (!confirmDelete) return;

    try {
      await deleteEmail(selectedEmail.id);
      alert("Email deleted successfully!");
      setEmails(emails.filter((email) => email.id !== selectedEmail.id)); // Remove the deleted email from the list
      setSelectedEmail(null); // Clear the selected email
    } catch (error) {
      alert("Failed to delete email. Please try again.");
    }
  };

  const handleCompose = () => {
    setIsComposing(true);
    setOpenDialog(true);
  };

  const handleSendEmail = async () => {
    try {
      await sendEmail(
        newEmail.to,
        newEmail.cc,
        newEmail.subject,
        newEmail.content
      );
      alert(`Email sent successfully to ${newEmail.to} !`);
      setNewEmail({ to: "", cc: "", subject: "", content: "" }); // Reset the form
      setOpenDialog(false);
      setIsComposing(false);
    } catch (error) {
      alert("Failed to send email. Please try again.");
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1, height: "100vh", overflow: "hidden" }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography
            variant="h3"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            Outlook
          </Typography>
          <TextField
            placeholder="Search mail"
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: <Search />,
            }}
            sx={{ mr: 2, width: 300 }}
          />
          {loggedIn ? (
            <Button color="inherit" onClick={handleLogout}>
              Sign out
            </Button>
          ) : (
            <LoginButton />
          )}
        </Toolbar>
        {loggedIn ? (
          <Toolbar sx={{ justifyContent: "space-between", padding: "0 16px" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                color="primary"
                aria-label="compose email"
                onClick={handleCompose}
                startIcon={<Create />}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": { bgcolor: "primary.dark" },
                  marginRight: 2,
                }}
              >
                New Email
              </Button>
              <Button
                color="inherit"
                aria-label="refresh"
                startIcon={<Refresh />}
                sx={{ marginRight: 2 }}
              >
                Refresh
              </Button>
              <Button
                color="inherit"
                aria-label="delete"
                startIcon={<Delete />}
                sx={{ marginRight: 2 }}
              >
                Delete
              </Button>
            </Box>
          </Toolbar>
        ) : (
          ""
        )}
      </AppBar>

      {loggedIn ? (
        <Grid container sx={{ height: "calc(100% - 64px)" }}>
          <Grid item xs={2} sx={{ borderRight: 1, borderColor: "divider" }}>
            <List>
              <ListItem button>
                <Inbox sx={{ mr: 2 }} />
                <ListItemText primary="Inbox" />
              </ListItem>
              <ListItem button>
                <Send sx={{ mr: 2 }} />
                <ListItemText primary="Sent" />
              </ListItem>
              <ListItem button>
                <Drafts sx={{ mr: 2 }} />
                <ListItemText primary="Drafts" />
              </ListItem>
            </List>
          </Grid>
          <Grid
            item
            xs={4}
            sx={{ borderRight: 1, borderColor: "divider", overflowY: "auto" }}
          >
            <List>
              {emails.map((email) => (
                <React.Fragment key={email.id}>
                  <ListItem
                    alignItems="flex-start"
                    button
                    onClick={() => handleEmailClick(email)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          noWrap
                        >
                          {email.subject}
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Tooltip
                            title={
                              email.from?.emailAddress?.address ||
                              "Unknown Email"
                            }
                          >
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                              noWrap
                            >
                              {email.from?.emailAddress?.name ||
                                "Unknown Sender"}
                            </Typography>
                          </Tooltip>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            noWrap
                          >
                            {" — " + email.bodyPreview}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          </Grid>
          <Grid item xs={6} sx={{ p: 2, overflowY: "scroll" }}>
            {selectedEmail ? (
              <Paper elevation={1} sx={{ p: 2 }}>
                {/* Email Header */}
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {selectedEmail.subject}
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Tooltip
                      title={
                        selectedEmail.from?.emailAddress?.address ||
                        "Unknown Email"
                      }
                    >
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        sx={{
                          "&:hover": {
                            backgroundColor: "action.hover",
                          },
                        }}
                      >
                        From:{" "}
                        {selectedEmail.from?.emailAddress?.name ||
                          "Unknown Sender"}
                      </Typography>
                    </Tooltip>
                    {selectedEmail.ccRecipients.length > 0 && (
                      <Tooltip
                        title={
                          selectedEmail.ccRecipients
                            .map((recipient) => recipient.emailAddress.address)
                            .join(", ") || "Unknown CC"
                        }
                      >
                        <Typography variant="subtitle1" color="text.secondary">
                          CC:{" "}
                          {selectedEmail.ccRecipients
                            .map((recipient) => recipient.emailAddress.address)
                            .join(", ")}
                        </Typography>
                      </Tooltip>
                    )}
                    <Tooltip
                      title={
                        selectedEmail.toRecipients
                          .map((recipient) => recipient.emailAddress.address)
                          .join(", ") || "Unknown To"
                      }
                    >
                      <Typography variant="subtitle1" color="text.secondary">
                        To:{" "}
                        {selectedEmail.toRecipients
                          .map((recipient) => recipient.emailAddress.address)
                          .join(", ")}
                      </Typography>
                    </Tooltip>
                    <Typography variant="subtitle1" color="text.secondary">
                      Date sent: {selectedEmail.sentDateTime || "Unknown Date"}
                    </Typography>
                  </Box>
                  {/* Email Operation Buttons */}
                  <Box>
                    <Button
                      color="info"
                      onClick={handleReply}
                      startIcon={<Send />}
                    >
                      Reply
                    </Button>
                    <Button
                      color="error"
                      onClick={handleDelete}
                      startIcon={<Delete />}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />

                {/* Email Body */}
                <div
                  style={{ maxHeight: "500px" }}
                  dangerouslySetInnerHTML={{
                    __html: selectedEmail?.body.content,
                  }}
                />
                {/* End of Email Body */}
              </Paper>
            ) : (
              <Typography align="center" color="text.secondary">
                Select an email to view
              </Typography>
            )}
          </Grid>
        </Grid>
      ) : (
        <Typography align="center" sx={{ mt: 4 }}>
          Please sign in to view your emails.
        </Typography>
      )}

      {/* Email Dialog Popup */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            {isComposing ? "Compose Email" : selectedEmail?.subject}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {isComposing ? (
            <Box component="form" noValidate autoComplete="off">
              <TextField
                fullWidth
                label="To"
                value={newEmail.to}
                onChange={(e) =>
                  setNewEmail({ ...newEmail, to: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="CC"
                value={newEmail.cc}
                onChange={(e) =>
                  setNewEmail({ ...newEmail, cc: e.target.value })
                }
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
            </Box>
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
            <Button onClick={handleSendEmail} startIcon={<Send />}>
              Send
            </Button>
          ) : (
            <>
              <Button onClick={handleDelete} startIcon={<Delete />}>
                Delete
              </Button>
              <Button startIcon={<Refresh />}>Refresh</Button>
              <Button onClick={handleReply} startIcon={<Send />}>
                Reply
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <IconButton
        color="primary"
        aria-label="compose email"
        onClick={handleCompose}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 14,
          bgcolor: "primary.main",
          color: "white",
          "&:hover": { bgcolor: "blue" },
        }}
      >
        <Create />
      </IconButton>
    </Box>
  );
};

export default EmailPage;
