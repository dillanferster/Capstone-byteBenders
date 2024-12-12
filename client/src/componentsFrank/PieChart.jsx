import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";

const PieChart = ({ data, isUserSpecific = false, userId = "Alex" }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!data) return <div>Loading...</div>;

  // Filter data based on whether it's user specific or team view
  const filteredData = isUserSpecific
    ? data.filter((task) => task.assignedTo === userId)
    : data;

  // Transform tasks data into the format needed for the pie chart
  const chartData = [
    {
      id: "Completed",
      value: filteredData.filter((task) => task.taskStatus === "Completed")
        .length,
      color: colors.greenAccent[500],
    },
    {
      id: "In Progress",
      value: filteredData.filter(
        (task) =>
          task.taskStatus === "In Progress" || task.taskStatus === "Paused"
      ).length,
      color: colors.blueAccent[400],
    },
    {
      id: "Not Started",
      value: filteredData.filter((task) => task.taskStatus === "Not Started")
        .length,
      color: colors.blueAccent[400],
    },
  ];

  // Only proceed if we have values
  const total = chartData.reduce((sum, entry) => sum + entry.value, 0);
  if (total === 0) return <div>No data to display</div>;

  // Add percentages to the data
  const dataWithPercentages = chartData.map((d) => {
    const percentage = Math.round((d.value / total) * 100);
    return {
      ...d,
      value: d.value,
      percentage: percentage,
    };
  });

  return (
    <div style={{ height: "100%", minHeight: "160px" }}>
      <ResponsivePie
        data={dataWithPercentages}
        theme={{
          axis: {
            domain: {
              line: {
                stoke: colors.grey[100],
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
        }}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        enableArcLabels={true}
        arcLabel={(d) => `${d.data.id}\n${d.data.percentage}%`}
        arcLabelsTextColor={colors.grey[100]}
        arcLabelsSkipAngle={10}
        enableArcLinkLabels={false}
        colors={({ data }) => data.color}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
      />
    </div>
  );
};

export default PieChart;
