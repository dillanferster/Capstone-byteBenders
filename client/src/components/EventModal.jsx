import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Modal,
  Typography,
  Autocomplete,
  Avatar,
  Chip,
  CircularProgress,
} from "@mui/material";

const EventModal = ({
  isOpen,
  handleClose,
  handleAddEvent,
  handleUpdateEvent,
  handleDeleteEvent,
  defaultStart,
  defaultEnd,
  selectedEvent,
  currentUser,
}) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);
  const [description, setDescription] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [participants, setParticipants] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to format user's full name
  const formatName = (user) => {
    if (!user?.fname || !user?.lname) return "Loading...";
    return `${user.fname} ${user.lname}`;
  };

  // Helper function to get initials
  const getInitials = (user) => {
    if (!user?.fname && !user?.lname) return "?";
    return `${user.fname?.[0] || ""}${user.lname?.[0] || ""}`;
  };

  // Effect to handle currentUser initialization
  useEffect(() => {
    if (currentUser?._id) {
      setIsLoading(false);
      if (!participants.length) {
        setParticipants([currentUser]);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users/search?query=" + searchQuery);
        const data = await response.json();
        setUserOptions(
          data.filter(
            (user) => currentUser?._id && user._id !== currentUser._id
          )
        );
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    if (searchQuery && currentUser?._id) {
      fetchUsers();
    }
  }, [searchQuery, currentUser?._id]);

  useEffect(() => {
    if (isOpen && currentUser?._id) {
      if (selectedEvent) {
        setTitle(selectedEvent.title);
        const startStr = selectedEvent.start
          .toLocaleString("sv")
          .replace(" ", "T");
        const endStr = selectedEvent.end.toLocaleString("sv").replace(" ", "T");
        setStart(startStr);
        setEnd(endStr);
        setDescription(selectedEvent.extendedProps?.description || "");
        setMeetingLink(selectedEvent.extendedProps?.meetingLink || "");
        setParticipants(
          selectedEvent.extendedProps?.participants || [currentUser]
        );
      } else {
        setTitle("");
        setStart(defaultStart);
        setEnd(defaultEnd);
        setDescription("");
        setMeetingLink("");
        setParticipants([currentUser]);
      }
    }
  }, [isOpen, selectedEvent, defaultStart, defaultEnd, currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser?._id) return;

    const eventData = {
      title,
      start,
      end,
      description,
      meetingLink,
      participants: participants.map((participant) => ({
        _id: participant._id,
        fname: participant.fname,
        lname: participant.lname,
        email: participant.email,
      })),
    };

    if (selectedEvent) {
      handleUpdateEvent(eventData);
    } else {
      handleAddEvent(eventData);
    }
  };

  if (!currentUser?._id) {
    return (
      <Modal open={isOpen} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </Modal>
    );
  }

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" mb={2}>
          {selectedEvent ? "Edit Event" : "Add New Event"}
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* ... rest of your form fields ... */}
          <TextField
            fullWidth
            label="Event Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Start Date and Time"
            type="datetime-local"
            variant="outlined"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="End Date and Time"
            type="datetime-local"
            variant="outlined"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Meeting Link"
            variant="outlined"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Autocomplete
            multiple
            value={participants}
            onChange={(event, newValue) => {
              if (!currentUser?._id) return;
              // Ensure current user is always included
              if (!newValue.some((p) => p._id === currentUser._id)) {
                newValue.unshift(currentUser);
              }
              setParticipants(newValue);
            }}
            inputValue={searchQuery}
            onInputChange={(event, newInputValue) =>
              setSearchQuery(newInputValue)
            }
            options={userOptions}
            getOptionLabel={(option) =>
              `${formatName(option)} (${option?.email || ""})`
            }
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Participants"
                variant="outlined"
                sx={{ mb: 2 }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  key={option._id}
                  avatar={<Avatar>{getInitials(option)}</Avatar>}
                  label={`${formatName(option)}`}
                  {...getTagProps({ index })}
                  disabled={option._id === currentUser._id}
                />
              ))
            }
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option._id}>
                <Avatar sx={{ mr: 1 }}>{getInitials(option)}</Avatar>
                {formatName(option)} ({option.email})
              </Box>
            )}
          />

          <Button
            type="submit"
            variant="contained"
            color="warning"
            fullWidth
            sx={{ mt: 2 }}
          >
            {selectedEvent ? "Save Changes" : "Add Event"}
          </Button>

          {selectedEvent && (
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={handleDeleteEvent}
              sx={{ mt: 2 }}
            >
              Delete Event
            </Button>
          )}
        </form>
      </Box>
    </Modal>
  );
};

export default EventModal;
