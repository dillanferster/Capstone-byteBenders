import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";

const BarChart = ({ data, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Transform projects data into the format needed for the bar chart
  const chartData = [
    {
      status: "Complete",
      count: data.filter((project) => project.projectStatus === "Complete")
        .length,
      color: colors.greenAccent[500],
    },
    {
      status: "In Progress",
      count: data.filter((project) => project.projectStatus === "In Progress")
        .length,
      color: colors.blueAccent[400],
    },
    {
      status: "Not Started",
      count: data.filter((project) => project.projectStatus === "Not Started")
        .length,
      color: colors.redAccent[400],
    },
    {
      status: "Storage",
      count: data.filter((project) => project.projectStatus === "Storage")
        .length,
      color: colors.grey[500],
    },
  ];

  return (
    <ResponsiveBar
      data={chartData}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        tooltip: {
          container: {
            background: colors.primary[400],
            color: colors.grey[100],
          },
        },
        labels: {
          text: {
            fontSize: 16, // Increase the font size here
            fill: colors.grey[100],
          },
        },
      }}
      keys={["count"]}
      indexBy="status"
      margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={({ data }) => data.color}
      borderRadius={2}
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Status",
        legendPosition: "middle",
        legendOffset: 32,
        truncateTickAt: 0,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Number of Projects",
        legendPosition: "middle",
        legendOffset: -40,
        truncateTickAt: 0,
      }}
      enableLabel={true}
      label={(d) => d.value}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor="black"
      role="application"
      ariaLabel="Project Status Distribution"
      barAriaLabel={(e) => `${e.indexValue}: ${e.value} projects`}
    />
  );
};

export default BarChart;
