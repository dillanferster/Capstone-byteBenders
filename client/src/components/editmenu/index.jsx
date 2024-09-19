import { useState } from "react";

export default function EditMenu({ toggleForm, isOpen, setIsOpen }) {
  const [projectName, setProjectName] = useState("");
  const [dateCreated, setDateCreated] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ projectName, date, description });
    // Here you would typically send this data to your backend
    setIsOpen(false);
  };

  return (
    <div>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleForm}
      />

      <div
        className={`fixed top-0 right-0 w-full max-w-md h-full bg-gray-800 text-gray-100 p-8 shadow-lg transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <h2 className="text-3xl font-bold mb-8 text-white">Add New Project</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Enter task description"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
}
