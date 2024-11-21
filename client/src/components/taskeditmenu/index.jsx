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

import { useContext, useEffect, useState } from "react";
import taskSchema from "../../validations/taskValidation";

import { useTheme } from "@mui/material";
import { tokens } from "../../theme.js";

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
  tasks,
  addTaskToProject,
  setReloadTaskBoard,
  reloadTaskBoard,
}) {
  // * state
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

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //*

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

  function clearAddInputs() {
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
    setAttachments([]);
    setChroniclesComplete("");
    setProjectTask("");
    setDependencies([""]);
  }

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
      projectId: projectId,
      projectStatus: projectStatus,
      addChronicles: addChronicles,
      attachments: attachments,
      taskDesc: taskDesc,
      chroniclesComplete: chroniclesComplete,
      dependencies: dependencies,
    };

    ///// Refereance, Claude.AI prompt: "Can you help make yup form validation schema for react app form"
    try {
      const isValid = await taskSchema.validate(updatedTask, {
        abortEarly: false,
      });
      if (isValid) {
        console.log("data is valid");
        setErrors({});
        try {
          const response = await updateTask(taskId, updatedTask);
          if (response.status === 200) {
            await updateTaskToProject(taskId, projectTask);

            reloadTheGrid();

            setReloadTaskBoard((prev) => !prev);

            toggleForm();
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
            reloadTheGrid();
            setReloadTaskBoard((prev) => !prev);
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

  const handleClickOff = () => {
    setAddClicked(false);
    setEditClicked(false);
    setViewClicked(false);
    reloadTheGrid();

    toggleForm();
  };

  // Add this function to handle file to base64 conversion
  // Reference: cursor / Claude.AI prompt : "how to convert file to base64"
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Modify the file input handler
  // Reference: cursor / Claude.AI prompt : "how to convert file to base64"
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const base64Files = [];

    for (const file of files) {
      try {
        const base64 = await convertFileToBase64(file);
        base64Files.push({
          name: file.name,
          type: file.type,
          data: base64,
        });
      } catch (error) {
        console.error("Error converting file to base64:", error);
      }
    }

    setAttachments(base64Files);
  };

  return (
    <div>
      <div
        className={`fixed inset-0 bg-gray-500/20 backdrop-blur-sm transition-opacity duration-300 z-[10]   ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => handleClickOff()}
      />

      <div
        className={`fixed top-0 right-0 w-full max-w-2xl h-full text-gray-100 p-8 z-[10] shadow-xl transition-transform duration-300 ease-in-out transform overflow-y-scroll ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: colors.primary[400], opacity: 0.98 }}
      >
        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: colors.grey[100] }}
        >
          Task
        </h2>

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
                <div className="text-red-600">{errors.chroniclesComplete}</div>
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
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-4 py-2 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-800 file:text-sm hover:file:bg-primary-700 file:bg-gray-300"
              style={{
                backgroundColor: colors.primary[300],
                color: colors.grey[500],
              }}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              disabled={viewClicked}
              required="false"
            />
            {errors.attachments && (
              <div className="text-red-600">{errors.attachments}</div>
            )}

            <div className="mt-4 space-y-2">
              {Array.isArray(attachments) &&
                attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-700 rounded"
                  >
                    <div className="flex gap-4 items-center">
                      {file.type?.startsWith("image/") ? (
                        <img
                          src={file.data}
                          alt={file.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-300">
                          {file.name || `File ${index + 1}`}
                        </span>
                      )}

                      <div className="flex gap-3">
                        <a
                          href={file.data}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          View
                        </a>
                        <a
                          href={file.data}
                          download={file.name || `File ${index + 1}`}
                          className="text-green-400 hover:text-green-300"
                        >
                          Download
                        </a>
                      </div>
                    </div>

                    {!viewClicked && (
                      <button
                        onClick={() => {
                          const newAttachments = [...attachments];
                          newAttachments.splice(index, 1);
                          setAttachments(newAttachments);
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
            </div>
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
