const priorityMap = { High: 3, Medium: 2, Low: 1 };
const getDisplayOrder = (priority, startDate) => {
  return priorityMap[priority] * 1000000 + new Date(startDate).getTime();
};
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
      progress:
        project.projectStatus === "Completed"
          ? 100
          : project.projectStatus === "In Progress"
          ? 50
          : 0,
      type: "project",
      hideChildren: false,
      displayOrder: 1,
    };

    console.log("taskIds:", taskIds);
    const projectTasks = tasks
      .filter((task) => taskIds.includes(task._id)) // Match task IDs
      .map((task, index) => {
        // Pass index to map
        // Determine task progress based on taskStatus
        const taskProgress =
          task.taskStatus === "Completed"
            ? 100
            : task.taskStatus === "In Progress"
            ? 50
            : 0;

        // Create the task object for Gantt chart
        return {
          start: new Date(task.startDate),
          end: new Date(task.dueDate),
          name: task.taskName,
          id: task._id, // Assuming _id is a string
          progress: taskProgress,
          type: "task",
          project: task.projectTask, // Reference to the project name
          displayOrder: index + 1, // Use index for display order
        };
      });

    console.log("projectTasks:", projectTasks);
    console.log("ganttProject:", ganttProject);
    console.log(
      "Task IDs before filtering:",
      tasks.map((task) => task._id)
    );
    console.log(
      "Filtered projectTasks:",
      projectTasks.map((task) => task.id)
    );

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
