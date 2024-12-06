import React from "react";
import { Box, useTheme } from "@mui/material";
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
        {/* Open Tasks Section */}
        <Box
          gridColumn="span 4"
          gridRow="span 8"
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
            <h3 className="text-lg font-semibold">Open Tasks</h3>
          </Box>
          <Box height="100%" width="100%">
            <PieChart />
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
            <h3 className="text-lg font-semibold">
              Productivity Versus Previous Months
            </h3>
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
