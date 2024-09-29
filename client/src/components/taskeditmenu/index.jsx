/**
 * This page component displays the Edit Menu
 *
 * destructs toggleForm, isOpen, setIsOpen
 *
 *
 *
 * TO DO NOTES : crud operations working but delay when updated or added into DB, refreshs before it is added sometiems
 * need to wait for db confirmation before reloading the grid
 */

import { useEffect, useState } from "react";

export default function TaskEditMenu({
  toggleForm,
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
  reloadTheGrid,
  projects,
  addTaskToProject,
}) {
  // * state
  const [taskId, setTaskId] = useState("");
  const [projectTask, setProjectTask] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [addChronicles, setAddChronicles] = useState("");
  const [attachments, setAttachments] = useState("");
  const [chroniclesComplete, setChroniclesComplete] = useState("");

  //*

  // conditional
  // check to make sure there is a value in selected projects
  // if there is then set the project default values for each input
  // if we dont have this here the default value triggers an undefined error on page load when there is no selection yet
  // dependencies : selectedProject
  useEffect(() => {
    if (selectedTask.length > 0) {
      setTaskId(selectedTask[0].id);
      setAssignedTo(selectedTask[0].assignedTo);
      setTaskStatus(selectedTask[0].taskStatus);
      setPriority(selectedTask[0].priority);
      setTaskCategory(selectedTask[0].taskCategory);
      setStartDate(selectedTask[0].startDate);
      setDueDate(selectedTask[0].dueDate);
      setProjectStatus(selectedTask[0].projectStatus);
      setAddChronicles(selectedTask[0].addChronicles);
      setAttachments(selectedTask[0].attachments);
      setChroniclesComplete(selectedTask[0].chroniclesComplete);

      console.log("set task defaults");
    } else {
      clearAddInputs();
    }
  }, [selectedTask]);

  function clearAddInputs() {
    setTaskId("");
    setAssignedTo("");
    setTaskStatus("");
    setPriority("");
    setTaskCategory("");
    setStartDate("");
    setDueDate("");
    setProjectStatus("");
    setAddChronicles("");
    setAttachments("");
    setChroniclesComplete("");
  }

  const updateTaskToProject = (taskId, projectTask) => {
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
  };

  // handles the submit from update form
  // logs current project id
  // creates a new object with the updated state variables from the inputs
  // calls update project , pass the project id and updated project object
  const submitUpdatedTask = () => {
    setEditClicked(!editClicked);

    const updatedTask = {
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
      chroniclesComplete: chroniclesComplete,
    };

    updateTask(taskId, updatedTask).then((response) => {
      console.log("updating task", taskId);

      if (response.status === 200) {
        toggleForm();

        reloadTheGrid();
        clearAddInputs();
      }
    });

    updateTaskToProject(taskId, projectTask);
  };

  const submitAddedTask = () => {
    setAddClicked(!addClicked);

    const addedTask = {
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
      chroniclesComplete: chroniclesComplete,
    };

    createTask(addedTask).then((response) => {
      console.log("updating task", taskId);

      if (response.status === 200) {
        reloadTheGrid();
        toggleForm();
        clearAddInputs();
      }
    });
  };

  // handles click off menu
  // closes menu and resets button states

  const handleClickOff = () => {
    setAddClicked(false);
    setEditClicked(false);
    setViewClicked(false);

    toggleForm();
  };
  return (
    <div>
      <div
        className={`fixed inset-0 bg-gray-500 bg-opacity-40 backdrop-blur-sm transition-opacity duration-300  ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => handleClickOff()}
      />

      <div
        className={`fixed top-0 right-0 w-full max-w-2xl h-full bg-gray-800 text-gray-100 p-8 z-[10] shadow-xl transition-transform duration-300 ease-in-out transform overflow-y-scroll ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <h2 className="text-3xl font-bold mb-8 text-white">Add New Task</h2>

        <form className="space-y-6">
          <div>
            <label
              htmlFor="taskId"
              className="block text-sm font-medium mb-2 text-gray-300"
            >
              Task ID
            </label>
            <input
              type="text"
              id="taskName"
              defaultValue={taskId}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
              placeholder={
                addClicked ? "ID will be generated automatically" : ""
              }
            />
          </div>

          <div>
            <label
              htmlFor="projectTask"
              className="block text-sm font-medium mb-2 text-gray-300"
            >
              Project
            </label>
            <select
              id="projectTask"
              value={projectTask}
              onChange={(e) => setProjectTask(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={viewClicked}
            >
              {projects.map((project) => (
                <option key={project._id} value={project.projectName}>
                  {project.projectName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="assignedTo"
              className="block text-sm font-medium mb-2 text-gray-300"
            >
              Assigned To
            </label>
            <input
              type="text"
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Assign"
              disabled={viewClicked}
            />
          </div>

          <div>
            <label
              htmlFor="taskStatus"
              className="block text-sm font-medium mb-2 text-gray-300"
            >
              Task Status
            </label>
            <select
              id="taskStatus"
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={viewClicked}
            >
              <option value="In progress">In Progress</option>
              <option value="Complete">Complete</option>
              <option value="Not started">Not Started</option>
              <option value="Storage">Storage</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium mb-2 text-gray-300"
            >
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={viewClicked}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="taskCategory"
              className="block text-sm font-medium mb-2 text-gray-300"
            >
              Task Category
            </label>
            <input
              type="text"
              id="taskCategory"
              value={taskCategory}
              onChange={(e) => setTaskCategory(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter Category"
              disabled={viewClicked}
            />
          </div>

          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium mb-2 text-gray-300"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={viewClicked}
            />
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium mb-2 text-gray-300"
            >
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={viewClicked}
            />
          </div>

          <div>
            <label
              htmlFor="projectStatus"
              className="block text-sm font-medium mb-2 text-gray-300"
            >
              Project Status
            </label>
            <select
              id="projectStatus"
              value={projectStatus}
              onChange={(e) => setProjectStatus(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={viewClicked}
            >
              <option value="In progress">In Progress</option>
              <option value="Complete">Complete</option>
              <option value="Not started">Not Started</option>
              <option value="Storage">Storage</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="addChronicles"
              className="block text-sm font-medium mb-2 text-gray-300"
            >
              Add Chronicles
            </label>
            <input
              type="text"
              id="addChronicles"
              value={addChronicles}
              onChange={(e) => setAddChronicles(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Add Chronicles"
              disabled={viewClicked}
            />
          </div>

          <div>
            <label
              htmlFor="attachments"
              className="block text-sm font-medium mb-2 text-gray-300"
            >
              Attachments
            </label>
            <textarea
              id="attachments"
              value={attachments}
              onChange={(e) => setAttachments(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Enter Attachments"
              disabled={viewClicked}
            />
          </div>

          <div>
            <label
              htmlFor="chroniclesComplete"
              className="block text-sm font-medium mb-2 text-gray-300"
            >
              Chronicles Complete
            </label>
            <textarea
              id="chroniclesComplete"
              value={chroniclesComplete}
              onChange={(e) => setChroniclesComplete(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Chronicles Completes"
              disabled={viewClicked}
            />
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
    </div>
  );
}
