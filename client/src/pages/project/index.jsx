/**
 * This page displays project items in a data table
 *
 * destructs makeProject
 *
 * preforms CRUD operations
 *
 * Uses AG Grid component
 *
 * References:
 * https://www.ag-grid.com/react-data-grid/getting-started/
 * https://www.ag-grid.com/react-data-grid/row-selection/
 * https://www.ag-grid.com/react-data-grid/row-selection-multi-row/
 *
 */

import React from "react";
import { useState, useEffect, useMemo } from "react";

// date formatter
import { format } from "date-fns";

// Components
import { Button, fabClasses } from "@mui/material";

// database functions from api file
import {
  getProjects,
  getTasks,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../../api.js";
import ProjectGrid from "../../components/projectgrid/index.jsx";
import EditMenu from "../../components/editmenu/index.jsx";
import ProjectGantt from "../../components/GanttChart/ProjectGantt.jsx";
//

// columns for AG grid
// field: corresponds to a row with a matching property ex. field: id in column matches to id: in rows
// headerName: column display name
// filter: allows for column filtering
// floating filter: displayed filter search bar
// editable: sets to false, does not allow a double click to be able to edit the cell
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
    field: "caseId",
    headerName: "Case Id (Quickbase)",
    floatingFilter: true,
    filter: true,
    editable: false,
  },

  {
    field: "dataClassification",
    headerName: "Data Classification",
    floatingFilter: true,
    filter: true,
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
    headerName: "Date Created",
    floatingFilter: true,
    filter: true,
    editable: false,
  },
  {
    field: "projectStatus",
    headerName: "Project Status",
    floatingFilter: true,
    filter: true,
    editable: false,
  },
  {
    field: "quickBaseLink",
    headerName: "QuickBase Case Link",
    floatingFilter: true,
    filter: true,
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
    field: "tasksCount",
    headerName: "Number of Tasks",
    filter: true,
    floatingFilter: true,
    editable: false,
  },
];

