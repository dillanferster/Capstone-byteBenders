/*
 * Home page for the dashboard
 *
 * Displays data from the database in a dashboard format
 *
 * Uses some mock data and some real data for now
 *
 * Refference: https://www.youtube.com/watch?v=wYpCWwD1oz0&t=3528s&ab_channel=EdRoh
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Icon,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/Person";
import TrafficIcon from "@mui/icons-material/Traffic";
import LineChart from "../../componentsFrank/LineChart";
import BarChart from "../../componentsFrank/BarChart";
import GeographyChart from "../../componentsFrank/GeographyChart";
import StatBox from "../../componentsFrank/StatBox";
import ProgressCircle from "../../componentsFrank/ProgressCircle";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import TaskCard from "../../components/TaskCard";
// import { isOverflown } from "@mui/x-data-grid/utils/domUtils"; // not sure what this is for

// database functions from api file
import { getProjects, getProject, getTasks, getTask } from "../../api.js";
import { getCalendarEvents } from "../../api.js";
// import { set } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [projects, setProjects] = useState([]);
  const [numbOfProjects, setNumbOfProjects] = useState("##");
  const [avgTimeProject, setAvgTimeProject] = useState("##");
  const [tasks, setTasks] = useState([]);
  const [numbOfTasks, setNumbOfTasks] = useState("##");
  const [avgTimeTask, setAvgTimeTask] = useState("##");
  const [targetProject, setTargetProject] = useState("***");
  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    // Load projects from database into useState variable
    async function loadProjTask() {
      const dataProjects = await getProjects();
      const dataTasks = await getTasks();

      if (dataProjects && dataTasks) {
        // LOADING PROJECT IN THE STATE
        setProjects(dataProjects);
        setNumbOfProjects(dataProjects.length);
        setTargetProject(dataProjects[0]);

        // Calculate average project time
        // Inside your existing useEffect, after setting projects and before setting tasks:

        // Filter completed projects and calculate their average time
        const completedProjects = dataProjects.filter(
          (project) => project.projectStatus === "Complete"
        );

        let totalProjectTime = 0;
        let completedProjectsWithTasks = 0;

        // For each completed project
        for (const project of completedProjects) {
          let projectTotalTime = 0;
          let hasValidTasks = false;

          // Create a Set of task IDs for this project
          const projectTaskIds = new Set(
            project.TaskIdForProject.map((taskId) => taskId.toString())
          );

          // Get only the tasks that belong to this project
          const projectTasks = dataTasks.filter((task) =>
            projectTaskIds.has(task._id.toString())
          );

          // Calculate total time for all tasks in this project
          for (const task of projectTasks) {
            if (task.totalTime) {
              const minutes = parseInt(task.totalTime.split(": ")[1]);
              if (!isNaN(minutes)) {
                projectTotalTime += minutes;
                hasValidTasks = true;
              }
            }
          }

          // Only count this project if it has valid tasks with time
          if (hasValidTasks) {
            totalProjectTime += projectTotalTime;
            completedProjectsWithTasks++;
          }
        }

        // Calculate the average time (in minutes)
        const averageTime =
          completedProjectsWithTasks > 0
            ? Math.round(totalProjectTime / completedProjectsWithTasks)
            : 0;

        setAvgTimeProject(averageTime);

        // LOADING TASKS IN THE STATE
        setTasks(dataTasks);
        setNumbOfTasks(dataTasks.length);

        // Calculate average task time
        let totalTaskTime = 0;
        dataTasks.map((task) => {
          // Extract only the number from strings like "Minutes: 35"
          const minutes = parseInt(task.totalTime.split(": ")[1]);
          if (!isNaN(minutes)) {
            // Make sure we got a valid number
            totalTaskTime += minutes;
          }
        });
        setAvgTimeTask(Math.round(totalTaskTime / dataTasks.length));
      }
    }

    loadProjTask();
    // loadTasks();
  }, []);

  // Load calendar events from database into useState variable
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getCalendarEvents();

        if (!data) throw new Error("Failed to fetch events");

        const events = data.map((event) => ({
          id: event._id,
          title: event.title,
          start: event.start,
          end: event.end,
          description: event.description,
          meetingLink: event.meetingLink,
          participants: event.participants,
        }));

        setCalendarEvents(events);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvents();
  }, []);

  const handleTargetProjectChange = (event) => {
    let project = projects.find(
      (project) => project.projectName === event.target.value
    );
    console.log("Project: " + project);
    setTargetProject(project);
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          {/* <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button> */}
          {/* <Button
            variant="contained"
            onClick={handleLogout}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "5px 10px",
              borderRadius: "20px",
            }}
          >
            Log out
          </Button> */}
        </Box>
      </Box>
      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="120px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={numbOfProjects}
            subtitle="Total Ongoing Projects"
            progress="0.75"
            increase="+14%"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={avgTimeProject}
            subtitle="Average Project Time"
            progress="0.5"
            increase="-21%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={numbOfTasks}
            subtitle="Total Ongoing Tasks"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={avgTimeTask}
            subtitle="Average Task Time"
            progress="0.80"
            increase="-5%"
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}

        {/* PROJECTS - TASKS */}
        <Box
          gridColumn="span 7"
          gridRow="span 2"
          p="0 30px"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Projects - Tasks
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  key={targetProject._id}
                  value={targetProject.projectName}
                  onChange={handleTargetProjectChange}
                  displayEmpty
                  sx={{
                    color: colors.grey[100],
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: colors.grey[100],
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: colors.grey[300],
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: colors.grey[100],
                    },
                  }}
                >
                  {projects.map((project) => (
                    <MenuItem value={project.projectName}>
                      {project.projectName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box
            height="240px"
            m="10px 0 20px -8px"
            sx={{
              overflowX: "auto",
              overflowY: "hidden",
              display: "flex",
              alignItems: "stretch",
              "&::-webkit-scrollbar": {
                height: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: colors.primary[400],
              },
              "&::-webkit-scrollbar-thumb": {
                background: colors.grey[100],
                borderRadius: "4px",
              },
            }}
          >
            {tasks
              .filter((task) => task.projectId.$oid === targetProject._id.$oid)
              .map((task) => (
                <TaskCard key={task._id.$oid} task={task} />
              ))}
          </Box>
        </Box>

        {/* CALENDAR EVENTS */}
        <Box
          gridColumn="span 5"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Upcoming Events
            </Typography>
          </Box>
          {calendarEvents.map((event) => (
            <Box
              key={`${event.id}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              {/* Title Section - 33% */}
              <Box flex="1 1 33%">
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {event.title}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {formatDate(event.start, event.end)}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {event.participants.length} participants
                </Typography>
              </Box>

              {/* Description Section - ~50% */}
              <Box flex="1 1 50%" px="20px">
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="400"
                >
                  Description
                </Typography>
                <Typography color={colors.grey[100]}>
                  {event.description}
                </Typography>
              </Box>

              {/* Join Meeting Button - remaining space */}
              <Box
                flex="0 0 auto"
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                Join
              </Box>
            </Box>
          ))}
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>

        {/* <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ p: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard="true" />
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600" sx={{ mb: "15px" }}>
            Geography Based Traffic
          </Typography>
          <Box height="190px">
            <GeographyChart isDashboard="true" />
          </Box>
        </Box> */}

        {/*  */}
      </Box>
    </Box>
  );
};

export default Dashboard;

// Helper function to format date and time
// *** NEED TO ADD END DATE IF DATE IS NOT SAME DATE OR MAKE IT NOT ALLOWED WHEN ENTERING DATE ***
const formatDate = (isoString1, isoString2) => {
  const date1 = new Date(isoString1);
  const date2 = new Date(isoString2);
  // Get month name
  const month = date1.toLocaleString("en-US", { month: "short" });

  // Get day with ordinal suffix (1st, 2nd, 3rd,...)
  const day = date1.getDate();
  const ordinal = (d) => {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  // Get time in AM/PM format
  const time = date1
    .toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    .toLowerCase();
  const time2 = date2
    .toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    .toLowerCase();

  return `${month} ${day}${ordinal(day)} @ ${time}-${time2}`;
};
