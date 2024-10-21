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
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import EventModal from "../../components/EventModal";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState(() => {
    try {
      // Load events from local storage on page load
      const storedEvents = JSON.parse(localStorage.getItem("calendarEvents"));
      return Array.isArray(storedEvents) ? storedEvents : [];
    } catch {
      return [];
    }
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [defaultStart, setDefaultStart] = useState("");
  const [defaultEnd, setDefaultEnd] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Save events to local storage whenever currentEvents changes
  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(currentEvents));
  }, [currentEvents]);

  const handleDateClick = (selected) => {
    // Parse the selected date
    const startDateTime = new Date(selected.startStr);
    // Set a default time for the event (e.g., 9:00 AM)
    startDateTime.setHours(9, 0, 0, 0); // 9:00 AM

    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour later

    // Convert to 'YYYY-MM-DDTHH:MM' format for `datetime-local` input type
    const startString = startDateTime.toLocaleString("sv-SE").replace(" ", "T");
    const endString = endDateTime.toLocaleString("sv-SE").replace(" ", "T");
    setDefaultStart(startString);
    setDefaultEnd(endString);
    setSelectedDate(selected);
    setSelectedEvent(null); // No selected event for new events
    setModalOpen(true);
  };

  const handleEventClick = (selected) => {
    setSelectedEvent(selected.event);
    setModalOpen(true);
  };

  const handleAddEvent = (eventData) => {
    const newEvent = {
      id: `${selectedDate.dateStr}-${eventData.title}`,
      title: eventData.title,
      start: eventData.start,
      end: eventData.end,
      description: eventData.description,
      meetingLink: eventData.meetingLink,
      participants: eventData.participants,
    };

    setCurrentEvents((prevEvents) => [...prevEvents, newEvent]);
    setModalOpen(false);
  };

  const handleUpdateEvent = (eventData) => {
    setCurrentEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === selectedEvent.id ? { ...event, ...eventData } : event
      )
    );
    setModalOpen(false);
  };

  const handleDeleteEvent = () => {
    setCurrentEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== selectedEvent.id)
    );
    setModalOpen(false);
  };

  return (
    // Added padding 40 top and to fit until fix the sidebar and header
    <Box m="20px" pt="40px">
      <Header title="CALENDAR" subtitle="Full Calendar Interactive Page" />
      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR*/}
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
        selectedEvent={selectedEvent} // Pass selected event data for editing
      />
    </Box>
  );
};

export default Calendar;