const ProjectPage = () => {
  //* state
  const [projects, setProjects] = useState([]); // Loaded projects from database
  const [tasks, setTasks] = useState([]); // Loaded tasks from database
  const [isLoading, setIsLoading] = useState(); // state for loading
  const [selectedProject, setSelectedProject] = useState([]); // selected project array, when users click on projects in data table
  const [reloadGrid, setReloadGrid] = useState(false); // to update grid rows
  const [isOpen, setIsOpen] = useState(false); // for edit  menu
  const [viewClicked, setViewClicked] = useState(false); // for view button
  const [addClicked, setAddClicked] = useState(false); // for add button
  const [editClicked, setEditClicked] = useState(false); // for add button
  const [deleteOpen, setDeleteOpen] = useState(false); // for dlt btn
  const [showGantt, setShowGantt] = useState(false); // Add this new state

  //*

  // projects object array from the database
  // rows maps the project list to the corresponding fields that match to the ag grid field columns for the datagrid component
  // rows is then passed into the datagrid component
  // useMemo so when the projectPage component reloads from state changes the rows dont reload with it, only when projects or reloadGrid state is changed
  // dependencies : projects, reloadGrid
  // reference https://www.ag-grid.com/react-data-grid/row-selection-multi-row/
  const rows = useMemo(
    () =>
      projects.map((project) => ({
        id: project._id,
        projectName: project.projectName,
        caseId: project.caseId,
        dataClassification: project.dataClassification,
        assignedTo: project.assignedTo,
        dateCreated: project.dateCreated,
        projectStatus: project.projectStatus,
        quickBaseLink: project.quickBaseLink,
        projectDesc: project.projectDesc,
        tasksCount: project.TaskIdForProject // count unique number of task id string
          ? (() => {
              const uniqueItems = new Set();

              project.TaskIdForProject.forEach((item) => {
                if (typeof item === "string") {
                  uniqueItems.add(item); // Add string directly
                } else if (item instanceof ObjectId) {
                  // handle edge cases when task id is saved as an objectid in the string array
                  uniqueItems.add(item.toString()); // Convert ObjectId to string and add
                }
              });
              console.log("uniqueItems", uniqueItems);
              // Return the total count of unique strings and ObjectIds
              return uniqueItems.size;
            })()
          : 0,
      })),
    [projects]
  );

  /// Default style props for AG data grid
  // sortable : allows columns to be sorted
  // width: sets a column width
  // maxWidth: defines max width for columns
  // reference https://www.ag-grid.com/react-data-grid/row-selection-multi-row/
  const selectionColumnDef = useMemo(() => {
    return {
      sortable: true,
      width: 100,
      maxWidth: 100,
    };
  }, []);

  // Selection control props for AG data grid
  // mode: multiRow, allows users to select more than one row
  //  checkboxes: false, removes the checkbox selector
  // headerCheckbox: false,   removes the checkbox selector
  // enableMultiSelectWithClick: true, allows mutlirow selection by clicking on the cells
  // enableClickSelection: true, allows selection by clicking on a cell
  // reference https://www.ag-grid.com/react-data-grid/row-selection-multi-row/
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

  // function Handles add Button click
  // calls makeProject
  // setReloadGrid so the rows rerender with new item
  function handleButtonAdd() {
    setAddClicked(!addClicked);
    setSelectedProject("");
    toggleForm();
  }

  // function handles edit button
  // calls toggleForm
  function handleButtonEdit() {
    setEditClicked(!editClicked);
    toggleForm();
  }

  const reloadTheGrid = () => {
    setReloadGrid(!reloadGrid);
  };

  // function handles view button
  // calls toggleForm
  function handleButtonView() {
    setViewClicked(!viewClicked);
    console.log("set view to", viewClicked);
    toggleForm();
  }

  // handles delete button
  // loops through selecedProject array
  // passes the id of selected project to the deleteProject function
  // setReloadGrid to rerender row list with newly deleted item
  function handleButtonDelete() {
    setDeleteOpen((prev) => !prev);
    selectedProject.forEach((project) => {
      deleteProject(project.id).then((response) => {
        if (response.status === 200) {
          console.log("deleted project with id:", project.id);
          reloadTheGrid();
        }
      });
    });
  }

  // sets the form menu state to open or close menu
  const toggleForm = () => {
    setIsOpen(!isOpen);
  };

  // handles when the list selection item changes ex. click or deselect an item
  // pass in selection event
  // calls AG grid getSelectedRows function which returns the currently selected rows in an array
  // sets selected project list with checkedRows array
  // https://www.ag-grid.com/react-data-grid/row-selection/
  const handleOnSelectionChanged = (event) => {
    let checkedRows = event.api.getSelectedRows();
    console.log("selected row", checkedRows);

    setSelectedProject(checkedRows);
  };

  // loads all projects from database into list
  // When app component renders loadAllProjects() is called asynchronously
  // so the rest on the program can still run when the function logic is being executed and returned some time in future
  // if data is returned , then setProjects state is updated with data
  // sets loading to true, then if and when data is returned sets to false
  // dependencies : reloadGrid
  useEffect(() => {
    setIsLoading(true);

    async function loadAllProjects() {
      const data = await getProjects();
      if (data) {
        setProjects(data);
        setIsLoading(false);
      }
    }

    async function loadAllTasks() {
      const data = await getTasks();
      if (data) {
        setTasks(data);
        setIsLoading(false);
      }
    }

    loadAllProjects();
    loadAllTasks();
  }, [reloadGrid]);

  return (
    <div className=" p-[1rem]  ">
      <div className=" p-[1rem] flex justify-between   w-full">
        <div className="flex gap-4">
          <Button
            variant="contained"
            color="success"
            onClick={() => handleButtonAdd()}
          >
            Add project
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowGantt(!showGantt)}
          >
            {showGantt ? "Show Table View" : "Show Gantt View"}
          </Button>
        </div>
        <div className="flex gap-4">
          {deleteOpen && (
            <div className="flex items-center justify-end gap-4 z-[5]  w-full ">
              <p className="font-bold text-md">
                Are you sure you want to delete ?
              </p>
              <div>
                {" "}
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleButtonDelete()}
                >
                  Delete
                </Button>
              </div>
              <div>
                {" "}
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={() => setDeleteOpen((prev) => !prev)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}{" "}
          {selectedProject.length === 1 && !deleteOpen && (
            <div className="flex gap-4">
              <div>
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() => handleButtonView()}
                >
                  View
                </Button>
              </div>
              <div>
                {" "}
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
          {selectedProject.length > 0 && !deleteOpen && (
            <div>
              {" "}
              <Button
                variant="contained"
                color="error"
                onClick={() => setDeleteOpen((prev) => !prev)}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      {!showGantt ? (
        <>
          <ProjectGrid
            rows={rows}
            columns={columns}
            selection={selection}
            selectionColumnDef={selectionColumnDef}
            onSelectionChanged={handleOnSelectionChanged}
          />
          <EditMenu
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            toggleForm={toggleForm}
            selectedProject={selectedProject}
            updateProject={updateProject}
            createProject={createProject}
            viewClicked={viewClicked}
            setViewClicked={setViewClicked}
            addClicked={addClicked}
            setAddClicked={setAddClicked}
            editClicked={editClicked}
            setEditClicked={setEditClicked}
            reloadTheGrid={reloadTheGrid}
          />
        </>
      ) : (
        <>
          <ProjectGantt
            projects={projects}
            tasks={tasks}
            // style={{ height: "80vh", overflow: "auto" }}
          />
        </>
      )}
    </div>
  );
};

export default ProjectPage;
