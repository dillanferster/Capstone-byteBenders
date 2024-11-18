import React from "react";
import "gantt-task-react/dist/index.css";
import { ViewMode } from "gantt-task-react";
import "./Gantt.css";
const ViewSwitcher = ({ onViewModeChange, onViewListChange, isChecked }) => {
  const handleViewModeChange = (mode) => {
    onViewModeChange(mode);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "left",
        marginBottom: "5px",
        padding: "5px",
      }}
    >
      {Object.values(ViewMode).map((mode) => (
        <button
          key={mode}
          className="px-4 py-2 mx-2 bg-blue-500 text-white rounded hover:bg-orange-300"
          onClick={() => handleViewModeChange(mode)}
        >
          {mode}
        </button>
      ))}

      {/* Show Task List */}
      <div
        className="gantt-task-name"
        style={{ margin: "4px 15px", display: "flex", alignItems: "center" }}
      >
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onViewListChange(!isChecked)}
          style={{ marginRight: "5px" }}
        />
        <label style={{ fontSize: "14px" }}> Show Projects & Tasks List </label>
      </div>
    </div>
  );
};

export default ViewSwitcher;
