/*
 * This page displays information in an accordion format
 *
 * Used for a wiki page of information for the company's users
 *
 * Refference: https://www.youtube.com/watch?v=wYpCWwD1oz0&t=3528s&ab_channel=EdRoh
 *
 */

import { Box, useTheme, Typography } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const summaryStyles = {
    backgroundColor: colors.primary[400],
    "&:hover": {
      backgroundColor: colors.primary[400], // Change color on hover later ***
    },
  };

  const detailStyles = {
    backgroundColor: colors.primary[400], // Could change this to be smoother ***
  };

  return (
    <Box m="20px">
      <Header title="FAQ" subtitle="Frequently Asked Questions Page" />

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summaryStyles}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            An Important Question
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={detailStyles}>
          <Typography>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Consequuntur sit beatae nam quibusdam expedita dignissimos sequi ex
            dolor earum quasi! Cum consequatur a, ratione temporibus dolore
            voluptatibus corporis alias mollitia.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summaryStyles}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Another Important Question
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={detailStyles}>
          <Typography>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Consequuntur sit beatae nam quibusdam expedita dignissimos sequi ex
            dolor earum quasi! Cum consequatur a, ratione temporibus dolore
            voluptatibus corporis alias mollitia.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summaryStyles}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Your Favorite Question
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={detailStyles}>
          <Typography>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Consequuntur sit beatae nam quibusdam expedita dignissimos sequi ex
            dolor earum quasi! Cum consequatur a, ratione temporibus dolore
            voluptatibus corporis alias mollitia.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summaryStyles}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Some Random Question
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={detailStyles}>
          <Typography>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Consequuntur sit beatae nam quibusdam expedita dignissimos sequi ex
            dolor earum quasi! Cum consequatur a, ratione temporibus dolore
            voluptatibus corporis alias mollitia.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summaryStyles}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            The Final Question
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={detailStyles}>
          <Typography>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Consequuntur sit beatae nam quibusdam expedita dignissimos sequi ex
            dolor earum quasi! Cum consequatur a, ratione temporibus dolore
            voluptatibus corporis alias mollitia.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FAQ;
