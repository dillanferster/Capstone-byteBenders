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

import React, { useCallback } from "react";
import { useState, useEffect, useMemo, useRef } from "react";
import Header from "../../components/Header";

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
  taskTotalTime,
  getProjects,
  addTaskToProject,
  deleteTaskFromProject,
} from "../../api.js";
import ProjectGrid from "../../components/projectgrid/index.jsx";
import TaskEditMenu from "../../components/taskeditmenu/index.jsx";
import TaskBoard from "../../components/taskboard/index.jsx";

import { useTheme } from "@mui/material";
import { tokens } from "../../theme.js";

import { useSocket } from "../../contexts/SocketContext.jsx";
import ProjectGantt from "../../components/GanttChart/ProjectGantt.jsx";

//

// columns for AG grid
// field: corresponds to a row with a matching property ex. field: id in column matches to id: in rows
// headerName: column display name
// filter: allows for column filtering
// floating filter: displayed filter search bar
// editable: sets to false, does not allow a double click to be able to edit the cell
// References: https://www.ag-grid.com/react-data-grid/getting-started/
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
    field: "totalTime",
    headerName: "Time on Task",
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
  {
    field: "dependencies",
    headerName: "Dependencies ID",
    filter: true,
    floatingFilter: true,
    editable: false,
  },
  {
    field: "dependenciesName",
    headerName: "Dependencies name",
    filter: true,
    floatingFilter: true,
    editable: false,
  },
];

