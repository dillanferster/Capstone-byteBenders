import React, { useState, useEffect } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import ViewSwitcher from "./ViewSwitcher";
import {
  mapTasksToProjects,
  flattenProjectsAndTasks,
} from "../../utils/ganttHelper";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import "./Gantt.css";
import { useNavigate } from "react-router-dom";
import { getProject, getTask } from "../../api";

const ProjectGantt = ({ projects: projectsProp, tasks, onTaskDoubleClick }) => {
  const [tasksForGantt, setTasksForGantt] = useState([]);
  const [selectedTask, setSelectedTask] = useState();
  const [viewMode, setViewMode] = useState(ViewMode.Week);
  const [isChecked, setIsChecked] = useState(true);
  const [viewDate, setViewDate] = useState(new Date());
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  let columnWidth = 65;
  if (viewMode === ViewMode.Year) {
    columnWidth = 400;
  } else if (viewMode === ViewMode.Day) {
    columnWidth = 50;
  } else if (viewMode === ViewMode.Month) {
    columnWidth = 240;
  } else if (viewMode === ViewMode.Week) {
    columnWidth = 85;
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

  const handleTaskChange = (task) => {
    console.log("On date change Id:" + task.id);
    // let newTasks = tasks.map((t) => (t.id === task.id ? task : t));

    // if (task.project) {
    //   const [start, end] = getStartEndDateForProject(newTasks, task.project);
    //   const projectIndex = newTasks.findIndex((t) => t.id === task.project);
    //   const project = newTasks[projectIndex];

    //   if (
    //     project.start.getDate() !== start.getDate() ||
    //     project.end.getDate() !== end.getDate()
    //   ) {
    //     const changedProject = { ...project, start, end };
    //     newTasks = newTasks.map((t) =>
    //       t.id === task.project ? changedProject : t
    //     );
    //   }
    // }

    // setTasksForGantt(newTasks); // Update the state with the new tasks
  };
  const handleProgressChange = (task) => {
    setTasksForGantt(tasksForGantt.map((t) => (t.id === task.id ? task : t)));
    console.log("Progress changed:", task);
  };

  const handleSelect = (task, isSelected) => {
    console.log(task.id + " has " + (isSelected ? "selected" : "unselected"));
  };
  const handleExpanderClick = (task) => {
    setTasksForGantt(tasksForGantt.map((t) => (t.id === task.id ? task : t)));
    console.log("On expander click Id:" + task.id + task.name);
  };

  const handleDblClick = (task) => {
    console.log("On double click Id:" + task.id);
    if (onTaskDoubleClick) {
      onTaskDoubleClick(task); // Call the passed function
    } else {
      console.error("onTaskDoubleClick is not a function");
    }
  };

  const handleClick = (task) => {
    console.log("On click Id:" + task.id);
  };

  if (!tasksForGantt.length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div
        style={{
          height: "700px",
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
        <div className="gantt-task-name">
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
            ganttHeight={550}
            style={{
              maxWidth: "100%",
              overflowY: "scroll",
            }}
            barFill={70}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectGantt;
