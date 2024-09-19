import React, { useCallback } from "react";

import { useState, useEffect, useMemo } from "react";

import { Button } from "@mui/material";
// database functions from api file
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../../api.js";
import ProjectGrid from "../../components/projectgrid/index.jsx";
import EditMenu from "../../components/editmenu/index.jsx";

//

/// columns for MUI datagrid
const columns = [
  {
    field: "id",
    headerName: "ID",

    filter: true,
    floatingFilter: true,
    editable: false,
  },
  {
    field: "projectName",
    headerName: "Project name",

    filter: true,
    floatingFilter: true,
    editable: false,
  },
  {
    field: "projectDesc",
    headerName: "Project Desc",

    filter: true,
    floatingFilter: true,
    editable: false,
  },
  {
    field: "assignedTo",
    headerName: "Assigned To",

    filter: true,
    floatingFilter: true,

    editable: false,
  },
  {
    field: "dateCreated",
    headerName: "Date",
    floatingFilter: true,
    filter: true,

    editable: false,
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
  const rows = useMemo(
    () =>
      projects.map((project) => ({
        id: project._id,
        projectName: project.projectName,
        projectDesc: project.projectDesc,
        assignedTo: project.assignedTo,
        dateCreated: project.dateCreated,
      })),
    [projects, reloadGrid]
  );

  /// for AG data grid
  const selectionColumnDef = useMemo(() => {
    return {
      sortable: true,
      width: 120,
      maxWidth: 120,
    };
  }, []);

  const selection = useMemo(() => {
    return {
      mode: "multiRow",
      checkboxes: false,
      headerCheckbox: false,
      enableMultiSelectWithClick: true,
      enableClickSelection: true,
    };
  }, []);

  /// for AG data grid

  // add project button handeler
  function handleButtonAdd() {
    makeProject();
    setReloadGrid(!reloadGrid);
  }

  // handles edit button
  function handleButtonEdit() {}

  // handles delete button, loops through seleced project and pass the id
  // to the deleteProject function
  function handleButtonDelete() {
    selectedProject.forEach((project) => {
      deleteProject(project.id);
      console.log("deleted project with id:", project.id);
    });

    setReloadGrid(!reloadGrid);
  }

  // handels when the list selection item changes ex. click or deselect an item
  // sets selected project list with selection
  const handleOnSelectionChanged = (event) => {
    let checkedRows = event.api.getSelectedRows();
    console.log("selected row", checkedRows);

    setSelectedProject(checkedRows);
  };

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
      {selectedProject.length > 0 && (
        <div>
          <div>
            {" "}
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleButtonDelete()}
            >
              Delete
            </Button>
          </div>
          <div>
            <Button
              variant="outlined"
              color="warning"
              onClick={() => handleButtonEdit()}
            >
              Edit
            </Button>
          </div>
        </div>
      )}
      <Button
        variant="contained"
        color="success"
        onClick={() => handleButtonAdd()}
      >
        Add project
      </Button>

      <ProjectGrid
        rows={rows}
        columns={columns}
        selection={selection}
        selectionColumnDef={selectionColumnDef}
        onSelectionChanged={handleOnSelectionChanged}
      ></ProjectGrid>
      <EditMenu></EditMenu>
    </div>
  );
};

export default ProjectPage;
