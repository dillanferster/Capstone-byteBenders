import React, { useState, useEffect } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import ViewSwitcher from "./ViewSwitcher";

const ProjectGantt = ({ projects: projectsProp }) => {
  const [tasks, setTasks] = useState([]);
  const [viewMode, setViewMode] = useState(ViewMode.Week);
  const [isChecked, setIsChecked] = useState(true);
  const [viewDate, setViewDate] = useState(new Date());

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

    const ganttTasks = projectsProp
      .map((project) => {
        const [year, month, day] = project.dateCreated.split("-").map(Number);
        const startDate = new Date(Date.UTC(year, month - 1, day));

        if (isNaN(startDate.getTime())) {
          console.error(
            `Invalid date for project ${project.projectName}:`,
            project.dateCreated
          );
          return null;
        }

        let endDate;

        if (project.projectStatus === "Completed") {
          endDate = new Date();
        } else {
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 14);
        }

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
            progressColor:
              project.projectStatus === "Completed" ? "#4caf50" : "#ffbb54",
            progressSelectedColor:
              project.projectStatus === "Completed" ? "#45a049" : "#ff9e0d",
          },
        };
      })
      .filter((task) => task !== null);

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
          height: "700px",
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
          overflow: "auto",
        }}
      >
        <ViewSwitcher
          onViewModeChange={(viewMode) => setViewMode(viewMode)}
          onViewListChange={setIsChecked}
          isChecked={isChecked}
        />
        <Gantt
          tasks={tasks}
          viewMode={viewMode}
          viewDate={viewDate}
          onDateChange={handleTaskChange}
          onProgressChange={handleProgressChange}
          onSelect={handleSelect}
          listCellWidth={"155px"}
          columnWidth={60}
          locale="en"
        />
      </div>
    </div>
  );
};

export default ProjectGantt;
