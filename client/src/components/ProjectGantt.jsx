import React, { useState, useEffect } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";

const ProjectGantt = ({ projects: projectsProp }) => {
  const [tasks, setTasks] = useState([]);
  const [viewMode, setViewMode] = useState(ViewMode.Week);

  useEffect(() => {
    if (!projectsProp || projectsProp.length === 0) {
      setTasks([
        {
          start: new Date(),
          end: new Date(Date.now() + 86400000),
          name: "No projects",
          id: "default",
          type: "task",
          progress: 0,
          isDisabled: true,
        },
      ]);
      return;
    }

    const ganttTasks = projectsProp.map((project) => {
      const startDate = new Date(project.dateCreated);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);

      return {
        start: startDate,
        end: endDate,
        name: project.projectName,
        id: project._id,
        type: "task",
        progress:
          project.projectStatus === "Completed"
            ? 100
            : project.projectStatus === "In Progress"
            ? 50
            : 0,
        isDisabled: false,
        styles: {
          progressColor: "#ffbb54",
          progressSelectedColor: "#ff9e0d",
        },
      };
    });

    const validTasks = ganttTasks.filter(
      (task) =>
        task.start instanceof Date &&
        !isNaN(task.start) &&
        task.end instanceof Date &&
        !isNaN(task.end)
    );

    setTasks(validTasks);
  }, [projectsProp]);

  const handleTaskChange = (task) => {
    console.log("Task changed:", task);
  };

  const handleProgressChange = (task) => {
    console.log("Progress changed:", task);
  };

  const handleSelect = (task, isSelected) => {
    console.log(task, isSelected);
  };

  if (!tasks.length) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          height: "500px",
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
          overflow: "auto",
        }}
      >
        <Gantt
          tasks={tasks}
          viewMode={viewMode}
          onDateChange={handleTaskChange}
          onProgressChange={handleProgressChange}
          onSelect={handleSelect}
          listCellWidth={"155px"}
          columnWidth={60}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          className="px-4 py-2 mx-2 bg-blue-500 text-white rounded"
          onClick={() => setViewMode(ViewMode.Day)}
        >
          Day
        </button>
        <button
          className="px-4 py-2 mx-2 bg-blue-500 text-white rounded"
          onClick={() => setViewMode(ViewMode.Week)}
        >
          Week
        </button>
        <button
          className="px-4 py-2 mx-2 bg-blue-500 text-white rounded"
          onClick={() => setViewMode(ViewMode.Month)}
        >
          Month
        </button>
      </div>
    </div>
  );
};

export default ProjectGantt;
