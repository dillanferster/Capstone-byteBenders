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
  startTask,
  pauseTask,
  resumeTask,
  completeTask,
  taskStatusUpdate,
  getProjects,
  addTaskToProject,
  deleteTaskFromProject,
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
    field: "taskName",
    headerName: "Task Name",
    filter: true,
    floatingFilter: true,
    editable: false,
  },
  {
    field: "projectTask",
    headerName: "Project",
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
    field: "taskDesc",
    headerName: "Description",
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
  const [taskStatus, setTaskStatus] = useState([]); //
  const [projects, setProjects] = useState([]); // Loaded projects from database
  const [isLoading, setIsLoading] = useState(); // state for loading
  const [selectedTask, setSelectedTask] = useState([]); // selected project array, when users click on projects in data table
  const [selectedIdForTimeCalc, setSelectedIdForTimeCalc] = useState(); // id for time calculation
  const [reloadGrid, setReloadGrid] = useState(false); // to update grid rows
  const [isOpen, setIsOpen] = useState(false); // for edit  menu
  const [viewClicked, setViewClicked] = useState(false); // for view button
  const [addClicked, setAddClicked] = useState(false); // for add button
  const [editClicked, setEditClicked] = useState(false); // for add button

  // const [startedTask, setStartedTask] = useState(false); // for start task button
  // const [pausedTask, setPausedTask] = useState(false); // for pause task button
  // const [completedTask, setCompletedTask] = useState(false); // for complete task button

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
        taskName: task.taskName,
        assignedTo: task.assignedTo,
        taskStatus: task.taskStatus,
        priority: task.priority,
        taskCategory: task.taskCategory,
        startDate: task.startDate,
        dueDate: task.dueDate,
        projectTask: task.projectTask,
        projectStatus: task.projectStatus,
        addChronicles: task.addChronicles,
        taskDesc: task.taskDesc,
        attachments: task.attachments,
        startTime: task.startTime,
        completeTime: task.completeTime,
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

  // updates grid usestate to cause a re-render
  const reloadTheGrid = async () => {
    setReloadGrid(!reloadGrid);
  };

  // function handles view button
  // calls toggleForm
  function handleButtonView() {
    setViewClicked(!viewClicked);
    console.log("set view to", viewClicked);
    toggleForm();
  }

  // handles button start task
  // calls startTask route
  async function handleButtonStart() {
    startTask(selectedTask[0].id);
    console.log("task started");

    const updatedTask = {
      taskStatus: "Started",
    };

    try {
      const response = await taskStatusUpdate(selectedTask[0].id, updatedTask);
      if (response.status === 200) {
        reloadTheGrid();
      }
    } catch (error) {
      console.error("Error updating task Status:", error);
    }
  }

  // handles button pause task
  // calls pauseTask route
  async function handleButtonPause() {
    pauseTask(selectedTask[0].id);
    console.log("task Paused");

    const updatedTask = {
      taskStatus: "Paused",
    };

    try {
      const response = await taskStatusUpdate(selectedTask[0].id, updatedTask);
      if (response.status === 200) {
        reloadTheGrid();
      }
    } catch (error) {
      console.error("Error updating task Status:", error);
    }
  }

  // handles button resume task
  // calls resumeTask route
  async function handleButtonResume() {
    resumeTask(selectedTask[0].id);
    console.log("task Resumed");

    const updatedTask = {
      taskStatus: "In progress",
    };

    try {
      const response = await taskStatusUpdate(selectedTask[0].id, updatedTask);
      if (response.status === 200) {
        reloadTheGrid();
      }
    } catch (error) {
      console.error("Error updating task Status:", error);
    }
  }

  async function handleButtonComplete() {
    await completeTask(selectedTask[0].id);

    console.log("task completed");

    const updatedTask = {
      taskStatus: "Completed",
    };

    try {
      const response = await taskStatusUpdate(selectedTask[0].id, updatedTask);
      if (response.status === 200) {
        const selectedId = selectedTask[0].id;
        setSelectedIdForTimeCalc(selectedId);

        console.log(" seleleted id in button complete", selectedId);

        await reloadTheGrid();
      }
    } catch (error) {
      console.error("Error updating task Status:", error);
    }
  }

  //  calculate total hours
  // based on start, pause, resume, and completed
  function calculateTotalHours() {
    console.log("in calculate");

    const matchedTask = tasks.find(
      (task) => task._id === selectedIdForTimeCalc
    );

    console.log("selected id for calc ", selectedIdForTimeCalc);
    console.log("matched task ", matchedTask);

    if (matchedTask && matchedTask.completeTime && matchedTask.startTime) {
      const completeTime = new Date(matchedTask.completeTime[0]);
      const startTime = new Date(matchedTask.startTime[0]);

      if (completeTime && startTime) {
        const totalMilisec = completeTime - startTime;

        const totalHours = (totalMilisec / (1000 * 60 * 60)).toFixed(2);
        const totalMin = (totalMilisec / (1000 * 60)).toFixed(2);

        console.log(`Total Time, Hours: ${totalHours} Min: ${totalMin}`);
        return totalHours;
      } else {
        console.log("Either start or complete time is missing");
      }
    } else {
      console.log("No matching task found or required fields are missing");
    }
  }

  // handles delete button
  // loops through selecedProject array
  // passes the id of selected project to the deleteProject function
  // setReloadGrid to rerender row list with newly deleted item
  // Reference: GitHub copilot
  async function handleButtonDelete() {
    for (const task of selectedTask) {
      const response = await deleteTask(task.id);

      if (response.status === 200) {
        console.log("projectTask", selectedTask[0].projectTask);

        const projectMatch = projects.find(
          (project) => project.projectName === selectedTask[0].projectTask
        );
        console.log("project that task will be deleted from", projectMatch._id);

        const taskObject = {
          taskId: task.id,
        };

        console.log(
          "inside handle delete btn, TASK that task will be deleted from project",
          taskObject.taskId
        );

        const projectId = projectMatch._id;

        const deleteResponse = await deleteTaskFromProject(
          projectId,
          taskObject
        );

        console.log("after deleting task from project", deleteResponse);

        reloadTheGrid();
      }
    }
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

  useEffect(() => {
    if (selectedIdForTimeCalc && tasks.length > 0) {
      calculateTotalHours();
    }
  }, [selectedIdForTimeCalc, tasks]);

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

    loadAllProjects();
  }, []);

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
    <div className=" p-[1rem] ">
      <div className=" p-[1rem] flex justify-between w-full">
        <div className="flex gap-8">
          <div>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleButtonAdd()}
            >
              Add Task
            </Button>
          </div>

          <div className="flex gap-4">
            {selectedTask.length === 1 &&
              selectedTask[0].taskStatus === "Not Started" && (
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() => handleButtonStart()}
                >
                  Start Task
                </Button>
              )}
            {selectedTask.length === 1 &&
              (selectedTask[0].taskStatus === "Started" ||
                selectedTask[0].taskStatus === "In progress") && (
                <div>
                  {" "}
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={() => handleButtonPause()}
                  >
                    Pause Task
                  </Button>
                </div>
              )}{" "}
            {selectedTask.length === 1 &&
              selectedTask[0].taskStatus === "Paused" && (
                <div>
                  <Button
                    variant="outlined"
                    color="info"
                    onClick={() => handleButtonResume()}
                  >
                    Resume Task
                  </Button>
                </div>
              )}
            {selectedTask.length === 1 &&
              selectedTask[0].taskStatus !== "Completed" && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleButtonComplete()}
                >
                  Complete Task
                </Button>
              )}
          </div>
        </div>

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
        projects={projects}
        addTaskToProject={addTaskToProject}
      ></TaskEditMenu>
    </div>
  );
};

export default TaskPage;
