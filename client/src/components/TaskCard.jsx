import React from "react";
import { Box, Typography } from "@mui/material";

const TaskCard = ({ task }) => {
  // Calculate current time spent if task is in progress
  const calculateCurrentTime = () => {
    if (task.totalTime) return task.totalTime;

    let totalMinutes = 0;
    const now = new Date().getTime();

    if (task.startTime && task.startTime.length > 0) {
      const startTime = new Date(task.startTime[0].$date.$numberLong).getTime();
      totalMinutes = Math.floor((now - startTime) / (1000 * 60));

      // Subtract pause periods
      if (task.pauseTime) {
        task.pauseTime.forEach((pause) => {
          const pauseStart = new Date(pause.start.$date.$numberLong).getTime();
          const pauseEnd = pause.end
            ? new Date(pause.end.$date.$numberLong).getTime()
            : now;
          totalMinutes -= Math.floor((pauseEnd - pauseStart) / (1000 * 60));
        });
      }
    }

    return `Minutes: ${totalMinutes}`;
  };

  // Determine background color based on priority
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "low":
        return "bg-green-600";
      case "medium":
        return "bg-yellow-600";
      case "high":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const timeSpent = calculateCurrentTime();

  return (
    <Box
      className={`w-full p-4 rounded-lg mb-4 ${getPriorityColor(
        task.priority
      )} bg-opacity-20`}
    >
      <div className="flex justify-between items-start mb-2">
        <Typography className="text-lg font-semibold">
          {task.taskName}
        </Typography>
        <span
          className={`px-2 py-1 rounded text-sm ${
            task.taskStatus === "Completed" ? "bg-green-500" : "bg-blue-500"
          } text-white`}
        >
          {task.taskStatus}
        </span>
      </div>

      <Typography className="text-sm mb-2 text-gray-200">
        {task.taskDesc}
      </Typography>

      <Typography className="text-sm text-gray-300">
        Time Spent: {timeSpent}
      </Typography>
    </Box>
  );
};

export default TaskCard;
