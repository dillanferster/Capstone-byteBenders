// Helper function to map tasks to projects
const mapTasksToProjects = (projects, tasks) => {
  if (!Array.isArray(projects) || !Array.isArray(tasks)) {
    console.error("Invalid input: projects or tasks is not an array");
    return [];
  }

  console.log("Projects:", projects); // Log projects
  console.log("Tasks:", tasks); // Log tasks

  return projects.map((project) => {
    // Ensure TaskIdForProject is defined and is an array
    const taskIds = project.TaskIdForProject || [];
    const projectProgress =
      project.projectStatus === "Completed"
        ? 100
        : project.projectStatus === "In Progress"
        ? 50
        : project.projectStatus === "Paused"
        ? 25
        : 0;
    // Create the project object for Gantt chart
    const ganttProject = {
      start: new Date(project.dateCreated),
      end: new Date(
        new Date(project.dateCreated).setDate(
          new Date(project.dateCreated).getDate() + 14
        )
      ), // 14 days from start date
      name: project.projectName,
      id: project._id, // Assuming _id is a string
      progress: projectProgress,
      type: "project",
      hideChildren: false,
    };

    console.log("taskIds:", taskIds);
    const projectTasks = tasks
      .filter((task) => taskIds.includes(task._id)) // Match task IDs
      .map((task) => {
        // Determine task progress based on taskStatus
        const taskProgress =
          task.taskStatus === "Completed"
            ? 100
            : task.taskStatus === "In Progress"
            ? 50
            : task.taskStatus === "Paused"
            ? 25
            : 0;

        // // Check if dependencies is an array
        // if (Array.isArray(task.dependencies) && task.dependencies.length > 0) {
        //   console.log("task.dependencies:", task.dependencies[0]);
        // Create the task object for Gantt chart
        return {
          start: new Date(task.startDate) || new Date(),
          end: new Date(task.dueDate) || new Date(),
          name: task.taskName,
          id: task._id, // Assuming _id is a string
          progress: taskProgress,
          type: "task",
          project: ganttProject.id,
          dependencies: Array.isArray(task.dependencies)
            ? task.dependencies.map((dep) => dep.toString()) // Convert ObjectId to string if necessary
            : [],
        };
      });

    // Check if there are no tasks and add a placeholder task
    // if (projectTasks.length === 0) {
    //   projectTasks.push({
    //     start: ganttProject.start,
    //     end: ganttProject.start,
    //     name: "No task in project", // Placeholder message
    //     id: `${ganttProject.id}-no-tasks`, // Unique ID for the placeholder
    //     progress: 0,
    //     type: "task",
    //     dependencies: [],
    //     project: ganttProject.id, // Reference to the project id
    //   });
    // }

    return { ganttProject, projectTasks };
  });
};

// Function to flatten the projects and tasks into a single tasks array
const flattenProjectsAndTasks = (projectsWithTasks) => {
  return projectsWithTasks.flatMap(({ ganttProject, projectTasks }) => [
    ganttProject,
    ...projectTasks,
  ]);
};

// Export functions
export { mapTasksToProjects, flattenProjectsAndTasks };
