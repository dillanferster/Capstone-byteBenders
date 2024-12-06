import React, { useState, useEffect } from "react";
import { Box, useTheme, Typography } from "@mui/material";
import PieChart from "../../componentsFrank/PieChart";
import LineChart from "../../componentsFrank/LineChart";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { getProjects, getTasks } from "../../api.js";

const Analysis = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [projects, setProjects] = useState([]);
  const [numbOfProjects, setNumbOfProjects] = useState("##");
  const [avgTimeProject, setAvgTimeProject] = useState("##");
  const [tasks, setTasks] = useState([]);
  const [numbOfTasks, setNumbOfTasks] = useState("##");
  const [avgTimeTask, setAvgTimeTask] = useState("##");

  // Load projects/tasks from database and calculate average times
  useEffect(() => {
    // Load projects from database into useState variable
    async function loadProjTask() {
      const dataProjects = await getProjects();
      const dataTasks = await getTasks();

      if (dataProjects && dataTasks) {
        // LOADING PROJECT IN THE STATE
        setProjects(dataProjects);
        setNumbOfProjects(dataProjects.length);
        // setTargetProject(dataProjects[0]);

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
            if (!task.totalTime) {
              projectTotalTime = 0;
              hasValidTasks = false;
            } else {
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
        let nonValidTasks = 0;
        dataTasks.map((task) => {
          // Extract only the number from strings like "Minutes: 35"
          if (task.totalTime !== undefined) {
            const minutes = parseFloat(task.totalTime.split(": ")[1]);
            if (!isNaN(minutes)) {
              // Make sure we got a valid number
              totalTaskTime += minutes;
            }
          } else {
            nonValidTasks++;
          }
        });
        setAvgTimeTask(
          Math.round(totalTaskTime / (dataTasks.length - nonValidTasks))
        );
      }
    }

    loadProjTask();
    // loadTasks();
  }, []);

  return (
    <Box m="20px">
      <Header title="ANALYSIS" subtitle="Full Calendar Interactive Page" />

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="60px"
        gap="20px"
      >
        {/* ROW 1 */}
        {/* Open Tasks Section with Two Pie Charts */}
        <Box
          gridColumn="span 4"
          gridRow="span 8"
          backgroundColor={colors.primary[400]}
          p="30px"
          display="flex"
          flexDirection="column"
        >
          {/* First Pie Chart */}
          <Box flex="1" display="flex" flexDirection="column">
            <Typography
              variant="h5"
              fontWeight="600"
              color={colors.grey[100]}
              mb="10px"
            >
              User Specific Performance
            </Typography>
            <Box flex="1" height="45%">
              <PieChart />
            </Box>
          </Box>

          {/* Second Pie Chart */}
          <Box flex="1" display="flex" flexDirection="column">
            <Typography
              variant="h5"
              fontWeight="600"
              color={colors.grey[100]}
              mb="10px"
              mt="10px"
            >
              Team Average
            </Typography>
            <Box flex="1" height="45%">
              <PieChart />
            </Box>
          </Box>
        </Box>

        {/* Productivity Section */}
        <Box
          gridColumn="span 8"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
          p="30px"
          display="flex"
          flexDirection="column"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
              Productivity Versus Previous Months
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <LineChart />
          </Box>
        </Box>

        {/* Future rows can be added here */}
      </Box>
    </Box>
  );
};

export default Analysis;
