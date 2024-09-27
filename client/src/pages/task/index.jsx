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
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from "../../api.js";
import ProjectGrid from "../../components/projectgrid/index.jsx";
import TaskEditMenu from "../../components/taskeditmenu/index.jsx";

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
    field: "assignedTo",
    headerName: "Assigned To",
    filter: true,
    floatingFilter: true,
    editable: false,
  },
  {
    field: "taskStatus",
    headerName: "Task Status",
    filter: true,
    floatingFilter: true,
    editable: false,
  },
  {
    field: "priority",
    headerName: "Priority",
    filter: true,
    floatingFilter: true,
    editable: false,
  },
  {
    field: "taskCategory",
    headerName: "Category",
    filter: true,
    floatingFilter: true,
    editable: false,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    filter: true,
    floatingFilter: true,
    editable: false,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    filter: true,
    floatingFilter: true,
    editable: false,
  },
  {
    field: "projectStatus",
    headerName: "Project Status",
    filter: true,
    floatingFilter: true,
    editable: false,
  },
  {
    field: "addChronicles",
    headerName: "Add Chronicles",
    filter: true,
    floatingFilter: true,
    editable: false,
  },
  {
    field: "attachments",
    headerName: "Attachments",
    filter: true,
    floatingFilter: true,
    editable: false,
  },
  {
    field: "chroniclesComplete",
    headerName: "Chronicles Complete",
    filter: true,
    floatingFilter: true,
    editable: false,
  },
];

const TaskPage = () => {
  //* state
  const [tasks, setTasks] = useState([]); // Loaded projects from database
  const [isLoading, setIsLoading] = useState(); // state for loading
  const [selectedTask, setSelectedTask] = useState([]); // selected project array, when users click on projects in data table
  const [reloadGrid, setReloadGrid] = useState(false); // to update grid rows
  const [isOpen, setIsOpen] = useState(false); // for edit  menu
  const [viewClicked, setViewClicked] = useState(false); // for view button
  const [addClicked, setAddClicked] = useState(false); // for add button
  const [editClicked, setEditClicked] = useState(false); // for add button

  //*

  // projects object array from the database
  // rows maps the project list to the corresponding fields that match to the ag grid field columns for the datagrid component
  // rows is then passed into the datagrid component
  // useMemo so when the projectPage component reloads from state changes the rows dont reload with it, only when projects or reloadGrid state is changed
  // dependencies : projects, reloadGrid
  const rows = useMemo(
    () =>
      tasks.map((task) => ({
        id: task._id,
        assignedTo: task.assignedTo,
        taskStatus: task.taskStatus,
        priority: task.priority,
        taskCategory: task.taskCategory,
        startDate: task.startDate,
        dueDate: task.dueDate,
        projectStatus: task.projectStatus,
        addChronicles: task.addChronicles,
        attachments: task.attachments,
        chroniclesComplete: task.chroniclesComplete,
      })),
    [tasks]
  );

  /// Default style props for AG data grid
  // sortable : allows columns to be sorted
  // width: sets a column width
  // maxWidth: defines max width for columns
  const selectionColumnDef = useMemo(() => {
    return {
      sortable: true,
      width: 120,
      maxWidth: 120,
    };
  }, []);

  // Selection control props for AG data grid
  // mode: multiRow, allows users to select more than one row
  //  checkboxes: false, removes the checkbox selector
  // headerCheckbox: false,   removes the checkbox selector
  // enableMultiSelectWithClick: true, allows mutlirow selection by clicking on the cells
  // enableClickSelection: true, allows selection by clicking on a cell
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
    setSelectedTask("");
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
    selectedTask.forEach((task) => {
      deleteTask(task.id).then((response) => {
        if (response.status === 200) {
          console.log("deleted project with id:", task.id);
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

    setSelectedTask(checkedRows);
  };

  // loads all projects from database into list
  // When app component renders loadAllProjects() is called asynchronously
  // so the rest on the program can still run when the function logic is being executed and returned some time in future
  // if data is returned , then setProjects state is updated with data
  // sets loading to true, then if and when data is returned sets to false
  // dependencies : reloadGrid
  useEffect(() => {
    setIsLoading(true);

    async function loadAllTasks() {
      const data = await getTasks();
      if (data) {
        setTasks(data);
        setIsLoading(false);
      }
    }

    loadAllTasks();
  }, [reloadGrid]);

  return (
    <div className="ml-[5rem] w-full h-full border-2 border-red-500">
      <div className="flex justify-between">
        <Button
          variant="contained"
          color="success"
          onClick={() => handleButtonAdd()}
        >
          Add Task
        </Button>
        <div className="flex gap-4">
          {" "}
          {selectedTask.length === 1 && (
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
          {selectedTask.length > 0 && (
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
          )}
        </div>
      </div>

      <ProjectGrid
        rows={rows}
        columns={columns}
        selection={selection}
        selectionColumnDef={selectionColumnDef}
        onSelectionChanged={handleOnSelectionChanged}
      ></ProjectGrid>
      <TaskEditMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        toggleForm={toggleForm}
        selectedTask={selectedTask}
        updateTask={updateTask}
        createTask={createTask}
        viewClicked={viewClicked}
        setViewClicked={setViewClicked}
        addClicked={addClicked}
        setAddClicked={setAddClicked}
        editClicked={editClicked}
        setEditClicked={setEditClicked}
        reloadTheGrid={reloadTheGrid}
      ></TaskEditMenu>
    </div>
  );
};

export default TaskPage;
