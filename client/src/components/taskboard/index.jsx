/**
 * Ref: https://www.youtube.com/watch?v=O5lZqqy7VQE&t=264s&ab_channel=TomIsLoading
 */

import React, { Fragment, useState, useEffect } from "react";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  startTask,
  pauseTask,
  resumeTask,
  completeTask,
  taskStatusUpdate,
  taskTotalTime,
  getProjects,
  addTaskToProject,
  deleteTaskFromProject,
} from "../../api.js";

import { useTheme } from "@mui/material";
import { tokens } from "../../theme.js";

const Column = ({
  title,
  headingColor,
  cards,
  setCards,
  column,
  setIsOpen,
  setViewClicked,
  setSelectedTask,
  handleButtonStart,
  handleButtonPause,
  handleButtonResume,
  handleButtonComplete,
  setIsDeleteModalOpen,
}) => {
  const [active, setActive] = useState();

  const handleCardClick = (e, card) => {
    if (e.detail === 2) {
      setViewClicked((prev) => !prev);
      setIsOpen((prev) => !prev);

      const selectedTaskCard = [
        {
          id: card._id,
          taskName: card.taskName,
          assignedTo: card.assignedTo,
          taskStatus: card.taskStatus,
          priority: card.priority,
          taskCategory: card.taskCategory,
          startDate: card.startDate,
          dueDate: card.dueDate,
          projectTask: card.projectTask,
          projectStatus: card.projectStatus,
          addChronicles: card.addChronicles,
          taskDesc: card.taskDesc,
          attachments: card.attachments,
          startTime: card.startTime,
          completeTime: card.completeTime,
          totalTime: card.totalTime,
          chroniclesComplete: card.chroniclesComplete,
        },
      ];

      setSelectedTask(selectedTaskCard);
    }
  };

  const handleDragStart = (e, card) => {
    const cardData = JSON.stringify(card);
    e.dataTransfer.setData("cardObject", cardData);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = 1;
  };

  const clearHighlights = (indicators) => {
    indicators = indicators || getIndicators();
    indicators.forEach((el) => (el.style.opacity = 0));
  };

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 100;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const handleDragEnd = (e) => {
    clearHighlights();
    setActive(false);

    const tempCardData = JSON.parse(e.dataTransfer.getData("cardObject"));

    const selectedTask = [
      {
        id: tempCardData._id,
        taskName: tempCardData.taskName,
        assignedTo: tempCardData.assignedTo,
        taskStatus: tempCardData.taskStatus,
        priority: tempCardData.priority,
        taskCategory: tempCardData.taskCategory,
        startDate: tempCardData.startDate,
        dueDate: tempCardData.dueDate,
        projectTask: tempCardData.projectTask,
        projectStatus: tempCardData.projectStatus,
        addChronicles: tempCardData.addChronicles,
        taskDesc: tempCardData.taskDesc,
        attachments: tempCardData.attachments,
        startTime: tempCardData.startTime,
        completeTime: tempCardData.completeTime,
        totalTime: tempCardData.totalTime,
        chroniclesComplete: tempCardData.chroniclesComplete,
      },
    ];

    console.log("cardData", selectedTask);

    if (
      selectedTask[0].taskStatus === "Not Started" &&
      column === "In Progress"
    ) {
      handleButtonStart(selectedTask);
    }
    if (selectedTask[0].taskStatus === "In Progress" && column === "Paused") {
      handleButtonPause(selectedTask);
      console.log("in progress to paused");
    }
    if (selectedTask[0].taskStatus === "Paused" && column === "In Progress") {
      handleButtonResume(selectedTask);
    }
    if (
      selectedTask[0].taskStatus === "In Progress" &&
      column === "Completed"
    ) {
      handleButtonComplete(selectedTask);
    }
    if (selectedTask[0].taskStatus === "Paused" && column === "Completed") {
      handleButtonComplete(selectedTask);
    }
  };

  const filteredCards = cards.filter((c) => c.taskStatus === column);

  return (
    <div className="w-56 shrink-0  h-screen">
      <div className="mb-3 flex items-center gap-2 border-b sticky top-0 backdrop-blur-lg  border-neutral-700 ">
        <span className="rounded text-sm text-neutral-400">
          {" "}
          {filteredCards.length}
        </span>
        <h3 className={`font-medium ${headingColor}`}>{title} </h3>
      </div>
      <div
        className={`h-full w-full transition-colors rounded-md ${
          active ? "bg-neutral-800/50" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDragEnd}
      >
        {filteredCards.map((c) => (
          <Card
            key={c.id}
            {...c}
            handleDragStart={handleDragStart}
            handleCardClick={handleCardClick}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            setSelectedTask={setSelectedTask}
          />
        ))}
        <DropIndicator beforeId="-1" column={column} />
      </div>
    </div>
  );
};

const DeleteModal = ({ isOpen, onClose, handleButtonDelete }) => {
  if (!isOpen) return null;

  const handleDelete = () => {
    handleButtonDelete();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center backdrop-blur-sm z-[100] transition-all duration-300 translate-x-[5rem]">
      <div className="bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-700">
        <h3 className="text-lg font-medium text-white mb-4">Confirm Delete</h3>
        <p className="text-neutral-300 mb-6">
          Are you sure you want to delete this task?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-neutral-700 text-white hover:bg-neutral-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete()}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Card = ({
  _id,
  column,
  taskName,
  taskDesc,
  taskStatus,
  priority,
  assignedTo,
  taskCategory,
  startDate,
  dueDate,
  projectTask,
  projectStatus,
  addChronicles,
  attachments,
  startTime,
  completeTime,
  totalTime,
  chroniclesComplete,
  handleDragStart,
  handleCardClick,
  setIsDeleteModalOpen,
  setSelectedTask,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleDelete = (e, card) => {
    setIsDeleteModalOpen((prev) => !prev);

    const selectedTaskCard = [
      {
        id: card._id,
        taskName: card.taskName,
        assignedTo: card.assignedTo,
        taskStatus: card.taskStatus,
        priority: card.priority,
        taskCategory: card.taskCategory,
        startDate: card.startDate,
        dueDate: card.dueDate,
        projectTask: card.projectTask,
        projectStatus: card.projectStatus,
        addChronicles: card.addChronicles,
        taskDesc: card.taskDesc,
        attachments: card.attachments,
        startTime: card.startTime,
        completeTime: card.completeTime,
        totalTime: card.totalTime,
        chroniclesComplete: card.chroniclesComplete,
      },
    ];

    setSelectedTask(selectedTaskCard);
  };

  return (
    <>
      <DropIndicator beforeId={_id} column={column} />
      <div
        className="h-[10rem] cursor-grab rounded border border-neutral-700 p-3 active:cursor-grabbing flex flex-col  justify-between active:border-violet-300/60 hover:border-violet-300/30 "
        draggable="true"
        style={{ background: colors.primary[600] }}
        onDragStart={(e) =>
          handleDragStart(e, {
            _id,
            taskName,
            assignedTo,
            taskStatus,
            priority,
            taskCategory,
            startDate,
            dueDate,
            projectTask,
            projectStatus,
            addChronicles,
            taskDesc,
            attachments,
            startTime,
            completeTime,
            totalTime,
            chroniclesComplete,
          })
        }
        onClick={(e) =>
          handleCardClick(e, {
            _id,
            taskName,
            assignedTo,
            taskStatus,
            priority,
            taskCategory,
            startDate,
            dueDate,
            projectTask,
            projectStatus,
            addChronicles,
            taskDesc,
            attachments,
            startTime,
            completeTime,
            totalTime,
            chroniclesComplete,
          })
        }
      >
        <div className="flex justify-between border-b border-neutral-500">
          <p className="text-sm text-neutral-400 ">{taskName}</p>
          <button
            className="text-neutral-400 hover:text-red-500 "
            onClick={(e) =>
              handleDelete(e, {
                _id,
                taskName,
                assignedTo,
                taskStatus,
                priority,
                taskCategory,
                startDate,
                dueDate,
                projectTask,
                projectStatus,
                addChronicles,
                taskDesc,
                attachments,
                startTime,
                completeTime,
                totalTime,
                chroniclesComplete,
              })
            }
          >
            <div className="flex  justify-end w-4">X</div>
          </button>
        </div>

        <p className="text-sm text-neutral-400">{taskDesc}</p>
        <div className="flex justify-between">
          {" "}
          <p
            className={`text-sm  ${
              priority === "High"
                ? "text-orange-600"
                : priority === "Low"
                ? "text-green-600"
                : "text-yellow-500"
            }`}
          >
            {priority}
          </p>
          <p className="text-sm text-neutral-400 rounded-lg px-1 bg-neutral-700/80">
            {assignedTo}
          </p>
        </div>
      </div>
    </>
  );
};

const DropIndicator = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-300 opacity-0"
    />
  );
};

const TaskBoard = ({
  reloadTaskBoard,
  setIsOpen,
  setViewClicked,
  setSelectedTask,
  handleButtonStart,
  handleButtonPause,
  handleButtonResume,
  handleButtonComplete,
  handleButtonDelete,
}) => {
  const [cards, setCards] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // loads all PROJECTS from database into list
  useEffect(() => {
    async function loadAllProjects() {
      const data = await getProjects();
      if (data) {
        setProjects(data);
      }
    }

    loadAllProjects();
  }, []);

  // loads all TASKS from database into list
  // When app component renders loadAllProjects() is called asynchronously
  // so the rest on the program can still run when the function logic is being executed and returned some time in future
  // if data is returned , then setProjects state is updated with data
  // sets loading to true, then if and when data is returned sets to false
  // dependencies : reloadGrid
  useEffect(() => {
    async function loadAllTasks() {
      const data = await getTasks();
      if (data) {
        console.log("New task data received:", data);
        setCards(data);
      }
    }

    loadAllTasks();
  }, [reloadTaskBoard]);

  return (
    <div className="flex h-full w-full justify-between overflow-y-scroll mt-8  px-12 ">
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen((prev) => !prev)}
        handleButtonDelete={handleButtonDelete}
      />
      <Column
        title="Not Started"
        column="Not Started"
        headingColor="text-red-300"
        cards={cards}
        setCards={setCards}
        setIsOpen={setIsOpen}
        setViewClicked={setViewClicked}
        setSelectedTask={setSelectedTask}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
      />

      <Column
        title="In Progress"
        column="In Progress"
        headingColor="text-yellow-300"
        cards={cards}
        setCards={setCards}
        setIsOpen={setIsOpen}
        setViewClicked={setViewClicked}
        setSelectedTask={setSelectedTask}
        handleButtonStart={handleButtonStart}
        handleButtonResume={handleButtonResume}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
      />
      <Column
        title="Paused"
        column="Paused"
        headingColor="text-blue-300"
        cards={cards}
        setCards={setCards}
        setIsOpen={setIsOpen}
        setViewClicked={setViewClicked}
        setSelectedTask={setSelectedTask}
        handleButtonPause={handleButtonPause}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
      />
      <Column
        title="Completed"
        column="Completed"
        headingColor="text-green-300"
        cards={cards}
        setCards={setCards}
        setIsOpen={setIsOpen}
        setViewClicked={setViewClicked}
        setSelectedTask={setSelectedTask}
        handleButtonComplete={handleButtonComplete}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
      />
    </div>
  );
};

export default TaskBoard;
