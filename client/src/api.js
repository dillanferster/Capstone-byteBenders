/**
 *
 * This file stores functions that send the HTTP requests to the backend routes
 *
 * Makes the GET, POST, UPDATE, DELETE accessible from anywhere by a function call
 *
 * requests get sent to sever, server receives requests and finds corresponding route
 *
 * axios is used to send asynchronous HTTP requests to REST endpoints
 *
 *  References for this file are from
 *  https://www.youtube.com/watch?v=Jcs_2jNPgtE&t=8033s
 *
 *  */

// imports axios object , used to send asynchronous HTTP requests to REST endpoints.
import axios from "axios";

// url to send the request route to, same one that server is listening on
const URL = "http://localhost:3000";

///PROJECTS///
// gets all projects,
// async function
// awaits axios get method, sends the HTTP request to the /project route on backend
// if the response sent back is good "200" the function returns the data, else console.logs issue
export async function getProjects() {
  try {
    const token = sessionStorage.getItem("User"); // Retrieve the token
    const response = await axios.get(`${URL}/projects/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error; // Optionally, throw the error to handle it in the component
  }
}

// gets one project, takes an id
// async function
// awaits axios get method, sends the HTTP request to the /project/:id route on backend
// if the response sent back is good "200" the function returns the data else console.logs issue
export async function getProject(id) {
  try {
    const token = sessionStorage.getItem("User"); // Retrieve the token
    const response = await axios.get(`${URL}/projects/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      console.log("issue with get", response.status);
      return;
    }
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error; // Optionally, throw the error to handle it in the component
  }
}

// creates a new project , pass in project object
// async function
// awaits axios post method, sends the HTTP request to the /project route on backend
// passes in the project object as the request
// returns the response object
export async function createProject(project) {
  try {
    const token = sessionStorage.getItem("User"); // Retrieve the token
    const response = await axios.post(`${URL}/projects`, project, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error; // Optionally, throw the error to handle it in the component
  }
}

// updates a project, pass in id and project object
// async function
// awaits axios get method, sends the HTTP request to the /project/:id route on backend
// passes in the project id, and project object as the request
// returns the response object
export async function updateProject(id, project) {
  try {
    const token = sessionStorage.getItem("User"); // Retrieve the token
    const response = await axios.put(`${URL}/projects/${id}`, project, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
      },
    });
    return response;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error; // Optionally, throw the error to handle it in the component
  }
}

// adds task id to project, pass in id and project object
// async function
// awaits axios get method, sends the HTTP request to the /project/:id route on backend
// passes in the project id, and taskIdObject
// returns the response object
export async function addTaskToProject(projectId, taskIdObject) {
  try {
    const token = sessionStorage.getItem("User"); // Retrieve the token
    const response = await axios.put(
      `${URL}/projectsupdate/${projectId}`,
      taskIdObject,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error; // Optionally, throw the error to handle it in the component
  }
}

/// DELETE TASK FROM PROJECT TASK ARRAY
// for some reason i had to send the task id through the data field and not the body
// even though in route its still acceses it by request.body.taskId
// reference: CLAUDE, prompt: "this taskObject.taskId console.long works im getting the id"
export async function deleteTaskFromProject(projectId, taskObject) {
  try {
    const token = sessionStorage.getItem("User"); // Retrieve the token
    const response = await axios.delete(
      `${URL}/projectstaskdelete/${projectId}`,

      {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
        },
        data: { taskId: taskObject.taskId },
      }
    );

    console.log("In TASK DELETE API, TASK ID: ", taskObject.taskId);

    return response;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error; // Optionally, throw the error to handle it in the component
  }
}

