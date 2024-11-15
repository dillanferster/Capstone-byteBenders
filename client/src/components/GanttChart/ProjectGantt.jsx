import React, { useState, useEffect } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import ViewSwitcher from "./ViewSwitcher";
import {
  mapTasksToProjects,
  flattenProjectsAndTasks,
} from "../../utils/ganttHelper";

const ProjectGantt = ({ projects: projectsProp, tasks }) => {
  const [tasksForGantt, setTasksForGantt] = useState([]);
  const [viewMode, setViewMode] = useState(ViewMode.Week);
  const [isChecked, setIsChecked] = useState(true);
  const [viewDate, setViewDate] = useState(new Date());

  useEffect(() => {
    if (!projectsProp || projectsProp.length === 0) {
      setTasksForGantt([]);
      return;
    }

    // Map tasks to projects
    const projectsWithTasks = mapTasksToProjects(projectsProp, tasks);
    // Flatten the projects and tasks into a single tasks array
    const flattenedTasks = flattenProjectsAndTasks(projectsWithTasks);
    setTasksForGantt(flattenedTasks);
  }, [projectsProp, tasks]);

  const handleTaskChange = (task) => {
    console.log("Task changed:", task);
  };

  const handleProgressChange = (task) => {
    console.log("Progress changed:", task);
  };

  const handleSelect = (task, isSelected) => {
    console.log(task, isSelected);
  };

  const handleExpanderClick = (task) => {
    setTasksForGantt(task.map((t) => (t.id === task.id ? task : t)));
    console.log("On expander click Id:" + task.id);
  };

  if (!tasksForGantt.length) {
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
          tasks={tasksForGantt}
          viewMode={viewMode}
          viewDate={viewDate}
          onDateChange={handleTaskChange}
          onProgressChange={handleProgressChange}
          onSelect={handleSelect}
          onExpanderClick={handleExpanderClick}
          listCellWidth={"155px"}
          columnWidth={60}
          locale="en"
        />
      </div>
    </div>
  );
};

export default ProjectGantt;
