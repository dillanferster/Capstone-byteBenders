/*
 * Will not be used in the project, just for reference
 *
 * Refference: https://www.youtube.com/watch?v=wYpCWwD1oz0&t=3528s&ab_channel=EdRoh
 *
 */

import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../theme";
import ProgressCircle from "./ProgressCircle";

const StatBox = ({ title, subtitle, icon, progress, increase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const changeColor =
    parseInt(increase) > 0 ? colors.redAccent[600] : colors.greenAccent[600];

  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {title}
          </Typography>
        </Box>
        <Box>
          <ProgressCircle progress={progress} />
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
          {subtitle}
        </Typography>

        <Typography variant="h5" fontStyle="italic" sx={{ color: changeColor }}>
          {increase}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