// deletes project , pass in id
// async function
// awaits axios get method, sends the HTTP request to the /project/:id route on backend
// returns response
export async function deleteProject(id) {
  try {
    const token = sessionStorage.getItem("User"); // Retrieve the token
    const response = await axios.delete(`${URL}/projects/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
      },
    });
    return response;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error; // Optionally, throw the error to handle it in the component
  }
}

////////////////////////// AWS Comprehend //////////////////////////
// // gets NLP data from AWS Comprehend
// // Author: Gigi Vu (gigi-vu2804)
// // async function
// // awaits axios post method, sends the HTTP request to the /projects/analyze-email route on backend
// // passes in the text object as the request
// // returns the response object
export async function getNLP(text) {
  try {
    const token = sessionStorage.getItem("User"); // Retrieve the token

    const response = await axios.post(
      `${URL}/analyze-email`,
      { emailText: text },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error analyzing email:", error);
    throw error;
  }
}
////////////////////////// AWS Comprehend //////////////////////////

///TASKS///

// gets all tasks,
// async function
// awaits axios get method, sends the HTTP request to the /tasks route on backend
// if the response sent back is good "200" the function returns the data, else console.logs issue
export async function getTasks() {
  try {
    const token = sessionStorage.getItem("User"); // Retrieve the token
    const response = await axios.get(`${URL}/tasks/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

// gets one project, takes an id
// async function
// awaits axios get method, sends the HTTP request to the /project/:id route on backend
// if the response sent back is good "200" the function returns the data else console.logs issue
export async function getTask(id) {
  const response = await axios.get(`${URL}/tasks/${id}`);
  if (response.status === 200) {
    return response.data;
  } else {
    console.log("issue with get", response.status);
    return;
  }
}

// creates a new project , pass in project object
// async function
// awaits axios post method, sends the HTTP request to the /project route on backend
// passes in the project object as the request
// returns the response object
export async function createTask(task) {
  try {
    const token = sessionStorage.getItem("User"); // Retrieve the token
    const response = await axios.post(`${URL}/tasks`, task, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

// updates a project, pass in id and project object
// async function
// awaits axios get method, sends the HTTP request to the /project/:id route on backend
// passes in the project id, and project object as the request
// returns the response object
export async function updateTask(id, task) {
  try {
    const token = sessionStorage.getItem("User"); // Retrieve the token
    const response = await axios.put(`${URL}/tasks/${id}`, task, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
      },
    });
    return response;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

// deletes project , pass in id
// async function
// awaits axios get method, sends the HTTP request to the /project/:id route on backend
// returns response
export async function deleteTask(id) {
  try {
    const token = sessionStorage.getItem("User"); // Retrieve the token
    const response = await axios.delete(`${URL}/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
      },
    });
    return response;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}
///TASKS///

//// TASK TIME ///

// start task
export async function startTask(id) {
  try {
    const token = sessionStorage.getItem("User"); // Retrieve the token
    const response = await axios.put(`${URL}/tasks/${id}/start`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
      },
    });
    console.log(response); // Gigi debug log for auth headers
    return response;
  } catch (error) {
    console.error("Error starting project:", error);
    throw error;
  }
}

// pause task
export async function pauseTask(id) {
  try {
    const token = sessionStorage.getItem("User"); // Retrieve the token
    const response = await axios.put(`${URL}/tasks/${id}/pause`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
      },
    });
    console.log(response); // Gigi debug log for auth headers
    return response;
  } catch (error) {
    console.error("Error pausing project:", error);
    throw error;
  }
}

// resume task
export async function resumeTask(id) {
  try {
    const token = sessionStorage.getItem("User"); // Retrieve the token
    const response = await axios.put(`${URL}/tasks/${id}/resume`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
      },
    });
    console.log(response); // Gigi debug log for auth headers
    return response;
  } catch (error) {
    console.error("Error resuming project:", error);
    throw error;
  }
}

// complete task
export async function completeTask(id) {
  try {
    const token = sessionStorage.getItem("User"); // Retrieve the token
    const response = await axios.put(`${URL}/tasks/${id}/complete`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
      },
    });
    console.log(response); // Gigi debug log for auth headers
    return response;
  } catch (error) {
    console.error("Error completing project:", error);
    throw error;
  }
}

// task status
export async function taskStatusUpdate(id, updatedTask) {
  try {
    const token = sessionStorage.getItem("User"); // Retrieve the token
    const response = await axios.put(`${URL}/tasks/${id}/status`, updatedTask, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
      },
    });
    console.log(response); // Gigi debug log for auth headers
    return response;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error; // Optionally, throw the error to handle it in the component
  }
}

// task total time
export async function taskTotalTime(id, updatedTime) {
  try {
    const token = sessionStorage.getItem("User"); // Retrieve the token
    const response = await axios.put(
      `${URL}/tasks/${id}/totaltime`,
      updatedTime,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
        },
      }
    );
    console.log(response); // Gigi debug log for auth headers
    return response;
  } catch (error) {
    console.error("Error updating task total time :", error);
    throw error; // Optionally, throw the error to handle it in the component
  }
}

//// TASK TIME ////

///USER///
// creates a new user , pass in user object
// Author: Gigi Vu (gigi-vu2804)
export async function createUser(user) {
  try {
    const token = sessionStorage.getItem("User"); // Retrieve the token
    const response = await axios.post(`${URL}/users`, user, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating user", error);
    throw error;
  }
}

// verify user login
// Author: Gigi Vu (gigi-vu2804)
export async function verifyUser(user) {
  const response = await axios.post(`${URL}/users/login`, user);
  if (response.data.success) {
    return response.data.token;
  } else {
    throw new Error(response.statusText);
  }
}
///USER///

///NOTES///
// gets all notes
// Author: Gigi Vu (gigi-vu2804)
// async function
// awaits axios get method, sends the HTTP request to the /note route on backend
// if the response sent back is good "200" the function returns the data, else console.logs issue
export async function getNotes() {
  try {
    const token = sessionStorage.getItem("User"); // Ensure the token is valid
    const response = await axios.get(`${URL}/notes`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass token if authentication is needed
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
      params: {
        timestamp: new Date().getTime(), // Prevent caching
      },
    });
    return response.data; // Return the fetched notes data
  } catch (error) {
    console.error("Error fetching notes:", error); // Log any errors for easier debugging
    throw error;
  }
}

// gets one note, takes an id
// Author: Gigi Vu (gigi-vu2804)
// async function
// awaits axios get method, sends the HTTP request to the /note/:id route on backend
// if the response sent back is good "200" the function returns the data else console.logs issue
export async function getNote(id) {
  try {
    const token = sessionStorage.getItem("User"); // Retrieve the token
    const response = await axios.get(`${URL}/notes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      console.log("Issue with get", response.status);
    }
  } catch (error) {
    console.error("Error fetching note:", error);
    throw error; // Optionally, throw the error to handle it in the component
  }
}

// creates a new note , pass in note object
// Author: Gigi Vu (gigi-vu2804)
// async function
// awaits axios post method, sends the HTTP request to the /note route on backend
// passes in the note object as the request
// returns the response object
export async function createNote(note) {
  try {
    const token = sessionStorage.getItem("User");
    const response = await axios.post(`${URL}/notes`, note, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
}

// updates a note, pass in id and note object
// Author: Gigi Vu (gigi-vu2804)
// async function
// awaits axios get method, sends the HTTP request to the /note/:id route on backend
// passes in the note id, and note object as the request
// returns the response object
export async function updateNote(id, note) {
  try {
    const token = sessionStorage.getItem("User"); // Retrieve the token
    const response = await axios.put(`${URL}/notes/${id}`, note, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating note:", error);
    throw error;
  }
}

// deletes note , pass in id
// Author: Gigi Vu (gigi-vu2804)
// async function
// awaits axios get method, sends the HTTP request to the /note/:id route on backend
// returns response
export async function deleteNote(id) {
  try {
    const token = sessionStorage.getItem("User"); // Retrieve the token
    const response = await axios.delete(`${URL}/notes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
}
///NOTES///

/**
 * EMAIL INBOX
 * Author: Gigi Vu (gigi-vu2804)
 *
 */

/**
 * Email Login Function
 * @returns void
 */
export async function emailLogin() {
  try {
    window.location.href = `${URL}/email-inbox/login`; // Redirect to the login route on the backend
  } catch (error) {
    console.error("Login initiation failed:", error);
  }
}

/**
 * Fetch Emails Function
 * @returns emails
 */
export async function fetchEmails() {
  try {
    console.log("All cookies:", document.cookie);
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];
    console.log("Fetching emails with access token:", accessToken);

    if (!accessToken) {
      console.error("Access token not found in cookies");
    }
    const response = await axios.get(`${URL}/email-inbox/emails`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("Emails response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch emails:", error);
    if (error.response) {
      console.error("Error response:", error.response.data);
      console.error("Error status:", error.response.status);
    }
    throw error;
  }
}

// // Function to refresh access token using the refresh token
// async function refreshAccessToken() {
//   try {
//     const refreshToken = localStorage.getItem("refreshToken"); // Retrieve refresh token from localStorage
//     if (!refreshToken) {
//       console.error("No refresh token found, user needs to re-login");
//       return false;
//     }

//     const response = await axios.post(
//       `${URL}/auth/refresh-token`,
//       {
//         refresh_token: refreshToken,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     // Save the new access and refresh tokens
//     localStorage.setItem("accessToken", response.data.access_token);
//     localStorage.setItem("refreshToken", response.data.refresh_token);
//     console.log("Access token refreshed successfully");
//     return true;
//   } catch (error) {
//     console.error("Failed to refresh access token:", error);
//     logoutEmail(); // Log the user out if refresh fails
//     return false;
//   }
// }

/**
 * Logout Email Function
 * @returns void
 */
export async function logoutEmail() {
  try {
    const response = await axios.get(`${URL}/email-inbox/signout`, {
      withCredentials: true, // This is important for sending cookies with the request
    });

    // if (response.status === 200) {
    //   // If the server responds with a redirect URL, use it
    //   window.location.href = "http://localhost:5173/email-inbox/";
    // } else {
    //   console.error("Logout failed:", response.data);
    //   // Handle logout failure (e.g., show an error message to the user)
    // }
  } catch (error) {
    console.error("Logout initiation failed:", error);
  }
}

///CALENDAR///
// gets all calendar events
export async function getCalendarEvents() {
  try {
    const token = sessionStorage.getItem("User"); // Retrieve the token
    const response = await axios.get(`${URL}/events/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching calendar events:", error);
  }
}

// creates a new calendar event
export async function createCalendarEvent(event) {
  console.log("IN CREATE EVENT API.JS");
  try {
    const token = sessionStorage.getItem("User");
    const response = await axios.post(`${URL}/events`, event, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw error;
  }
}

// updates a calendar event
export async function updateCalendarEvent(id, event) {
  try {
    const token = sessionStorage.getItem("User");
    const response = await axios.put(`${URL}/events/${id}`, event, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error updating calendar event:", error);
    throw error;
  }
}

// deletes a calendar event
export async function deleteCalendarEvent(id) {
  try {
    const token = sessionStorage.getItem("User");
    const response = await axios.delete(`${URL}/events/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting calendar event:", error);
  }
}
// get events by date range
export async function getCalendarEventsByRange(startDate, endDate) {
  try {
    const token = sessionStorage.getItem("User");
    const response = await axios.get(`${URL}/events/range`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        start: startDate,
        end: endDate,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching calendar events by range:", error);
    throw error;
  }
}

// get events by participant
export async function getCalendarEventsByParticipant(email) {
  try {
    const token = sessionStorage.getItem("User");
    const response = await axios.get(`${URL}/events/participant/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching calendar events by participant:", error);
    throw error;
  }
}
///^CALENDAR^///

/**
 * Send Email Reply Function
 * @param {string} messageId - The ID of the email message to reply to
 * @param {string} comment - The reply content
 * @returns response
 */
export async function sendEmailReply(messageId, comment) {
  try {
    const response = await axios.post(
      `${URL}/email-inbox/reply`, // Route to send an email reply
      {
        messageId, // The ID of the email message to reply to
        comment, // The reply content
      },
      {
        withCredentials: true, // Send credentials with the request
      }
    );

    console.log("Reply sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to send email reply:", error);
    throw error;
  }
}

/**
 * Delete Email Function
 * @param {string} messageId - The ID of the email message to delete
 * @returns response
 */
export async function deleteEmail(messageId) {
  try {
    const response = await axios.delete(`${URL}/email-inbox/delete`, {
      // Route to delete an email
      data: { messageId }, // The ID of the email message to delete
      withCredentials: true, // Send credentials with the request
    });

    console.log("Email deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to delete email:", error);
    throw error;
  }
}

/**
 * Send Email Function
 * @param {string} to - The recipient email address
 * @param {string} cc - The CC email address
 * @param {string} subject - The email subject
 * @param {string} content - The email content
 * @returns response
 */
export async function sendEmail(to, cc, subject, content) {
  try {
    const response = await axios.post(
      `${URL}/email-inbox/send`, // Route to send a new email
      {
        to, // The recipient email address
        cc, // The CC email address
        subject, // The email subject
        content, // The email content
      },
      {
        withCredentials: true, // Send credentials with the request
      }
    );
    console.log("Email sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}
