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
  const response = await axios.post(`${URL}/analyze-email`, {
    emailText: text,
  });
  return response;
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
    return response;
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
    const token = sessionStorage.getItem("User"); // Retrieve the token
    const response = await axios.get(`${URL}/notes`, {
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
    console.error("Error fetching notes:", error);
    throw error; // Optionally, throw the error to handle it in the component
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
    const token = sessionStorage.getItem("User"); // Retrieve the token
    const response = await axios.post(`${URL}/notes`, note, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
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
