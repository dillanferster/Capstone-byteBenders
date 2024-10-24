import React, { useState, useEffect } from "react";
import { fetchEmails, logoutEmail } from "../../api.js";
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
    setOpenDialog(false); // set to true later
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1, height: "100vh", overflow: "hidden" }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
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
            <Button color="inherit">Sign out</Button>
          ) : (
            <LoginButton />
          )}
        </Toolbar>
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
          <Grid item xs={6} sx={{ p: 2, overflowY: "auto" }}>
            {selectedEmail ? (
              <Paper elevation={0} sx={{ p: 2 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {selectedEmail.subject}
                </Typography>
                <Tooltip
                  title={
                    selectedEmail.from?.emailAddress?.address || "Unknown Email"
                  }
                >
                  <Typography variant="subtitle1" color="text.secondary">
                    From:{" "}
                    {selectedEmail.from?.emailAddress?.name || "Unknown Sender"}
                  </Typography>
                </Tooltip>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1">
                  {selectedEmail.bodyPreview}
                </Typography>
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

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            {selectedEmail?.subject}
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
          <Typography gutterBottom>{selectedEmail?.bodyPreview}</Typography>
        </DialogContent>
        <DialogActions>
          <Button startIcon={<Delete />}>Delete</Button>
          <Button startIcon={<Refresh />}>Refresh</Button>
        </DialogActions>
      </Dialog>

      <IconButton
        color="primary"
        aria-label="compose email"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          bgcolor: "primary.main",
          color: "white",
          "&:hover": { bgcolor: "primary.dark" },
        }}
      >
        <Create />
      </IconButton>
    </Box>
  );
};

export default EmailPage;
