import axios from "axios";
// file for handeling all of the database action functions, axios will call the routes in the backend

const URL = "http://localhost:3000";

// gets all projects
export async function getProjects() {
  const response = await axios.get(`${URL}/projects`);
  if (response.status === 200) {
    return response.data;
  } else {
    return;
  }
}

// gets one project, pass in id
export async function getProject(id) {
  const response = await axios.get(`${URL}/projects/${id}`);
  if (response.status === 200) {
    return response.data;
  } else {
    return;
  }
}

// creates a new project , pass in project object
export async function createProject(project) {
  const response = await axios.post(`${URL}/projects`, project);
  return response;
}

// updates a project, pass in id and project object
export async function updateProject(id, project) {
  const response = await axios.put(`${URL}/projects/${id}`, project);
  return response;
}

// deletes project , pass in id
export async function deleteProject(id) {
  const response = await axios.delete(`${URL}/projects/${id}`);
  return response;
}
