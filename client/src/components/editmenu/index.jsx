/**
 * This page component displays the Edit Menu
 *
 * destructs toggleForm, isOpen, setIsOpen
 *
 *
 */

import { useEffect, useState } from "react";

export default function EditMenu({
  toggleForm,
  isOpen,
  setIsOpen,
  selectedProject,
  updateProject,
  viewOpen,
  setViewOpen,
}) {
  // * state
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [dateCreated, setDateCreated] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  //*

  // conditional
  // check to make sure there is a value in selected projects
  // if there is then set the project default values for each input
  // if we dont have this here the default value triggers an undefined error on page load when there is no selection yet
  // dependencies : selectedProject
  useEffect(() => {
    if (selectedProject.length > 0) {
      setProjectId(selectedProject[0].id);
      setProjectName(selectedProject[0].projectName);
      setDateCreated(selectedProject[0].dateCreated);
      setAssignedTo(selectedProject[0].assignedTo);
      setProjectDescription(selectedProject[0].projectDesc);

      console.log("set project defaults");
    }
  }, [selectedProject]);

  // handles the submit from update form , takes in the submit event
  // prevents the default submit action
  // logs current project id
  // creates a new object with the updated state variables from the inputs
  // calls update project , pass the project id and updated project object
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("updating project", projectId);

    const updatedProject = {
      projectName: projectName,
      projectDesc: projectDescription,
      assignedTo: assignedTo,
      dateCreated: dateCreated,
    };

    updateProject(projectId, updatedProject);

    setIsOpen(false);
  };

  return (
    <div>
      <div
        className={`fixed inset-0 bg-gray-500 bg-opacity-40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleForm}
      />

      <div
        className={`fixed top-0 right-0 w-full max-w-2xl h-full bg-gray-800 text-gray-100 p-8 shadow-xl transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <h2 className="text-3xl font-bold mb-8 text-white">Add New Project</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="projectName"
              className="block text-sm font-medium mb-2 text-gray-300"
            >
              Project ID
            </label>
            <input
              type="text"
              id="projectName"
              defaultValue={projectId}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>
          <div>
            <label
              htmlFor="projectName"
              className="block text-sm font-medium mb-2 text-gray-300"
            >
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter Project name"
              disabled={viewOpen}
            />
          </div>

          <div>
            <label
              htmlFor="projectName"
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
              placeholder="Enter Project name"
              disabled={viewOpen}
            />
          </div>

          <div>
            <label
              htmlFor="dateCreated"
              className="block text-sm font-medium mb-2 text-gray-300"
            >
              Date Created
            </label>
            <input
              type="date"
              id="dateCreated"
              value={dateCreated}
              onChange={(e) => setDateCreated(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={viewOpen}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-2 text-gray-300"
            >
              Description
            </label>
            <textarea
              id="description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Enter task description"
              disabled={viewOpen}
            />
          </div>

          {viewOpen ? (
            <button
              type="button"
              className="w-full px-6 py-3 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={() => setViewOpen(!viewOpen)}
            >
              Edit
            </button>
          ) : (
            <button
              type="submit"
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Save Edit
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
