import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
import { mockPieData as data } from "../data/mockData";

const PieChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Calculate total value
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  // Transform data to include calculated percentages
  const dataWithPercentages = data.map((d) => ({
    ...d,
    formattedValue: `${Math.round((d.value / total) * 100)}%`,
    label: `${d.id}\n${Math.round((d.value / total) * 100)}%`,
  }));

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
        arcLabelsRadiusOffset={0.5}
        arcLabelsTextColor={colors.grey[100]}
        arcLabelsSkipAngle={10}
        arcLabel={(d) => d.id}
        enableArcLinkLabels={false}
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
        layers={[
          "arcs",
          "arcLabels",
          "arcLinkLabels",
          "legends",
          ({ centerX, centerY }) => {
            return dataWithPercentages.map((datum, index) => (
              <g
                key={index}
                transform={`translate(${centerX}, ${centerY})`}
                textAnchor="middle"
              >
                <text
                  y={0}
                  style={{
                    fontSize: "14px",
                    fill: colors.grey[100],
                    fontWeight: "bold",
                  }}
                >
                  {datum.formattedValue}
                </text>
              </g>
            ));
          },
        ]}
        fit={true}
      />
    </div>
  );
};

export default PieChart;
