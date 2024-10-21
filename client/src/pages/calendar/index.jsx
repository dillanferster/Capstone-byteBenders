/*
 * This page displays information in an accordion format for events
 *
 *
 *
 * Refference: https://www.youtube.com/watch?v=wYpCWwD1oz0&t=3528s&ab_channel=EdRoh
 *
 */

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import { formatDate } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  Alert,
  Snackbar,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import EventModal from "../../components/EventModal";
import {
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "../../api";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [defaultStart, setDefaultStart] = useState("");
  const [defaultEnd, setDefaultEnd] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch events from the backend
  const fetchEvents = async () => {
    try {
      const data = await getCalendarEvents();

      if (!data) throw new Error("Failed to fetch events");

      // Convert date strings to Date objects for FullCalendar
      const formattedEvents = data.map((event) => ({
        id: event._id,
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
        description: event.description,
        meetingLink: event.meetingLink,
        participants: event.participants,
      }));

      setCurrentEvents(formattedEvents);
    } catch (error) {
      showAlert("Failed to load events", "error");
    }
  };

  // Load events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const showAlert = (message, severity = "success") => {
    setAlert({ open: true, message, severity });
  };

  const handleDateClick = (selected) => {
    // Parse the selected date
    const startDateTime = new Date(selected.startStr);
    startDateTime.setHours(9, 0, 0, 0);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

    // Convert to 'YYYY-MM-DDTHH:MM' format for `datetime-local` input type
    const startString = startDateTime.toLocaleString("sv-SE").replace(" ", "T");
    const endString = endDateTime.toLocaleString("sv-SE").replace(" ", "T");

    setDefaultStart(startString);
    setDefaultEnd(endString);
    setSelectedDate(selected);
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const handleEventClick = (selected) => {
    setSelectedEvent(selected.event);
    setModalOpen(true);
  };

  const handleAddEvent = async (eventData) => {
    try {
      // console.log(eventData);
      const response = await createCalendarEvent(eventData);

      console.log(response);

      if (!response.ok) throw new Error("Failed to create event");

      showAlert("Event created successfully");
      setModalOpen(false);
    } catch (error) {
      showAlert("Failed to create event", "error");
    }
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      const response = await fetch(`/api/events/${selectedEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) throw new Error("Failed to update event");

      setCurrentEvents((prev) =>
        prev.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                ...eventData,
                start: new Date(eventData.start),
                end: new Date(eventData.end),
              }
            : event
        )
      );

      showAlert("Event updated successfully");
      setModalOpen(false);
    } catch (error) {
      showAlert("Failed to update event", "error");
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const response = await fetch(`/api/events/${selectedEvent.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete event");

      setCurrentEvents((prev) =>
        prev.filter((event) => event.id !== selectedEvent.id)
      );
      showAlert("Event deleted successfully");
      setModalOpen(false);
    } catch (error) {
      showAlert("Failed to delete event", "error");
    }
  };

  return (
    // Added padding 40 top and to fit until fix the sidebar and header
    <Box m="20px" pt="40px">
      <Header title="CALENDAR" subtitle="Full Calendar Interactive Page" />
      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
        >
          <Typography variant="h5">Events</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  margin: "10px 0",
                  borderRadius: "2px",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            events={currentEvents}
          />
        </Box>
      </Box>

      {/* Event Modal */}
      <EventModal
        isOpen={modalOpen}
        handleClose={() => setModalOpen(false)}
        handleAddEvent={handleAddEvent}
        handleUpdateEvent={handleUpdateEvent}
        handleDeleteEvent={handleDeleteEvent}
        defaultStart={defaultStart}
        defaultEnd={defaultEnd}
        selectedEvent={selectedEvent}
      />

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Calendar;
