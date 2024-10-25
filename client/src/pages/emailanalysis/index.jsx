import React, { useState } from "react";
import { getNLP } from "../../api.js";
import {
  Button,
  TextField,
  Box,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { tokens } from "../../theme";
import { Formik, Field } from "formik";

const EmailAnalysisForm = () => {
  const [emailText, setEmailText] = useState("");
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setProject(null);

    if (!emailText.trim()) {
      setError("Email content cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await getNLP(emailText);
      if (response.data.success) {
        setProject(response.data.project);
        setOpenDialog(true);
      } else {
        setError("Project does not exist.");
      }
    } catch (error) {
      setError(error.message || "An error occurred while analyzing the email.");
      console.error("Error analyzing email:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: colors.primary[500],
        padding: 2,
        borderRadius: 2,
        boxShadow: 3,
        color: colors.grey[100],
      }}
    >
      <Typography variant="h4" color={colors.greenAccent[500]} gutterBottom>
        Generate New Project From Email
      </Typography>
      <Typography variant="h5" color={colors.grey[600]} gutterBottom>
        This function can categorize text containing AWS Comprehend predefined
        entities such as{" "}
        <strong>Person, Title, Quantity, Date, and more</strong>. Try analyzing
        an email or text below.
        <br />
        <br />
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
          onChange={(e) => setEmailText(e.target.value)}
          sx={{
            marginBottom: 2,
            backgroundColor: colors.grey[900],
            color: colors.grey[100],
            borderColor: colors.grey[700],
            "& .MuiInputBase-input": { fontSize: "1.2rem" },
          }}
          InputProps={{ style: { color: colors.grey[100] } }}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={isSubmitting}
          sx={{
            backgroundColor: colors.blueAccent[500],
            color: colors.primary[100],
            fontSize: "1.2rem",
            "&:hover": { backgroundColor: colors.blueAccent[700] },
          }}
        >
          {isSubmitting ? "Analyzing..." : "Analyze Email"}
        </Button>
      </form>
      {error && (
        <Typography
          color={theme.palette.error.main}
          variant="h6"
          sx={{ marginTop: 2 }}
        >
          {error}
        </Typography>
      )}
      {project && (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle variant="h4">Create New Project</DialogTitle>
          <Formik
            initialValues={{
              projectName: project.projectName || "",
              projectDesc: project.projectDesc || "",
              assignedTo: project.assignedTo || "",
              startDate: project.startDate || "",
              projectNumber: project.projectNumber || "",
              projectClient: project.projectClient || "",
            }}
            onSubmit={(values, { setSubmitting }) => {
              console.log(values);
              setSubmitting(false);
              setOpenDialog(false);
              // Here you would typically update the project state or send the updated data to an API
            }}
          >
            {({ handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <DialogContent>
                  <Field
                    name="projectName"
                    as={TextField}
                    label="Project Name"
                    fullWidth
                    margin="normal"
                  />
                  <Field
                    name="projectDesc"
                    as={TextField}
                    label="Description"
                    fullWidth
                    margin="normal"
                  />
                  <Field
                    name="assignedTo"
                    as={TextField}
                    label="Assigned Staff"
                    fullWidth
                    margin="normal"
                  />
                  <Field
                    name="startDate"
                    as={TextField}
                    label="Project Date"
                    fullWidth
                    margin="normal"
                  />
                  <Field
                    name="projectNumber"
                    as={TextField}
                    label="Project Quantity"
                    fullWidth
                    margin="normal"
                  />
                  <Field
                    name="projectClient"
                    as={TextField}
                    label="Project Client"
                    fullWidth
                    margin="normal"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    Save
                  </Button>
                </DialogActions>
              </form>
            )}
          </Formik>
        </Dialog>
      )}
    </Box>
  );
};

export default EmailAnalysisForm;
