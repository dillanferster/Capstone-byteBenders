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
import projectSchema from "../../validations/projectValidation";

export default function EditMenu({
  toggleForm,
  isOpen,
  setIsOpen,
  selectedProject,
  updateProject,
  createProject,
  viewClicked,
  setViewClicked,
  addClicked,
  setAddClicked,
  editClicked,
  setEditClicked,
  reloadTheGrid,
}) {
  // * state
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [dateCreated, setDateCreated] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [caseId, setCaseId] = useState("");
  const [dataClassification, setDataClassification] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [quickBaseLink, setQuickBaseLink] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [errors, setErrors] = useState({});

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
      setCaseId(selectedProject[0].caseId);
      setDataClassification(selectedProject[0].dataClassification);
      setAssignedTo(selectedProject[0].assignedTo);
      setProjectStatus(selectedProject[0].projectStatus);
      setQuickBaseLink(selectedProject[0].quickBaseLink);
      setProjectDescription(selectedProject[0].projectDesc);

      console.log("set project defaults");
    } else {
      clearAddInputs();
    }
  }, [selectedProject]);

  function clearAddInputs() {
    setProjectId("");
    setProjectName("");
    setDateCreated("");
    setCaseId("");
    setDataClassification("");
    setAssignedTo("");
    setProjectStatus("");
    setQuickBaseLink("");
    setProjectDescription("");
  }

  // handles the submit from update form
  // logs current project id
  // creates a new object with the updated state variables from the inputs
  // calls update project , pass the project id and updated project object
  // .then makes sure response returned from database operation was successful before reloading grid
  const submitUpdatedProject = async () => {
    const updatedProject = {
      projectName: projectName,
      projectDesc: projectDescription,
      caseId: caseId,
      dataClassification: dataClassification,
      assignedTo: assignedTo,
      projectStatus: projectStatus,
      quickBaseLink: quickBaseLink,
      dateCreated: dateCreated,
    };

    try {
      const isValid = await projectSchema.validate(updatedProject, {
        abortEarly: false,
      });
      if (isValid) {
        console.log("data is valid");
        setErrors({});
        try {
          const response = await updateProject(projectId, updatedProject);
          if (response.status === 200) {
            reloadTheGrid();
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

  // handles the submit from add button
  // logs current project id
  // creates a new object with the updated state variables from the inputs
  // calls update project , pass the project id and updated project object
  // .then makes sure response returned from database operation was successful before reloading grid
  const submitAddedProject = async () => {
    const addedProject = {
      projectName: projectName,
      projectDesc: projectDescription,
      caseId: caseId,
      dataClassification: dataClassification,
      assignedTo: assignedTo,
      projectStatus: projectStatus,
      quickBaseLink: quickBaseLink,
      dateCreated: dateCreated,
    };

    // createProject(addedProject).then((response) => {
    //   console.log("adding project", response);

    //   if (response.status === 200) {
    //     reloadTheGrid();
    //     toggleForm();
    //     clearAddInputs();
    //   }
    // });

    try {
      const isValid = await projectSchema.validate(addedProject, {
        abortEarly: false,
      });
      if (isValid) {
        console.log("data is valid");
        setErrors({});
        try {
          const response = await createProject(addedProject);
          if (response.status === 200) {
            reloadTheGrid();
            toggleForm();
            clearAddInputs();
            setAddClicked(!addClicked);
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
        className={`fixed inset-0 bg-gray-500 bg-opacity-40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => handleClickOff()}
      />

      <div
        className={`fixed top-0 right-0 w-full max-w-2xl h-full bg-[#1f2a40] text-gray-100 p-8 z-[10] shadow-xl transition-transform duration-300 ease-in-out transform overflow-y-scroll ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <h2 className="text-3xl font-bold mb-8 text-white">Project</h2>

        <form className="space-y-6">
          <div className="flex justify-between">
            <div className="w-[18rem]">
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
                placeholder={
                  addClicked ? "ID will be generated automatically" : ""
                }
              />
            </div>
            <div className="w-[18rem]">
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
                disabled={viewClicked}
              />
              {errors.projectName && (
                <div className="text-red-600">{errors.projectName}</div>
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="w-[18rem]">
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
                placeholder="Assign Project"
                disabled={viewClicked}
              />
              {errors.assignedTo && (
                <div className="text-red-600">{errors.assignedTo}</div>
              )}
            </div>

            <div className="w-[18rem]">
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
                {addClicked && (
                  <option value="" disabled={addClicked}>
                    --Select an option--
                  </option>
                )}
                <option value="In progress">In Progress</option>
                <option value="Complete">Complete</option>
                <option value="Not started">Not Started</option>
                <option value="Storage">Storage</option>
              </select>
            </div>
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
              disabled={viewClicked}
            />
            {errors.dateCreated && (
              <div className="text-red-600">{errors.dateCreated}</div>
            )}
          </div>
          <div className="flex justify-between">
            <div className="w-[18rem]">
              <label
                htmlFor="caseId"
                className="block text-sm font-medium mb-2 text-gray-300"
              >
                Case ID (Quickbase)
              </label>
              <input
                type="number"
                id="projectName"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Enter Case Id"
                disabled={viewClicked}
              />
              {errors.caseId && (
                <div className="text-red-600">{errors.caseId}</div>
              )}
            </div>

            <div className="w-[18rem]">
              <label
                htmlFor="projectName"
                className="block text-sm font-medium mb-2 text-gray-300"
              >
                QuickBase Case Link
              </label>
              <input
                type="text"
                id="quickBaseLink"
                value={quickBaseLink}
                onChange={(e) => setQuickBaseLink(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Enter QuickBase Link"
                disabled={viewClicked}
              />
              {errors.quickBaseLink && (
                <div className="text-red-600">{errors.quickBaseLink}</div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="dataClassification"
              className="block text-sm font-medium mb-2 text-gray-300"
            >
              Data Classification
            </label>
            <input
              type="text"
              id="projectName"
              value={dataClassification}
              onChange={(e) => setDataClassification(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter data classification"
              disabled={viewClicked}
            />
            {errors.dataClassification && (
              <div className="text-red-600">{errors.dataClassification}</div>
            )}
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
              placeholder="Enter Description"
              disabled={viewClicked}
            />
            {errors.projectDesc && (
              <div className="text-red-600">{errors.projectDesc}</div>
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
                submitUpdatedProject();
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
                submitAddedProject();
              }}
            >
              Add Project
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
