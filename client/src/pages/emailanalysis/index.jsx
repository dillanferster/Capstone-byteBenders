import React, { useState } from "react";
import { getNLP } from "../../api.js";
import { Button } from "@mui/material";

const EmailAnalysisForm = () => {
  const [emailText, setEmailText] = useState("");
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

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
    <div>
      <p>
        This function can categorize text that contain these AWS predefined
        entities (We can create custom entities later on!) <br></br>- Person:
        Individuals, groups of people, nicknames, fictional characters, etc.{" "}
        <br></br>- Title: An official name given to any creation or creative
        work, such as movies, books, songs, etc. <br></br>- Quantity: quantified
        amount, such as currency, percentages, numbers, bytes, etc. <br></br>-
        Date: A full date (for example, 11/25/2017), day (Tuesday), month (May),
        or time (8:30 a.m.) <br></br>- Other: Any other type of entity that does
        not fit into the other categories
        <br></br>- Event: An event, such as a festival, concert, election, etc.
        <br></br>
      </p>
      <p>
        Try this text to see output: "Actor George Clooney played in the movie
        Ocean Twelve by Paramount which aired in 20 April 2000 and sold for
        4,000 DVD copies. "
      </p>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Email Content:
          <textarea
            value={emailText}
            onChange={handleChange} // Update emailText on change
            placeholder="Paste the email content here..."
            rows={10}
            cols={50}
            name="emailText"
          />
        </label>
        <br />
        <Button variant="contained" type="submit">
          Analyze Email
        </Button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Display error message */}
      {project && ( // Conditionally display the project details if available
        <div>
          <h3>Generated Project</h3>
          <p>
            <strong>Project Name:</strong> {project.projectName || "N/A"}
          </p>
          <p>
            <strong>Description:</strong> {project.projectDesc || "N/A"}
          </p>
          <p>
            <strong>Assigned Staff:</strong> {project.assignedTo || "N/A"}
          </p>
          <p>
            <strong>Project Date:</strong> {project.startDate || "N/A"}
          </p>
          <p>
            <strong>Project Number:</strong> {project.projectNumber || "N/A"}
          </p>
          <p>
            <strong>Project Client:</strong> {project.projectClient || "N/A"}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailAnalysisForm;
