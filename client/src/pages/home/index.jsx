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
// import { isOverflown } from "@mui/x-data-grid/utils/domUtils"; // not sure what this is for

// database functions from api file
import { getProjects, getProject, getTasks, getTask } from "../../api.js";
// import { set } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [projects, setProjects] = useState([]);
  const [numbOfProjects, setNumbOfProjects] = useState("##");
  const [tasks, setTasks] = useState([]);
  const [numbOfTasks, setNumbOfTasks] = useState("##");
  const [targetProject, setTargetProject] = useState("week");

  useEffect(() => {
    // Load projects from database into useState variable
    async function loadProjects() {
      const dataProjects = await getProjects();

      if (dataProjects) {
        setProjects(dataProjects);
        setNumbOfProjects(dataProjects.length);
        setTargetProject(dataProjects[0].projectName);
      }
    }

    // Load tasks from database into useState variable
    async function loadTasks() {
      const dataTasks = await getTasks();

      if (dataTasks) {
        console.log(dataTasks);
        setTasks(dataTasks);
        setNumbOfTasks(dataTasks.length);
      }
    }

    loadProjects();
    loadTasks();
  }, []);

  // Change to projects later ***
  const handleTargetProjectChange = (event) => {
    setTargetProject(event.target.value);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("User");
    navigate("/");
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
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
          </Button>
          <Button variant="contained" onClick={handleLogout}>
            Log out
          </Button>
        </Box>
      </Box>
      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="130px"
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
            title="5d 12h 23m"
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
            title="4h 32m"
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
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
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
                  value={targetProject}
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
                  {/* <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="quarter">This Quarter</MenuItem>
                  <MenuItem value="year">This Year</MenuItem> */}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box height="240px" mt="-20px">
            <LineChart isDashboard={true} />
          </Box>
        </Box>

        {/* CALENDAR EVENTS */}
        <Box
          gridColumn="span 5"
          gridRow="span 2"
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
          {mockTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.date}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${transaction.cost}
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

        <Box
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
        </Box>

        {/*  */}
      </Box>
    </Box>
  );
};

export default Dashboard;
