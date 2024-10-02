import React, { useState } from "react";
import { getNLP } from "../../api.js";
import { Button, TextField, Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const EmailAnalysisForm = () => {
  const [emailText, setEmailText] = useState("");
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const theme = useTheme(); // Accessing the current theme
  const colors = tokens(theme.palette.mode); // Accessing the color tokens

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault(); // Prevent the default form submission behavior
    setError(null); // Clear any existing errors before making the request
    setProject(null); // Reset project data before making a new request

    if (!emailText || emailText.trim().length === 0) {
      setError("Email content cannot be empty."); // Handle empty email content
      return;
    }

    try {
      // Call the API function to get analyzed email data
      const response = await getNLP(emailText);
      console.log("Response from getNLP:", response); // Log the response for debugging
      // Check if the response contains valid project data
      if (response.data.success) {
        setProject(response.data.project); // Set project data from response
      } else {
        setError("Project does not exist."); // Handle invalid response
      }
    } catch (error) {
      setError("An error occurred while analyzing the email."); // Handle API errors
      console.log("Error analyzing email:", error); // Log the error for debugging
    }
  }

  function handleChange(e) {
    setEmailText(e.target.value);
  }

  return (
    <Box
      sx={{
        backgroundColor: colors.primary[500], // Background color based on theme
        padding: 2,
        borderRadius: 2,
        boxShadow: 3,
        color: colors.grey[100], // Text color from tokens
      }}
    >
      <Typography variant="h5" color={colors.greenAccent[500]} gutterBottom>
        Generate New Project From Email
      </Typography>
      <Typography
        variant="h6"
        color={colors.grey[600]} // Use grey for description
        gutterBottom
      >
        This function can categorize text containing AWS Comprehend predefined
        entities such as{" "}
        <strong>Person, Title, Quantity, Date, and more</strong>. Try analyzing
        an email or text below.<br></br>
        <br></br>
        Example: George Clooney played in the movie Ocean Twelve by Paramount in
        2011 which sold millions of DVD copies.
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Enter Email Content"
          multiline
          rows={10}
          fullWidth
          variant="outlined"
          value={emailText}
          onChange={handleChange}
          sx={{
            marginBottom: 2,
            backgroundColor: colors.grey[900], // Using background from the theme
            color: colors.grey[100], // Text color from tokens
            borderColor: colors.grey[700], // Border based on tokens
          }}
          InputProps={{
            style: { color: colors.grey[100] }, // Input text color
          }}
        />
        <Button
          variant="contained"
          type="submit"
          sx={{
            backgroundColor: colors.blueAccent[500],
            color: colors.primary[100],
            "&:hover": {
              backgroundColor: colors.blueAccent[700], // Hover effect
            },
          }}
        >
          Analyze Email
        </Button>
      </form>
      {error && (
        <Typography
          color={theme.palette.error.main}
          variant="body2"
          sx={{ marginTop: 2 }}
        >
          {error}
        </Typography>
      )}
      {project && (
        <Box sx={{ marginTop: 3, marginBottom: 3 }}>
          <Box sx={{ paddingBottom: 1 }}>
            <Typography variant="h6" color={colors.greenAccent[500]}>
              <strong>Generated Project</strong>
            </Typography>
            <Typography variant="body1" color={colors.grey[600]}>
              <strong>Project Name:</strong> {project.projectName || "N/A"}
            </Typography>
            <Typography variant="body1" color={colors.grey[600]}>
              <strong>Description:</strong> {project.projectDesc || "N/A"}
            </Typography>
            <Typography variant="body1" color={colors.grey[600]}>
              <strong>Assigned Staff:</strong> {project.assignedTo || "N/A"}
            </Typography>
            <Typography variant="body1" color={colors.grey[600]}>
              <strong>Project Date:</strong> {project.startDate || "N/A"}
            </Typography>
            <Typography variant="body1" color={colors.grey[600]}>
              <strong>Project Quantity:</strong>{" "}
              {project.projectNumber || "N/A"}
            </Typography>
            <Typography variant="body1" color={colors.grey[600]}>
              <strong>Project Client:</strong> {project.projectClient || "N/A"}
            </Typography>
          </Box>
          <Button
            variant="contained"
            sx={{
              backgroundColor: colors.redAccent[500],
              color: colors.primary[100],
              "&:hover": {
                backgroundColor: colors.blueAccent[700], // Hover effect
              },
            }}
          >
            Create Project
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default EmailAnalysisForm;
