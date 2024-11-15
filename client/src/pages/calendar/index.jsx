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
    // Parse the selected date while preserving the actual selected date
    const startDateTime = new Date(selected.start);
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
      const response = await createCalendarEvent(eventData);

      if (!response.status === 200) throw new Error("Failed to create event");

      // Add the new event to currentEvents
      const newEvent = {
        id: response.data._id, // Assuming your API returns the created event data
        title: eventData.title,
        start: new Date(eventData.start),
        end: new Date(eventData.end),
        description: eventData.description,
        meetingLink: eventData.meetingLink,
        participants: eventData.participants,
      };
      setCurrentEvents((prev) => [...prev, newEvent]);

      showAlert("Event created successfully");
      setModalOpen(false);
    } catch (error) {
      showAlert("Failed to create event", "error");
    }
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      const response = await updateCalendarEvent(selectedEvent.id, eventData);

      if (!response === 200) throw new Error("Failed to update event");

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
      const response = await deleteCalendarEvent(selectedEvent.id);

      if (!response.status === 200) throw new Error("Failed to delete event");

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
    <Box m="20px">
      <Header title="CALENDAR" subtitle="Full Calendar Interactive Page" />
      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
          display="flex"
          flexDirection="column"
          sx={{
            maxHeight: "calc(100vh - 190px)", // Adjust this value based on your layout
          }}
        >
          <Typography variant="h5" mb={2}>
            Events
          </Typography>

          {/* Scrollable container for the list */}
          <Box
            sx={{
              overflowY: "auto",
              flex: 1,
              pr: "8px",
              // Optional: Custom scrollbar styling
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: colors.primary[400],
              },
              "&::-webkit-scrollbar-thumb": {
                background: colors.greenAccent[500],
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: colors.greenAccent[400],
              },
            }}
          >
            <List>
              {currentEvents.map((event) => (
                <ListItem
                  key={event.id}
                  sx={{
                    backgroundColor: colors.greenAccent[600],
                    margin: "10px 0",
                    borderRadius: "2px",
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: "bold" }}>
                        {event.title}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        sx={{
                          fontSize: "12px",
                        }}
                      >
                        {formatDate(event.start, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                        {" - "}
                        {formatDate(event.end, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>

        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="15px">
          <style>
            {`
              /* List view container */
              .fc-list {
                background-color: ${colors.primary[400]} !important;
              }

              /* List view header */
              .fc .fc-list-sticky .fc-list-day > * {
                background-color: ${colors.primary[500]} !important;
                color: ${colors.grey[100]} !important;
              }

              /* List view items */
              .fc-list-event {
                background-color: ${colors.primary[400]} !important;
                border-color: ${colors.primary[500]} !important;
              }

              /* List view item hover */
              .fc-list-event:hover td {
                background-color: ${colors.primary[500]} !important;
              }

              /* List view text */
              .fc-list-event-title a,
              .fc-list-event-title {
                color: ${colors.grey[100]} !important;
              }

              /* List view time */
              .fc-list-event-time {
                color: ${colors.greenAccent[500]} !important;
              }

              /* Empty list view message */
              .fc-list-empty {
                background-color: ${colors.primary[400]} !important;
                color: ${colors.grey[100]} !important;
              }
            `}
          </style>
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