const TaskPage = () => {
  //* state
  const [tasks, setTasks] = useState([]); // Loaded projects from database

  const [projects, setProjects] = useState([]); // Loaded projects from database
  const [isLoading, setIsLoading] = useState(); // state for loading
  const [selectedTask, setSelectedTask] = useState([]); // selected task array, when users click on projects in data table
  const [selectedIdForTimeCalc, setSelectedIdForTimeCalc] = useState(); // id for time calculation
  const [reloadGrid, setReloadGrid] = useState(false); // to update grid rows
  const [isOpen, setIsOpen] = useState(false); // for edit  menu
  const [viewClicked, setViewClicked] = useState(false); // for view button
  const [addClicked, setAddClicked] = useState(false); // for add button
  const [editClicked, setEditClicked] = useState(false); // for add button
  const [deleteOpen, setDeleteOpen] = useState(false); //for dlt btn
  const [accumulatedRollingTimes, setAccumulatedRollingTimes] = useState({});

  const [taskBoardOpen, setTaskBoardOpen] = useState(false);
  const [listToggled, setListToggled] = useState(true);
  const [boardToggled, setBoardToggled] = useState(false);
  const [ganttToggled, setGanttToggled] = useState(false);
  const [reloadTaskBoard, setReloadTaskBoard] = useState(false);
  // const socket = useSocket();

  const [showGantt, setShowGantt] = useState(false); // to show gantt chart

  // State to track the current view mode
  const [currentView, setCurrentView] = useState("list"); // Default view is "list"

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //*

  // tasks object array from the database
  // rows maps the tasks list to the corresponding fields that match to the ag grid field columns for the datagrid component
  // rows is then passed into the datagrid component
  // useMemo so when the taskPage component reloads from state changes the rows dont reload with it, only when tasks or reloadGrid state is changed
  // dependencies : tasks, reloadGrid
  // References: https://www.ag-grid.com/react-data-grid/getting-started/
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
        projectId: task.projectId,
        projectStatus: task.projectStatus,
        addChronicles: task.addChronicles,
        taskDesc: task.taskDesc,
        attachments: task.attachments,
        startTime: task.startTime,
        completeTime: task.completeTime,
        totalTime: task.totalTime,
        dependencies: task.dependencies,
        dependenciesName: "",
        chroniclesComplete: task.chroniclesComplete,
      })),
    [tasks]
  );

  /// Default style props for AG data grid
  // sortable : allows columns to be sorted
  // width: sets a column width
  // maxWidth: defines max width for columns
  // References: https://www.ag-grid.com/react-data-grid/getting-started/
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
  // References: https://www.ag-grid.com/react-data-grid/getting-started/
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

    // socket.emit("taskNotification", {
    //   message: `Task "${selectedTask[0]?.taskName}" was created.`,
    //   action: "add",
    // });
  }

  // function handles edit button
  // calls toggleForm
  function handleButtonEdit() {
    setEditClicked(!editClicked);
    toggleForm();

    // socket.emit("taskNotification", {
    //   message: `Task "${selectedTask[0]?.taskName}" was edited.`,
    //   action: "edit",
    // });
  }

  // updates grid usestate to cause a re-render
  const reloadTheGrid = () => {
    console.log("Starting grid reload");
    setReloadGrid((prev) => !prev);
    console.log("ReloadGrid state updated");
  };

  // function handles view button
  // calls toggleForm
  function handleButtonView() {
    setViewClicked(!viewClicked);
    console.log("set view to", viewClicked);
    toggleForm();
    // socket.emit("taskNotification", {
    //   message: `Task "${selectedTask[0]?.taskName}" was viewed.`,
    //   action: "view",
    // });
  }

  // handles button start task
  // calls startTask route
  async function handleButtonStart(selectedTask) {
    if (!selectedTask || selectedTask.length === 0) return;
    startTask(selectedTask[0].id);
    console.log("task started from drag and drop");

    const updatedTask = {
      taskStatus: "In Progress",
    };

    try {
      const response = await taskStatusUpdate(selectedTask[0].id, updatedTask);
      if (response.status === 200) {
        reloadTheGrid();
        setReloadTaskBoard((prev) => !prev);
        // socket.emit("taskNotification", {
        //   message: `Task "${selectedTask[0]?.taskName}" was started.`,
        //   taskId: selectedTask[0].id,
        //   taskName: selectedTask[0].taskName,
        //   action: "start",
        // });
      }
    } catch (error) {
      console.error("Error updating task Status:", error);
    }
  }

  // handles button pause task
  // calls pauseTask route
  async function buttonPause(selectedTask) {
    pauseTask(selectedTask[0].id);
    console.log("task Paused");

    const updatedTask = {
      taskStatus: "Paused",
    };

    try {
      const response = await taskStatusUpdate(selectedTask[0].id, updatedTask);
      if (response.status === 200) {
        const selectedId = selectedTask[0].id;
        reloadTheGrid();
        setReloadTaskBoard((prev) => !prev);
        // socket.emit("taskNotification", {
        //   message: `Task "${selectedTask[0]?.taskName}" was paused.`,
        //   action: "pause",
        // });

        return selectedId;
      }
    } catch (error) {
      console.error("Error updating task Status:", error);
    }
  }

  // handles button resume task
  // calls resumeTask route
  async function handleButtonResume() {
    // Check if selectedTask is defined and has at least one element
    if (!selectedTask || selectedTask.length === 0) {
      console.error("No task selected for resume.");
      return; // Exit the function if no task is selected
    }

    const taskId = selectedTask[0].id; // Safely access the first task's ID

    resumeTask(taskId);
    console.log("task Resumed");

    const updatedTask = {
      taskStatus: "In Progress",
    };

    try {
      const response = await taskStatusUpdate(taskId, updatedTask);
      if (response.status === 200) {
        reloadTheGrid();
        setReloadTaskBoard((prev) => !prev);
        // socket.emit("taskNotification", {
        //   message: `Task "${selectedTask[0]?. taskName}" was resumed.`,
        //   action: "resume",
        // });
      }
    } catch (error) {
      console.error("Error updating task Status:", error);
    }
  }

  // Update Task total time in AG grid column table
  async function updateTotalTime(completeTaskId, finalTime) {
    console.log("in task total time", finalTime);

    const updatedTime = {
      totalTime: finalTime,
    };

    try {
      const response = await taskTotalTime(completeTaskId, updatedTime);
      if (response && response.status === 200) {
        reloadTheGrid();
      }
    } catch (error) {
      console.error("Error updating total time:", error);
    }
  }

  // handles when complete is pressed,
  // logs complete time and changes the status in database,
  // Reference Claude.ai prompt:  "why is my state variable for selected task not updating "
  async function buttonComplete(selectedTask) {
    // Check if selectedTask is defined and has at least one element
    if (!selectedTask || selectedTask.length === 0) {
      console.error("No task selected for completion.");
      return; // Exit the function if no task is selected
    }

    const taskId = selectedTask[0].id; // Safely access the first task's ID

    await completeTask(taskId);
    console.log("task completed");

    const updatedTask = {
      taskStatus: "Completed",
    };

    try {
      const response = await taskStatusUpdate(taskId, updatedTask);
      if (response.status === 200) {
        const selectedId = taskId;

        console.log("selected id in button complete", selectedId);

        await reloadTheGrid();
        setReloadTaskBoard((prev) => !prev);
        // socket.emit("taskNotification", {
        //   message: `Task "${selectedTask[0]?.taskName}" was completed.`,
        //   taskId: selectedTask[0].id,
        //   taskName: selectedTask[0].taskName,
        //   action: "complete",
        //   });
        return selectedId;
      }
    } catch (error) {
      console.error("Error updating task Status:", error);
    }
  }

  // calculate total hours
  // based on start, pause, resume, and completed
  // Reference Claude.ai prompt:  "how can I calculate total time for UCT inputs in mongodb and react app"
  function calculateTotalHours(completeTaskObject) {
    console.log("in calculate");

    console.log("selected id for calc ", completeTaskObject);

    if (
      completeTaskObject &&
      completeTaskObject.completeTime &&
      completeTaskObject.startTime
    ) {
      const completeTime = new Date(completeTaskObject.completeTime[0]);
      const startTime = new Date(completeTaskObject.startTime[0]);
      let totalPause = 0;

      if (completeTime && startTime) {
        const totalMilisec = completeTime - startTime - totalPause;
        let finalTime = 0;

        if (completeTaskObject.pauseTime) {
          completeTaskObject.pauseTime.forEach((time) => {
            let start = new Date(time.start);
            let end = new Date(time.end);

            totalPause += end - start;
          });
        }

        console.log("total pause time", totalPause);

        const totalMin = (totalMilisec / (1000 * 60)).toFixed(2);

        finalTime = `Minutes: ${totalMin}`;

        console.log(`Total Time, Min: ${totalMin}`);
        return finalTime;
      } else {
        console.log("Either start or complete time is missing");
      }
    } else {
      console.log("No matching task found or required fields are missing");
    }
  }

  function calculatePauseTime(completeTaskObject) {
    if (
      completeTaskObject &&
      completeTaskObject.startTime &&
      completeTaskObject.pauseTime &&
      completeTaskObject.pauseTime.length > 1
    ) {
      const pauseList = completeTaskObject.pauseTime;

      let totalPauseTime = 0;
      let pauseStartTime = 0;
      let pauseEndTime = 0;

      for (let index = 0; index < pauseList.length; index++) {
        const pauseItem = pauseList[index];

        if (index === 0) {
          pauseEndTime = new Date(pauseItem.end);
        } else {
          pauseStartTime = new Date(pauseItem.start);
          const newPauseTime = pauseStartTime - pauseEndTime;
          totalPauseTime += newPauseTime;

          pauseEndTime = new Date(pauseItem.end);
        }
      }

      const totalMin = parseFloat((totalPauseTime / (1000 * 60)).toFixed(2));
      console.log("total rolling time", totalMin);
      return totalMin;
    } else {
      // calculate just start and first pause
      const startTime = new Date(completeTaskObject.startTime[0]);
      const pauseTime = new Date(completeTaskObject.pauseTime[0].start);

      console.log("start time pause button", startTime);
      console.log("pause time pause button", pauseTime);

      let totalTime = pauseTime - startTime;
      const totalMin = parseFloat((totalTime / (1000 * 60)).toFixed(2));
      return totalMin;
    }
  }

  /// handle pause
  // calculates rolling time for pause and resume
  // Reference Cluade.ai prompt : "im making a rolling time calculator the times are working. On the first click the finalTime is returned in handelPauseAndCalculate and passed into updateTotal time this all works , now on sencond run the finaltime is returned again but i need a way to add it to the final tie in the first run through but not sure how. this is becase the first time it runs and every other time it runs the finalTime is caculateed different inside of calculatePauseTime."
  async function handlePauseandCalculate(selectedTask) {
    // Check if selectedTask is defined and has at least one element
    if (!selectedTask || selectedTask.length === 0) {
      console.error("No task selected for pause calculation.");
      return; // Exit the function if no task is selected
    }

    const taskId = selectedTask[0].id; // Safely access the first task's ID

    const completeId = await buttonPause(selectedTask);
    if (completeId) {
      const completeTaskObject = await getTask(completeId);
      const newTime = calculatePauseTime(completeTaskObject);

      // functional update, adds new rolling time to id , key value pair
      // taskid: rolling time
      // ... creates new array so we dont directly mutate the state
      // prev makes sure we are using the most up to date value
      setAccumulatedRollingTimes((prevTimes) => {
        const updatedTime = (prevTimes[taskId] || 0) + newTime;
        const formattedTime = `Minutes: ${updatedTime}`;

        // Use setTimeout to ensure state has been updated before calling updateTotalTime
        setTimeout(() => {
          // console.log(
          //   `After pause calc for task ${taskId}, new time: ${newTime}, total accumulated time: ${updatedTime}`
          // );
          updateTotalTime(completeId, formattedTime);
        }, 0);

        return {
          ...prevTimes,
          [taskId]: updatedTime,
        };
      });
      reloadTheGrid();
    }
  }

  // handle function for complete button click
  async function handleCompleteandCalculate(selectedTask) {
    const completeId = await buttonComplete(selectedTask);
    if (completeId) {
      const completeTaskObject = await getTask(completeId);
      const finalTime = calculateTotalHours(completeTaskObject);
      updateTotalTime(completeId, finalTime);
    }
  }

  // handles delete button
  // loops through selecedProject array
  // passes the id of selected project to the deleteProject function
  // setReloadGrid to rerender row list with newly deleted item
  // Reference: GitHub copilot
  async function handleButtonDelete() {
    setDeleteOpen((prev) => !prev);

    for (const task of selectedTask) {
      let projectId = "";
      const response = await deleteTask(task.id);

      if (response.status === 200) {
        console.log("projectTask: ", selectedTask[0].projectId);

        projectId = selectedTask[0].projectId;

        const taskObject = {
          taskId: task.id,
        };

        // console.log(
        //   "inside handle delete btn, TASK that task will be deleted from project",
        //   taskObject.taskId
        // );

        const deleteResponse = await deleteTaskFromProject(
          projectId,
          taskObject
        );

        reloadTheGrid();
        setReloadTaskBoard((prev) => !prev);
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

  // Handlers to change the view mode
  const handleListClick = () => {
    setCurrentView("list");
    setTaskBoardOpen(false);
    setShowGantt(false);
    setSelectedTask([]);
  };

  const handleBoardClick = () => {
    setCurrentView("board");
    setTaskBoardOpen(true);
    setShowGantt(false);
    setSelectedTask([]);
  };

  const handleGanttClick = () => {
    setCurrentView("gantt");
    setTaskBoardOpen(false);
    setShowGantt(true);
    setSelectedTask([]);
  };

  const handleOpenGanttViewMenu = (gantttask) => {
    // Log the task to see its structure
    console.log("Task received in handleOpenGanttViewMenu:", gantttask);

    // Check if task is defined and has the expected properties
    if (!gantttask || !gantttask.id) {
      console.error("Invalid task object:", gantttask);
      return; // Exit the function if task is invalid
    }

    // Proceed with finding the project
    const task = tasks.find((t) => t._id === gantttask.id);
    console.log("task", task);

    const mappedTask = tasks.map((t) => ({
      taskStatus: t.taskStatus,
      priority: t.priority,
      taskCategory: t.taskCategory,
      startDate: t.startDate,
      dueDate: t.dueDate,
      projectTask: t.projectTask,
      projectStatus: t.projectStatus,
      addChronicles: t.addChronicles,
      taskDesc: t.taskDesc,
      attachments: t.attachments,
      startTime: t.startTime,
      completeTime: t.completeTime,
      totalTime: t.totalTime,
      dependencies: t.dependencies,
      chroniclesComplete: t.chroniclesComplete,
      projectId: t.projectId,
      pauseTime: t.pauseTime,
      id: t._id,
      taskName: t.taskName,
      assignedTo: t.assignedTo,
    }));
    console.log("mappedTask", mappedTask);
    const moreMappedTask = mappedTask.filter((t) => t.id === gantttask.id);
    console.log("moreMappedTask", moreMappedTask);

    if (moreMappedTask) {
      setSelectedTask(moreMappedTask);
      console.log("selected Task", moreMappedTask);
      setViewClicked(!viewClicked);
      console.log("set view to", viewClicked);
      toggleForm();
    } else {
      console.error("Project not found for task:", task);
    }
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

    loadAllProjects();
  }, []);

  // loads all TASKS from database into list
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
        console.log("New task data received:", data);
        setTasks(data);
        setIsLoading(false);
      }
    }

    loadAllTasks();
  }, [reloadGrid]);

  return (
    <div className="p-5 ">
      <div display="flex" justifyContent="space-between" alignItems="center">
        <Header title="TASKS" subtitle="Welcome to your dashboard" />
      </div>
      <div className=" pb-[1rem] flex justify-between   w-full ">
        {" "}
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleButtonAdd()}
        >
          Add Task
        </Button>
        <div className="flex mx-1">
          <div
            className="flex w-[8rem] p-1 rounded-md justify-around transition-all duration-100 "
            style={{
              border: `1px solid ${colors.primary[100]}`,
              color: `${colors.primary[100]}`,
            }}
          >
            <button
              className={`p-1 rounded-md w-[3rem] transition-all duration-100`}
              style={{
                background:
                  currentView === "list" ? colors.blueAccent[700] : "",
              }}
              onClick={handleListClick}
            >
              List
            </button>
            <button
              className={`p-1 rounded-md w-[3rem] transition-all duration-100 `}
              style={{
                background:
                  currentView === "board" ? colors.blueAccent[700] : "",
              }}
              onClick={handleBoardClick}
            >
              Board
            </button>
            <button
              className={`p-1 rounded-md w-[3rem] transition-all duration-100 `}
              style={{
                background:
                  currentView === "gantt" ? colors.blueAccent[700] : "",
              }}
              onClick={handleGanttClick}
            >
              Gantt
            </button>
          </div>
        </div>
      </div>

      {currentView === "list" && (
        <>
          <div className=" pb-[1rem] flex justify-between w-full ">
            <div className="flex gap-8">
              <div className="flex gap-4">
                {selectedTask.length === 1 &&
                  selectedTask[0].taskStatus === "Not Started" && (
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={() => handleButtonStart(selectedTask)}
                    >
                      Start Task
                    </Button>
                  )}
                {selectedTask.length === 1 &&
                  (selectedTask[0].taskStatus === "Started" ||
                    selectedTask[0].taskStatus === "In Progress") && (
                    <div>
                      {" "}
                      <Button
                        variant="outlined"
                        color="warning"
                        onClick={() => handlePauseandCalculate(selectedTask)}
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
                        onClick={handleButtonResume}
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
                      onClick={() => handleCompleteandCalculate(selectedTask)}
                    >
                      Complete Task
                    </Button>
                  )}
              </div>
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
              )}

              {selectedTask.length === 1 && !deleteOpen && (
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
              {selectedTask.length > 0 && !deleteOpen && (
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
            tasks={tasks}
            addTaskToProject={addTaskToProject}
            reloadTaskBoard={reloadTaskBoard}
            setReloadTaskBoard={setReloadTaskBoard}
          ></TaskEditMenu>
        </>
      )}
      {currentView === "board" && (
        <>
          <TaskBoard
            reloadTaskBoard={reloadTaskBoard}
            setReloadTaskBoard={setReloadTaskBoard}
            setIsOpen={setIsOpen}
            setViewClicked={setViewClicked}
            setSelectedTask={setSelectedTask}
            handleButtonStart={handleButtonStart}
            handleButtonPause={handlePauseandCalculate}
            handleButtonResume={handleButtonResume}
            handleButtonComplete={handleCompleteandCalculate}
            handleButtonDelete={handleButtonDelete}
          />
          <TaskEditMenu
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            reloadTaskBoard={reloadTaskBoard}
            setReloadTaskBoard={setReloadTaskBoard}
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
            tasks={tasks}
            addTaskToProject={addTaskToProject}
          ></TaskEditMenu>
        </>
      )}
      {currentView === "gantt" && (
        <>
          <ProjectGantt
            projects={projects}
            tasks={tasks}
            onTaskDoubleClick={handleOpenGanttViewMenu}
          />
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
            tasks={tasks}
            addTaskToProject={addTaskToProject}
          ></TaskEditMenu>
        </>
      )}
    </div>
  );
};

export default TaskPage;
