/**
 * This page component displays the Edit Menu
 *
 * destructs toggleForm, isOpen, setIsOpen
 *
 *
 *
 */

import React, { useContext, useEffect, useState } from "react";
import taskSchema from "../../validations/taskValidation.js";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme.js";
import "./index.css";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import { Box, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import "react-resizable/css/styles.css";
export default function EmailEditMenu({
  isOpen,
  setIsOpen,
  selectedTask,
  updateTask,
  createTask,
  viewClicked,
  setViewClicked,
  addClicked,
  setAddClicked,
  editClicked,
  setEditClicked,
  projects,
  tasks,
  addTaskToProject,
  setReloadTaskBoard,
  reloadTaskBoard,
}) {
  // Theme hooks
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // All useState declarations
  const [dimensions, setDimensions] = useState({ width: 500, height: 700 });
  const [taskId, setTaskId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [projectTask, setProjectTask] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [addChronicles, setAddChronicles] = useState("");
  const [attachments, setAttachments] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [chroniclesComplete, setChroniclesComplete] = useState("");
  const [dependencies, setDependencies] = useState([""]);
  const [errors, setErrors] = useState({});

  // Clear inputs function
  const clearAddInputs = () => {
    setTaskId("");
    setTaskName("");
    setAssignedTo("");
    setTaskStatus("");
    setPriority("");
    setTaskCategory("");
    setStartDate("");
    setDueDate("");
    setProjectStatus("");
    setAddChronicles("");
    setTaskDesc("");
    setAttachments("");
    setChroniclesComplete("");
    setProjectTask("");
    setDependencies([""]);
  };

  // conditional
  // check to make sure there is a value in selected projects
  // if there is then set the project default values for each input
  // if we dont have this here the default value triggers an undefined error on page load when there is no selection yet
  // dependencies : selectedProject
  useEffect(() => {
    if (selectedTask.length > 0) {
      setTaskId(selectedTask[0].id);
      setTaskName(selectedTask[0].taskName);
      setAssignedTo(selectedTask[0].assignedTo);
      setTaskStatus(selectedTask[0].taskStatus);
      setPriority(selectedTask[0].priority);
      setTaskCategory(selectedTask[0].taskCategory);
      setStartDate(selectedTask[0].startDate);
      setDueDate(selectedTask[0].dueDate);
      setProjectTask(selectedTask[0].projectTask);
      setProjectStatus(selectedTask[0].projectStatus);
      setAddChronicles(selectedTask[0].addChronicles);
      setAttachments(selectedTask[0].attachments);
      setTaskDesc(selectedTask[0].taskDesc);
      setChroniclesComplete(selectedTask[0].chroniclesComplete);
      setDependencies(selectedTask[0].dependencies);
      console.log("set task defaults");
    } else {
      clearAddInputs();
    }
  }, [selectedTask]);

  // Conditional return after all hooks
  if (!isOpen) return null;

  const toggleForm = () => {
    setIsOpen(!isOpen);
  };

  // takes in the current taskId and projectTask (project name)
  // finds the project object that matches the project name, gets the id from it
  // calls addTaskToProject to update the project task array
  function updateTaskToProject(taskId) {
    const foundProject = projects.find(
      (project) => project.projectName === projectTask
    );

    const foundProjectId = foundProject._id;

    const taskIdObject = {
      taskId: taskId,
    };

    console.log(
      `in add task to project, task id: ${taskId} projectId ${foundProjectId}`
    );
    addTaskToProject(foundProjectId, taskIdObject);
  }

  // handles the submit from update form
  // logs current project id
  // creates a new object with the updated state variables from the inputs
  // calls update project , pass the project id and updated project object
  const submitUpdatedTask = async () => {
    const updatedTask = {
      taskName: taskName,
      assignedTo: assignedTo,
      taskStatus: taskStatus,
      priority: priority,
      taskCategory: taskCategory,
      startDate: startDate,
      dueDate: dueDate,
      projectTask: projectTask,
      projectStatus: projectStatus,
      addChronicles: addChronicles,
      attachments: attachments,
      taskDesc: taskDesc,
      chroniclesComplete: chroniclesComplete,
      dependencies: dependencies,
    };

    ///// Reference, Claude.AI prompt: "Can you help make yup form validation schema for react app form"
    try {
      const isValid = await taskSchema.validate(updatedTask, {
        abortEarly: false,
      });
      if (isValid) {
        console.log("data is valid");
        setErrors({});
        try {
          const response = await updateTask(taskId, updatedTask);
          console.log("response", response.status);
          if (response.status === 200) {
            await updateTaskToProject(taskId, projectTask);

            setReloadTaskBoard((prev) => !prev);

            clearAddInputs();
            setEditClicked(!editClicked);
          }
        } catch (error) {
          console.error("Error updating task:", error);
        }
      }
    } catch (err) {
      const errorMessages = {};
      err.inner.forEach((error) => {
        errorMessages[error.path] = error.message;
      });

      console.log(errorMessages.taskName);
      console.log(errorMessages);

      setErrors((prev) => ({ ...errorMessages }));
    }
  };

  // function, async
  // handles the submit from add task
  // logs current project id
  // creates a new object with the state variables from the inputs
  // we await the createTask so we can confirm that the item was added to database
  // await updateTaskProject to make sure we update the task array
  // uses the response id to pass into update
  // then we call reloadGrid which reloads the rows, toggleFrom closes menu, and clearInputs
  // Reference : PHIND , prompt : "how is that different from using .then like how i have it"
  const submitAddedTask = async () => {
    const addedTask = {
      taskName: taskName,
      assignedTo: assignedTo,
      projectId: projectId,
      taskStatus: "Not Started",
      priority: priority,
      taskCategory: taskCategory,
      startDate: startDate,
      dueDate: dueDate,
      projectTask: projectTask,
      projectStatus: projectStatus,
      addChronicles: addChronicles,
      taskDesc: taskDesc,
      attachments: attachments,
      chroniclesComplete: chroniclesComplete,
      dependencies: dependencies,
    };

    try {
      const isValid = await taskSchema.validate(addedTask, {
        abortEarly: false,
      });
      if (isValid) {
        console.log("data is valid");
        setErrors({});
        try {
          const response = await createTask(addedTask);
          if (response.status === 200) {
            const newTaskId = response.data.insertedId;
            console.log("New task ID:", newTaskId);
            await updateTaskToProject(newTaskId);
            // reloadTheGrid();
            // setReloadTaskBoard((prev) => !prev);
            toggleForm();
            clearAddInputs();
            setAddClicked(false);
          }
        } catch (error) {
          console.error("Error creating task:", error);
        }
      }
    } catch (err) {
      const errorMessages = {};
      err.inner.forEach((error) => {
        errorMessages[error.path] = error.message;
      });

      console.log(errorMessages.taskName);
      console.log(errorMessages);

      setErrors((prev) => ({ ...errorMessages }));
    }
  };

  const handleProjectChange = (selectedProject) => {
    setProjectId(selectedProject._id);
    setProjectTask(selectedProject.projectName);
    setProjectStatus(selectedProject.projectStatus);
  };

  // handles click off menu
  // closes menu and resets button states

  // const handleClickOff = () => {
  //   setAddClicked(false);
  //   setEditClicked(false);
  //   setViewClicked(false);
  //   reloadTheGrid();

  // toggleForm();
  // console.log("handleClickOff");
  // console.log(
  //   "addClicked, editClicked, viewClicked",
  //   addClicked,
  //   editClicked,
  //   viewClicked
  // );
  // };

  return (
    /**
     * Draggable component
     * handle is the header of the modal
     * defaultPosition is the starting position of the modal
     * bounds is the parent of the modal
     */
    <Draggable
      handle=".modal-header"
      defaultPosition={{ x: 50, y: 50 }}
      bounds="parent"
    >
      <ResizableBox
        width={dimensions.width}
        height={dimensions.height}
        minConstraints={[300, 300]}
        maxConstraints={[1200, 800]}
        onResize={(e, { size }) => {
          setDimensions({ width: size.width, height: size.height });
        }}
        resizeHandles={["se"]}
        className="box"
      >
        <div
          className="modal-container"
          style={{
            backgroundColor: colors.primary[400],
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Modal Header */}
          <div className="modal-header flex justify-between items-center p-4 cursor-move">
            <h2
              className="text-xl font-bold"
              style={{ color: colors.grey[100] }}
            >
              {addClicked
                ? "Add Task"
                : editClicked
                ? "Edit Task"
                : "View Task"}
            </h2>
            <IconButton
              onClick={() => {
                toggleForm();
                clearAddInputs();
              }}
              sx={{ color: colors.grey[100] }}
            >
              <Close />
            </IconButton>
          </div>

          {/* Modal Content */}
          <div
            className="modal-content"
            style={{
              padding: "20px",
              overflowY: "auto",
              flex: 1,
            }}
          >
            <form className="space-y-6">
              <div className="flex justify-between">
                {" "}
                <div className="w-[18rem]">
                  <label
                    htmlFor="taskId"
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.grey[300] }}
                  >
                    Task ID
                  </label>
                  <input
                    type="text"
                    id="taskName"
                    defaultValue={taskId}
                    className="w-full px-4 py-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: colors.primary[300],
                      color: colors.grey[200],
                    }}
                    disabled
                    placeholder={
                      addClicked ? "ID will be generated automatically" : ""
                    }
                  />
                </div>
                <div className="w-[18rem] ">
                  <label
                    htmlFor="taskName"
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.grey[300] }}
                  >
                    Task Name
                  </label>

                  <input
                    type="text"
                    id="taskName"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: colors.primary[300],
                      color: colors.grey[200],
                    }}
                    disabled={viewClicked}
                    placeholder={addClicked ? "Add task name" : ""}
                  />
                  {errors.taskName && (
                    <div className="text-red-600">{errors.taskName}</div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                {" "}
                <div className="w-[18rem]">
                  <label
                    htmlFor="projectTask"
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.grey[300] }}
                  >
                    Project
                  </label>
                  <select
                    id="projectTask"
                    value={projectTask}
                    onChange={(e) => {
                      const selectedProject = projects.find(
                        (p) => p.projectName === e.target.value
                      );
                      handleProjectChange(selectedProject);
                    }}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: colors.primary[300],
                      color: colors.grey[200],
                    }}
                    disabled={viewClicked}
                  >
                    {addClicked && (
                      <option value="" disabled={addClicked}>
                        --Select an option--
                      </option>
                    )}

                    {projects.map((project) => (
                      <option key={project._id} value={project.projectName}>
                        {project.projectName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-[18rem]">
                  <label
                    htmlFor="projectStatus"
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.grey[300] }}
                  >
                    Project Status
                  </label>
                  <input
                    type="text"
                    id="projectStatus"
                    value={projectStatus}
                    onChange={(e) => setProjectStatus(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: colors.primary[300],
                      color: colors.grey[200],
                    }}
                    disabled
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <div className="w-[16rem]">
                  <label
                    htmlFor="assignedTo"
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.grey[300] }}
                  >
                    Assigned To
                  </label>
                  <input
                    type="text"
                    id="assignedTo"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: colors.primary[300],
                      color: colors.grey[200],
                    }}
                    required
                    placeholder="Assign"
                    disabled={viewClicked}
                  />
                  {errors.assignedTo && (
                    <div className="text-red-600">{errors.assignedTo}</div>
                  )}
                </div>
                <div className="w-[16rem]">
                  <label
                    htmlFor="dependencies"
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.grey[300] }}
                  >
                    Dependencies
                  </label>
                  <select
                    id="dependencies"
                    value={dependencies}
                    defaultValue=""
                    onChange={(e) => {
                      const selectedOptions = Array.from(
                        e.target.selectedOptions
                      ).map((option) => option.value);
                      setDependencies(selectedOptions);
                    }}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: colors.primary[300],
                      color: colors.grey[200],
                    }}
                    disabled={viewClicked}
                  >
                    {addClicked && (
                      <option value="" disabled={addClicked}>
                        --Select an option--
                      </option>
                    )}
                    {tasks.map((task) => (
                      <option key={task._id} value={task._id}>
                        {task.taskName}
                      </option>
                    ))}
                    <option value="">None</option>
                  </select>
                </div>
                <div className="w-[16rem]">
                  <label
                    htmlFor="taskStatus"
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.grey[300] }}
                  >
                    Task Status
                  </label>
                  <input
                    type="text"
                    id="taskStatus"
                    value={taskStatus || "Not Started"}
                    onChange={(e) => setTaskStatus(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: colors.primary[300],
                      color: colors.grey[200],
                    }}
                    disabled
                  />
                </div>
              </div>

              <div className="flex justify-between">
                {" "}
                <div className="w-[18rem]">
                  <label
                    htmlFor="priority"
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.grey[300] }}
                  >
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: colors.primary[300],
                      color: colors.grey[200],
                    }}
                    disabled={viewClicked}
                  >
                    {addClicked && (
                      <option value="" disabled={addClicked}>
                        --Select an option--
                      </option>
                    )}
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="w-[18rem]">
                  <label
                    htmlFor="taskCategory"
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.grey[300] }}
                  >
                    Category
                  </label>
                  <input
                    type="text"
                    id="taskCategory"
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: colors.primary[300],
                      color: colors.grey[200],
                    }}
                    required
                    placeholder="Enter Category"
                    disabled={viewClicked}
                  />
                  {errors.taskCategory && (
                    <div className="text-red-600">{errors.taskCategory}</div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                {" "}
                <div className="w-[18rem]">
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.grey[300] }}
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: colors.primary[300],
                      color: colors.grey[200],
                    }}
                    required
                    disabled={viewClicked}
                  />
                  {errors.startDate && (
                    <div className="text-red-600">{errors.startDate}</div>
                  )}
                </div>
                <div className="w-[18rem]">
                  <label
                    htmlFor="dueDate"
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.grey[300] }}
                  >
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: colors.primary[300],
                      color: colors.grey[200],
                    }}
                    required
                    disabled={viewClicked}
                  />
                  {errors.dueDate && (
                    <div className="text-red-600">{errors.dueDate}</div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                {" "}
                <div className="w-[18rem]">
                  <label
                    htmlFor="addChronicles"
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.grey[300] }}
                  >
                    Add Chronicles
                  </label>
                  <input
                    type="text"
                    id="addChronicles"
                    value={addChronicles}
                    onChange={(e) => setAddChronicles(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: colors.primary[300],
                      color: colors.grey[200],
                    }}
                    required
                    placeholder="Add Chronicles"
                    disabled={viewClicked}
                  />
                  {errors.addChronicles && (
                    <div className="text-red-600">{errors.addChronicles}</div>
                  )}
                </div>
                <div className="w-[18rem]">
                  <label
                    htmlFor="chroniclesComplete"
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.grey[300] }}
                  >
                    Chronicles Complete
                  </label>
                  <input
                    id="chroniclesComplete"
                    value={chroniclesComplete}
                    onChange={(e) => setChroniclesComplete(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: colors.primary[300],
                      color: colors.grey[200],
                    }}
                    rows={4}
                    placeholder="Chronicles Completes"
                    disabled={viewClicked}
                  />
                  {errors.chroniclesComplete && (
                    <div className="text-red-600">
                      {errors.chroniclesComplete}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="Description"
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.grey[300] }}
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: colors.primary[300],
                    color: colors.grey[200],
                  }}
                  rows={4}
                  placeholder="Enter Desc"
                  disabled={viewClicked}
                />
                {errors.taskDesc && (
                  <div className="text-red-600">{errors.taskDesc}</div>
                )}
              </div>

              <div>
                <label
                  htmlFor="attachments"
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.grey[300] }}
                >
                  Attachments
                </label>
                <input
                  id="attachments"
                  value={attachments}
                  onChange={(e) => setAttachments(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: colors.primary[300],
                    color: colors.grey[200],
                  }}
                  rows={4}
                  placeholder="Enter Attachments"
                  disabled={viewClicked}
                />
                {errors.attachments && (
                  <div className="text-red-600">{errors.attachments}</div>
                )}
              </div>

              {viewClicked && (
                <button
                  type="button"
                  className="w-full px-6 py-3 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  onClick={(e) => {
                    e.preventDefault();
                    setViewClicked(!viewClicked);
                    setEditClicked(!editClicked);
                  }}
                >
                  Edit
                </button>
              )}

              {editClicked && (
                <button
                  type="button"
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  onClick={(e) => {
                    e.preventDefault();
                    submitUpdatedTask();
                  }}
                >
                  Save Edit
                </button>
              )}

              {addClicked && (
                <button
                  type="button"
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  onClick={(e) => {
                    e.preventDefault();
                    submitAddedTask();
                  }}
                >
                  Add Task
                </button>
              )}
            </form>
          </div>
          {/* Resize Handle */}
          <div
            className="resize-handle"
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "20px",
              height: "20px",
              cursor: "se-resize",
            }}
          />
        </div>
      </ResizableBox>
    </Draggable>
  );
}
