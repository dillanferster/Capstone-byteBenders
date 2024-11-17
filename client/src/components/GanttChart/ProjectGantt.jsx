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
  let columnWidth = 65;
  if (viewMode === ViewMode.Year) {
    columnWidth = 430;
  } else if (viewMode === ViewMode.Day) {
    columnWidth = 50;
  } else if (viewMode === ViewMode.Month) {
    columnWidth = 260;
  } else if (viewMode === ViewMode.Week) {
    columnWidth = 80;
  }
  useEffect(() => {
    if (projectsProp.length > 0) {
      const projectsWithTasks = mapTasksToProjects(projectsProp, tasks);
      const flattenedTasks = flattenProjectsAndTasks(projectsWithTasks);
      setTasksForGantt(flattenedTasks);
    } else {
      setTasksForGantt([]);
    }
  }, [projectsProp, tasks]);

  const handleTaskChange = (task) => console.log("Task changed:", task);
  const handleProgressChange = (task) => console.log("Progress changed:", task);
  const handleSelect = (task, isSelected) => console.log(task, isSelected);
  const handleExpanderClick = (task) => {
    setTasksForGantt(tasksForGantt.map((t) => (t.id === task.id ? task : t)));
    console.log("On expander click Id:" + task.id + task.name);
  };
  const handleDblClick = (task) => console.log("On double click Id:" + task.id);
  const handleClick = (task) => console.log("On click Id:" + task.id);

  if (!tasksForGantt.length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div
        style={{
          height: "750px",
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "10px",
          maxWidth: "100%",
        }}
      >
        <ViewSwitcher
          onViewModeChange={setViewMode}
          onViewListChange={setIsChecked}
          isChecked={isChecked}
        />
        <div>
          <Gantt
            tasks={tasksForGantt}
            viewMode={viewMode}
            viewDate={viewDate}
            onDateChange={handleTaskChange}
            onProgressChange={handleProgressChange}
            onSelect={handleSelect}
            onDoubleClick={handleDblClick}
            onClick={handleClick}
            onExpanderClick={handleExpanderClick}
            listCellWidth={isChecked ? "120px" : ""}
            columnWidth={columnWidth}
            ganttHeight={600}
            style={{ maxWidth: "100%", overflowX: "hidden" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectGantt;
