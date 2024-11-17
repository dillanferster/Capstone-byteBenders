import React from "react";
import "gantt-task-react/dist/index.css";
import { ViewMode } from "gantt-task-react";

const ViewSwitcher = ({ onViewModeChange, onViewListChange, isChecked }) => {
  const handleViewModeChange = (mode) => {
    onViewModeChange(mode);
  };

  return (
    <div
      className="ViewContainer"
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
        padding: "10px",
      }}
    >
      {Object.values(ViewMode).map((mode) => (
        <button
          key={mode}
          className="px-4 py-2 mx-2 bg-blue-500 text-white rounded"
          onClick={() => handleViewModeChange(mode)}
        >
          {mode}
        </button>
      ))}

      {/* Show Task List */}
      <div
        className="Switch"
        style={{ margin: "4px 15px", display: "flex", alignItems: "center" }}
      >
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onViewListChange(!isChecked)}
          style={{ marginRight: "5px" }}
        />
        <label style={{ fontSize: "16px" }}> Show Projects & Tasks List </label>
      </div>
    </div>
  );
};

export default ViewSwitcher;
