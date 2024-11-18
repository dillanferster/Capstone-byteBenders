import { useState, useEffect } from "react";
import { Box, TextField, Button, Modal, Typography } from "@mui/material";

const EventModal = ({
  isOpen,
  handleClose,
  handleAddEvent,
  handleUpdateEvent,
  handleDeleteEvent,
  defaultStart,
  defaultEnd,
  selectedEvent,
}) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);
  const [description, setDescription] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [participants, setParticipants] = useState("");

  // Populate fields when modal opens with selected event or default values
  useEffect(() => {
    if (isOpen) {
      if (selectedEvent) {
        // For editing existing events
        setTitle(selectedEvent.title);

        // Convert the Date objects to YYYY-MM-DDTHH:mm format
        const startStr = selectedEvent.start
          .toLocaleString("sv")
          .replace(" ", "T");
        const endStr = selectedEvent.end.toLocaleString("sv").replace(" ", "T");

        setStart(startStr);
        setEnd(endStr);
        setDescription(selectedEvent.extendedProps?.description || "");
        setMeetingLink(selectedEvent.extendedProps?.meetingLink || "");
        setParticipants(
          (selectedEvent.extendedProps?.participants || []).join(", ")
        );
      } else {
        // For new events
        setTitle("");
        setStart(defaultStart);
        setEnd(defaultEnd);
        setDescription("");
        setMeetingLink("");
        setParticipants("");
      }
    }
  }, [isOpen, selectedEvent, defaultStart, defaultEnd]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = {
      title,
      start,
      end,
      description,
      meetingLink,
      participants: participants.split(",").map((email) => email.trim()),
    };
    if (selectedEvent) {
      handleUpdateEvent(eventData);
    } else {
      handleAddEvent(eventData);
    }
  };

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
          <TextField
            fullWidth
            label="Participants (comma-separated emails)"
            variant="outlined"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Save or Add Button */}
          <Button
            type="submit"
            variant="contained"
            color="warning"
            fullWidth
            sx={{ mt: 2 }}
          >
            {selectedEvent ? "Save Changes" : "Add Event"}
          </Button>

          {/* Delete Button, shown only if editing an existing event */}
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
