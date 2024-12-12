import React, { useState, useEffect } from "react";
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
  TextField,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material/styles";
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
import { useNavigate } from "react-router-dom";
import EmailEditMenu from "../../components/emaileditmenu";
import EmailTaskEditMenu from "../../components/emailtaskeditmenu";
import Header from "../../components/Header";
import {
  getTasks,
  createTask,
  getProjects,
  addTaskToProject,
  fetchEmails,
  logoutEmail,
  deleteEmail,
  sendEmailReply,
  sendEmail,
} from "../../api";

const EmailPage2 = () => {
  /**Theme, Color, Navigation Management */
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  /**End of Theme, Color, Navigation Management */

  /**STATE MANAGEMENT*/
  /**Email State Management */
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [newEmail, setNewEmail] = useState({
    to: "",
    cc: "",
    subject: "",
    content: "",
  });
  const [currentFolder, setCurrentFolder] = useState("inbox");
  /**End of Email State Management */

  /**Email Edit Menu - State Management */
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState("");
  const [addClicked, setAddClicked] = useState(false);
  const [editClicked, setEditClicked] = useState(false);
  const [viewClicked, setViewClicked] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  /**End of Email Edit Menu - State Management */
  /** END OF STATE MANAGEMENT */

  /**HOOKS*/
  /*Email Page - Hooks
   * This hook is used to check login status when the component mounts
   * This is to ensure that the user is logged in before fetching emails
   */
  useEffect(() => {
    handleGetEmails();
  }, []);
  /**End of Email Page - Hooks */

  /**Email Edit Menu - Hooks
   * This hook is used to load all tasks and projects when the add task button is clicked
   * This is to ensure that the tasks and projects are loaded before the user can add a task to a project
   */
  useEffect(() => {
    if (addClicked) {
      const loadAllTasks = async () => {
        const data = await getTasks();
        setTasks(data);
        console.log("Tasks:", tasks);
      };

      const loadAllProjects = async () => {
        const data = await getProjects();
        setProjects(data);
        console.log("Projects:", projects);
      };

      loadAllTasks();
      loadAllProjects();
    }
  }, [addClicked]);
  /**End of Email Edit Menu - Hooks */
  /**END OF HOOKS */

  /**FUNCTIONS*/
  /**Email Page - Functions
   * This function is used to fetch emails from the API
   * This is to ensure that the emails are fetched before the user can see them
   */
  const handleGetEmails = async () => {
    setLoading(true);
    try {
      const emailData = await fetchEmails();
      setEmails(emailData);
      setLoggedIn(true);
      setSelectedEmail(null);
    } catch (error) {
      console.error("Failed to fetch emails:", error);
      setError("Failed to load emails. Please try again.");
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    try {
      logoutEmail();
      setLoggedIn(false);
      setEmails([]);
      setError(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    console.log(selectedEmail.body.content);
  };

  // Function to close the Email Compose dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsComposing(false); // Close composing dialog
  };

  // Function to handle reply
  const handleReply = async () => {
    if (!selectedEmail) return; // If there are no email selected at all, return nothing

    const comment = prompt("Enter your reply:"); // Simple prompt for reply text
    if (!comment) return;

    try {
      await sendEmailReply(selectedEmail.id, comment);
      alert("Reply sent successfully!");
      handleGetEmails();
    } catch (error) {
      alert("Failed to send reply. Please try again.");
    }
  };

  // Function to handle delete
  const handleDelete = async () => {
    if (!selectedEmail) {
      alert("No email selected. Please select an email to delete.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this email?"
    );
    if (!confirmDelete) return;

    try {
      await deleteEmail(selectedEmail.id);
      alert("Email deleted successfully!");
      setEmails(emails.filter((email) => email.id !== selectedEmail.id)); // Remove the deleted email from the list
      setSelectedEmail(null); // Clear the selected email
      handleGetEmails();
    } catch (error) {
      alert("Failed to delete email. Please try again.");
    }
  };

  // Function to handle compose email
  const handleCompose = () => {
    setIsComposing(true);
    setOpenDialog(true);
  };

  // Function to handle send new email
  const handleSendEmail = async () => {
    try {
      await sendEmail(
        newEmail.to,
        newEmail.cc,
        newEmail.subject,
        newEmail.content
      );
      alert(`Email sent successfully to ${newEmail.to} !`); // Alert the user that the email was sent successfully
      setNewEmail({ to: "", cc: "", subject: "", content: "" }); // Reset the form
      setOpenDialog(false);
      setIsComposing(false);
      handleGetEmails();
    } catch (error) {
      alert("Failed to send email. Please try again." + error);
    }
  };

  // Function to handle folder change
  const handleFolderChange = (folder) => {
    setCurrentFolder(folder);
  };

  // // Filter emails based on current folder
  // const filteredEmails = emails.filter((email) => {
  //   if (currentFolder === "inbox") {
  //     return !email.isSent;
  //   } else if (currentFolder === "sent") {
  //     return email.isSent;
  //   }
  //   return true; // For 'drafts' or any other folder, show all emails
  // });
  //
  /**End of Email Page - Functions */

  /**Email Edit Menu - Functions */
  const handleCreateTask = async () => {
    if (!selectedEmail) return;
    setIsOpen(true);
    setAddClicked(true);
    setEditClicked(false);
    setViewClicked(false);
    console.log("Create task clicked");
  };

  const toggleForm = () => {
    setIsOpen(!isOpen);
  };
  /**End of Email Edit Menu - Functions */
  /**END OF FUNCTIONS */

  /**RENDERING*/
  // If the emails are still loading, show a loading message
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading your emails...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      className="p-5"
      style={{
        position: "relative",
        height: "calc(100% - 69px)",
      }}
    >
      {isOpen ? (
        <>
          {/* <EmailEditMenu
            toggleForm={toggleForm}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            selectedTask={selectedTask}
            createTask={createTask}
            viewClicked={viewClicked}
            setViewClicked={setViewClicked}
            addClicked={addClicked}
            setAddClicked={setAddClicked}
            editClicked={editClicked}
            setEditClicked={setEditClicked}
            projects={projects}
            tasks={tasks}
            addTaskToProjeFct={addTaskToProject}
          /> */}
          <EmailTaskEditMenu
            toggleForm={toggleForm}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            selectedTask={selectedTask}
            createTask={createTask}
            viewClicked={viewClicked}
            setViewClicked={setViewClicked}
            addClicked={addClicked}
            setAddClicked={setAddClicked}
            editClicked={editClicked}
            setEditClicked={setEditClicked}
            projects={projects}
            tasks={tasks}
            addTaskToProject={addTaskToProject}
            reloadTheGrid={() => handleGetEmails()}
          />
          <div
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Header
              title="EMAIL"
              subtitle="Manage your emails and tasks in one place!"
            />
          </div>
          <Box
            sx={{
              flexGrow: 1,
              height: "inherit",
            }}
          >
            <AppBar position="static" color="default" elevation={1}>
              <Toolbar>
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
                <Toolbar
                  sx={{ justifyContent: "space-between", padding: "0 16px" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Button
                      color="primary"
                      aria-label="compose email"
                      onClick={handleCompose}
                      startIcon={<Create />}
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        "&:hover": { bgcolor: "info.main" },
                        marginRight: 2,
                      }}
                    >
                      New Email
                    </Button>
                    <Button
                      color="inherit"
                      aria-label="refresh"
                      startIcon={<Refresh />}
                      onClick={() => handleGetEmails()}
                      sx={{ marginRight: 2 }}
                    >
                      Refresh
                    </Button>
                    <Button
                      color="inherit"
                      aria-label="delete"
                      startIcon={<Delete />}
                      sx={{ marginRight: 2 }}
                      onClick={handleDelete}
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
              <>
                <Grid2 container spacing={1} sx={{ height: "inherit" }}>
                  {/* Left Sidebar */}
                  <Grid2
                    item
                    size={1}
                    sx={{
                      height: "inherit",
                      borderRight: `1px solid ${colors.primary[800]}`,
                    }}
                  >
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
                  </Grid2>

                  {/* Middle Section - Email Preview List */}
                  <Grid2
                    item
                    size={4}
                    sx={{
                      height: "inherit",
                      borderRight: `1px solid ${colors.primary[800]}`,
                      borderColor: "divider",
                      overflow: "auto",
                    }}
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
                  </Grid2>

                  {/* Right Section - Email Details */}
                  <Grid2
                    item
                    size={7}
                    sx={{ p: 2, overflowY: "auto", height: "inherit" }}
                  >
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
                                    .map(
                                      (recipient) =>
                                        recipient.emailAddress.address
                                    )
                                    .join(", ") || "Unknown CC"
                                }
                              >
                                <Typography
                                  variant="subtitle1"
                                  color="text.secondary"
                                >
                                  CC:{" "}
                                  {selectedEmail.ccRecipients
                                    .map(
                                      (recipient) =>
                                        recipient.emailAddress.address
                                    )
                                    .join(", ")}
                                </Typography>
                              </Tooltip>
                            )}
                            <Tooltip
                              title={
                                selectedEmail.toRecipients
                                  .map(
                                    (recipient) =>
                                      recipient.emailAddress.address
                                  )
                                  .join(", ") || "Unknown To"
                              }
                            >
                              <Typography
                                variant="subtitle1"
                                color="text.secondary"
                              >
                                To:{" "}
                                {selectedEmail.toRecipients
                                  .map(
                                    (recipient) =>
                                      recipient.emailAddress.address
                                  )
                                  .join(", ")}
                              </Typography>
                            </Tooltip>
                            <Typography
                              variant="subtitle1"
                              color="text.secondary"
                            >
                              Date:{" "}
                              {selectedEmail.receivedDateTime
                                ? new Date(
                                    selectedEmail.receivedDateTime
                                  ).toLocaleString("en-US", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  })
                                : "Unknown Date and Time"}
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
                              color="warning"
                              onClick={() => {
                                const emailContent =
                                  selectedEmail?.body.content.replace(
                                    /<[^>]+>/g,
                                    ""
                                  );
                                navigator.clipboard
                                  .writeText(emailContent)
                                  .then(() => {
                                    console.log(
                                      "Email content copied to clipboard"
                                    );
                                    navigate("/emailanalysis");
                                  })
                                  .catch((err) => {
                                    console.error("Failed to copy text: ", err);
                                    alert(
                                      "Failed to copy email content. Please try again."
                                    );
                                  });
                              }}
                              startIcon={<Create />}
                            >
                              Create Project
                            </Button>
                            <Button
                              color="warning"
                              onClick={handleCreateTask}
                              startIcon={<Create />}
                            >
                              Create Task
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
                  </Grid2>
                </Grid2>
              </>
            ) : (
              <Typography align="center" sx={{ mt: 4 }}>
                Please sign in to view your emails.
              </Typography>
            )}

            {/* Email ComposeDialog Popup */}
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
                      selectedEmail?.from?.emailAddress?.address ||
                      "Unknown Email"
                    }
                  >
                    <Typography gutterBottom>
                      From:{" "}
                      {selectedEmail?.from?.emailAddress?.name ||
                        "Unknown Sender"}
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
                    <Button onClick={handleReply} startIcon={<Send />}>
                      Reply
                    </Button>
                  </>
                )}
              </DialogActions>
            </Dialog>

            {/* Compose Email Button Icon */}
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
        </>
      ) : (
        <>
          <div
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Header
              title="EMAIL"
              subtitle="Manage your emails and tasks in one place!"
            />
          </div>
          <Box
            sx={{
              flexGrow: 1,
              height: "inherit",
            }}
          >
            <AppBar position="static" color="default" elevation={1}>
              <Toolbar>
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
                <Toolbar
                  sx={{ justifyContent: "space-between", padding: "0 16px" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Button
                      color="primary"
                      aria-label="compose email"
                      onClick={handleCompose}
                      startIcon={<Create />}
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        "&:hover": { bgcolor: "info.main" },
                        marginRight: 2,
                      }}
                    >
                      New Email
                    </Button>
                    <Button
                      color="inherit"
                      aria-label="refresh"
                      startIcon={<Refresh />}
                      onClick={() => handleGetEmails()}
                      sx={{ marginRight: 2 }}
                    >
                      Refresh
                    </Button>
                    <Button
                      color="inherit"
                      aria-label="delete"
                      startIcon={<Delete />}
                      sx={{ marginRight: 2 }}
                      onClick={handleDelete}
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
              <>
                <Grid2 container spacing={1} sx={{ height: "inherit" }}>
                  {/* Left Sidebar */}
                  <Grid2
                    item
                    size={1}
                    sx={{
                      height: "inherit",
                      borderRight: `1px solid ${colors.primary[800]}`,
                    }}
                  >
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
                  </Grid2>

                  {/* Middle Section - Email Preview List */}
                  <Grid2
                    item
                    size={4}
                    sx={{
                      height: "inherit",
                      borderRight: `1px solid ${colors.primary[800]}`,
                      borderColor: "divider",
                      overflow: "auto",
                    }}
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
                  </Grid2>

                  {/* Right Section - Email Details */}
                  <Grid2
                    item
                    size={7}
                    sx={{ p: 2, overflowY: "auto", height: "inherit" }}
                  >
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
                                    .map(
                                      (recipient) =>
                                        recipient.emailAddress.address
                                    )
                                    .join(", ") || "Unknown CC"
                                }
                              >
                                <Typography
                                  variant="subtitle1"
                                  color="text.secondary"
                                >
                                  CC:{" "}
                                  {selectedEmail.ccRecipients
                                    .map(
                                      (recipient) =>
                                        recipient.emailAddress.address
                                    )
                                    .join(", ")}
                                </Typography>
                              </Tooltip>
                            )}
                            <Tooltip
                              title={
                                selectedEmail.toRecipients
                                  .map(
                                    (recipient) =>
                                      recipient.emailAddress.address
                                  )
                                  .join(", ") || "Unknown To"
                              }
                            >
                              <Typography
                                variant="subtitle1"
                                color="text.secondary"
                              >
                                To:{" "}
                                {selectedEmail.toRecipients
                                  .map(
                                    (recipient) =>
                                      recipient.emailAddress.address
                                  )
                                  .join(", ")}
                              </Typography>
                            </Tooltip>
                            <Typography
                              variant="subtitle1"
                              color="text.secondary"
                            >
                              Date:{" "}
                              {selectedEmail.receivedDateTime
                                ? new Date(
                                    selectedEmail.receivedDateTime
                                  ).toLocaleString("en-US", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  })
                                : "Unknown Date and Time"}
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
                              color="warning"
                              onClick={() => {
                                const emailContent =
                                  selectedEmail?.body.content.replace(
                                    /<[^>]+>/g,
                                    ""
                                  );
                                navigator.clipboard
                                  .writeText(emailContent)
                                  .then(() => {
                                    console.log(
                                      "Email content copied to clipboard"
                                    );
                                    navigate("/emailanalysis");
                                  })
                                  .catch((err) => {
                                    console.error("Failed to copy text: ", err);
                                    alert(
                                      "Failed to copy email content. Please try again."
                                    );
                                  });
                              }}
                              startIcon={<Create />}
                            >
                              Create Project
                            </Button>
                            <Button
                              color="warning"
                              onClick={handleCreateTask}
                              startIcon={<Create />}
                            >
                              Create Task
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
                  </Grid2>
                </Grid2>
              </>
            ) : (
              <Typography align="center" sx={{ mt: 4 }}>
                Please sign in to view your emails.
              </Typography>
            )}

            {/* Email ComposeDialog Popup */}
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
                      selectedEmail?.from?.emailAddress?.address ||
                      "Unknown Email"
                    }
                  >
                    <Typography gutterBottom>
                      From:{" "}
                      {selectedEmail?.from?.emailAddress?.name ||
                        "Unknown Sender"}
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
                    <Button onClick={handleReply} startIcon={<Send />}>
                      Reply
                    </Button>
                  </>
                )}
              </DialogActions>
            </Dialog>

            {/* Compose Email Button Icon */}
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
        </>
      )}
    </Box>
  );
};

export default EmailPage2;
