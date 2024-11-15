import React from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";

const TaskGantt = ({ tasks }) => {
  // Flatten the projects and tasks into a single tasks array
  const tasks = projects.flatMap((project) => [
    {
      id: project._id,
      name: project.projectName,
      start: project.startDate,
      end: project.endDate,
      progress: project.progress,
      type: "project",
      hideChildren: false,
    },
    ...project.tasks.map((task) => ({
      id: task.id,
      name: task.name,
      start: task.start,
      end: task.end,
      progress: task.progress,
      type: "task",
      project: project.name,
    })),
  ]);

  const [viewMode, setViewMode] = useState(ViewMode.Week);
  const [isChecked, setIsChecked] = useState(true);
  const [viewDate, setViewDate] = useState(new Date());

  const handleTaskChange = (task) => {
    console.log("Task changed:", task);
  };

  const handleProgressChange = (task) => {
    console.log("Progress changed:", task);
  };

  const handleSelect = (task, isSelected) => {
    console.log(task, isSelected);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Gantt
        tasks={tasks}
        viewMode={ViewMode.Week} // Set the initial view mode
        onDateChange={handleTaskChange}
        onProgressChange={handleProgressChange}
        onSelect={handleSelect}
        listCellWidth={"155px"}
        columnWidth={60}
        locale="en" // Set the locale for month names
      />
    </div>
  );
};

export default TaskGantt;
