import React from "react";
import ProjectGrid from "../../components/projectgrid";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
// database functions from api file
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../../api.js";

//

/// columns for MUI datagrid
const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "projectName",
    headerName: "Project name",
    width: 150,
    editable: true,
  },
  {
    field: "projectDesc",
    headerName: "Project Desc",
    width: 150,
    editable: true,
  },
  {
    field: "assignedTo",
    headerName: "Assigned To",
    type: "string",
    width: 110,
    editable: true,
  },
  {
    field: "dateCreated",
    headerName: "Date",
    description: "This column has a value getter and is not sortable.",
    sortable: true,
    width: 160,
  },
];
///

const ProjectPage = ({ makeProject }) => {
  /// ** state
  const [projects, setProjects] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState([]);
  const [reloadGrid, setReloadGrid] = useState(false);
  /// ** state

  // projects object array from the database is passed into grid from project page
  // rows maps the project list to the corresponding fields that match to the MUI columns for the datagrid component, rows is then passed into the datagrid component
  const rows = projects.map((project) => {
    return {
      id: project._id,
      projectName: project.projectName,
      projectDesc: project.projectDesc,
      assignedTo: project.assignedTo,
      dateCreated: project.dateCreated,
    };
  });

  // add project button handeler
  function handleButtonAdd() {
    makeProject();
    setReloadGrid(!reloadGrid);
  }

  // handles delete button
  function handleButtonDelete() {
    console.log("deleted project with id:", selectedProject.id);
    deleteProject(selectedProject.id);

    setReloadGrid(!reloadGrid);
  }

  /// item selection, takes the selected ids, finds the full object then adds them to selected project array
  const selectedId = (rowSelectionModel) => {
    rowSelectionModel.forEach((project) => {
      const selected = rows.find((row) => project === row.id);
      setSelectedProject(selected);
      console.log("added to selected", selected);
    });
  };
  ////

  // loads all projects from database into list
  useEffect(() => {
    setIsLoading(true);

    async function loadAllProjects() {
      const data = await getProjects();
      if (data) {
        setProjects(data);
        setIsLoading(false);
      }
    }

    loadAllProjects();
  }, [reloadGrid]);

  return (
    <div>
      {selectedProject && Object.keys(selectedProject).length > 0 ? (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleButtonDelete()}
        >
          Delete
        </Button>
      ) : (
        ""
      )}
      <Button
        variant="contained"
        color="success"
        onClick={() => handleButtonAdd()}
      >
        Add project
      </Button>
      <ProjectGrid
        isloading={isloading}
        projects={projects}
        setSelectedProject={setSelectedProject}
        selectedId={selectedId}
        rows={rows}
        columns={columns}
      ></ProjectGrid>
    </div>
  );
};

export default ProjectPage;
