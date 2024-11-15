import React from "react";
import "gantt-task-react/dist/index.css";
import { ViewMode } from "gantt-task-react";

const ViewSwitcher = ({ onViewModeChange, onViewListChange, isChecked }) => {
  return (
    <div
      className="ViewContainer"
      style={{
        listStyle: "none",
        msBoxOrient: "horizontal",
        display: "flex",
        WebkitJustifyContent: "flex-start",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <div>
        <button
          className="px-4 py-2 mx-2 bg-blue-500 text-white rounded"
          onClick={() => onViewModeChange(ViewMode.Day)}
        >
          Day
        </button>
        <button
          className="px-4 py-2 mx-2 bg-blue-500 text-white rounded"
          onClick={() => onViewModeChange(ViewMode.Week)}
        >
          Week
        </button>
        <button
          className="px-4 py-2 mx-2 bg-blue-500 text-white rounded"
          onClick={() => onViewModeChange(ViewMode.Month)}
        >
          Month
        </button>
        <button
          className="px-4 py-2 mx-2 bg-blue-500 text-white rounded"
          onClick={() => onViewModeChange(ViewMode.Year)}
        >
          Year
        </button>

        {/* Show Task List */}
        <div
          className="Switch"
          style={{
            margin: "4px 15px",
            fontSize: "14px",
            fontFamily:
              "Arial, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <label
            className="Switch_Toggle"
            style={{
              position: "relative",
              display: "inline-block",
              width: "60px",
              height: "30px",
              marginRight: "5px",
            }}
          >
            <input
              type="checkbox"
              defaultChecked={isChecked}
              onClick={() => onViewListChange(!isChecked)}
              style={{
                opacity: 0,
                width: 0,
                height: 0,
              }}
            />
            <span
              className="Slider"
              style={{
                position: "absolute",
                cursor: "pointer",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "#ccc",
                WebkitTransition: "0.4s",
                transition: "0.4s",
                ":before": {
                  position: "absolute",
                  content: '""',
                  height: "21px",
                  width: "21px",
                  left: "6px",
                  bottom: "4px",
                  backgroundColor: "white",
                  WebkitTransition: "0.4s",
                  transition: "0.4s",
                },
                ":checked + &": {
                  backgroundColor: "#2196f3",
                },
                ":focus + &": {
                  boxShadow: "0 0 1px #2196f3",
                },
                ":checked + &:before": {
                  WebkitTransform: "translateX(26px)",
                  msTransform: "translateX(26px)",
                  transform: "translateX(26px)",
                },
              }}
            />
          </label>
          Show Task List
        </div>
      </div>
    </div>
  );
};

export default ViewSwitcher;
