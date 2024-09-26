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
  const response = await axios.get(`${URL}/projects`);
  if (response.status === 200) {
    return response.data;
  } else {
    console.log("issue with get", response.status);
    return;
  }
}

// gets one project, takes an id
// async function
// awaits axios get method, sends the HTTP request to the /project/:id route on backend
// if the response sent back is good "200" the function returns the data else console.logs issue
export async function getProject(id) {
  const response = await axios.get(`${URL}/projects/${id}`);
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
export async function createProject(project) {
  const response = await axios.post(`${URL}/projects`, project);
  return response;
}

// updates a project, pass in id and project object
// async function
// awaits axios get method, sends the HTTP request to the /project/:id route on backend
// passes in the project id, and project object as the request
// returns the response object
export async function updateProject(id, project) {
  const response = await axios.put(`${URL}/projects/${id}`, project);
  return response;
}

// deletes project , pass in id
// async function
// awaits axios get method, sends the HTTP request to the /project/:id route on backend
// returns response
export async function deleteProject(id) {
  const response = await axios.delete(`${URL}/projects/${id}`);
  return response;
}
///PROJECTS///

///USER///
// creates a new user , pass in user object
export async function createUser(user) {
  const response = await axios.post(`${URL}/users`, user);
  return response;
}

// verify user login
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
// gets all notes,
// async function
// awaits axios get method, sends the HTTP request to the /note route on backend
// if the response sent back is good "200" the function returns the data, else console.logs issue
export async function getNotes() {
  const response = await axios.get(`${URL}/notes`);
  if (response.status === 200) {
    return response.data;
  } else {
    console.log("issue with get", response.status);
    return;
  }
}

// gets one note, takes an id
// async function
// awaits axios get method, sends the HTTP request to the /note/:id route on backend
// if the response sent back is good "200" the function returns the data else console.logs issue
export async function getNote(id) {
  const response = await axios.get(`${URL}/notes/${id}`);
  if (response.status === 200) {
    return response.data;
  } else {
    console.log("issue with get", response.status);
    return;
  }
}

// creates a new note , pass in note object
// async function
// awaits axios post method, sends the HTTP request to the /note route on backend
// passes in the note object as the request
// returns the response object
export async function createNote(note) {
  const response = await axios.post(`${URL}/notes`, note);
  return response;
}

// updates a note, pass in id and note object
// async function
// awaits axios get method, sends the HTTP request to the /note/:id route on backend
// passes in the note id, and note object as the request
// returns the response object
export async function updateNote(id, note) {
  const response = await axios.put(`${URL}/notes/${id}`, note);
  return response;
}

// deletes note , pass in id
// async function
// awaits axios get method, sends the HTTP request to the /note/:id route on backend
// returns response
export async function deleteNote(id) {
  const response = await axios.delete(`${URL}/notes/${id}`);
  return response;
}
///NOTES///
