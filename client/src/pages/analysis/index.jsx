import React from "react";
import { Box, useTheme, Typography } from "@mui/material";
import PieChart from "../../componentsFrank/PieChart";
import LineChart from "../../componentsFrank/LineChart";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Analysis = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
