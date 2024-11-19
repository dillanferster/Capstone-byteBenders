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
  reorderTask,
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
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [active, setActive] = useState(false);
  const [dropIndicatorY, setDropIndicatorY] = useState(null);

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
    setActive(true);

    const containerRect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY - containerRect.top;
    const cards = e.currentTarget.getElementsByClassName("task-card");

    let insertIndex = cards.length;
    let indicatorY = 0;

    // Find insertion point based on mouse position
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const cardRect = card.getBoundingClientRect();
      const cardMiddle = cardRect.top + cardRect.height / 2 - containerRect.top;

      if (mouseY < cardMiddle) {
        insertIndex = i;
        indicatorY = cardRect.top - containerRect.top;
        break;
      } else {
        indicatorY = cardRect.bottom - containerRect.top;
      }
    }

    setDropIndicatorY(indicatorY);
    // Store the insert index for use in handleDragEnd
    e.currentTarget.dataset.insertIndex = insertIndex;
  };

  const handleDragLeave = () => {
    setActive(false);
    setDropIndicatorY(null);
  };

  const handleDragEnd = async (e) => {
    e.preventDefault();
    setActive(false);
    setDropIndicatorY(null);

    const cardData = JSON.parse(e.dataTransfer.getData("cardObject"));
    // Get the stored insert index
    const insertIndex = parseInt(e.currentTarget.dataset.insertIndex) || 0;

    // Handle status transitions
    if (cardData.taskStatus !== column) {
      if (cardData.taskStatus === "Not Started" && column === "In Progress") {
        await handleButtonStart([cardData]);
      } else if (cardData.taskStatus === "In Progress" && column === "Paused") {
        await handleButtonPause([cardData]);
      }
      // ... other status transitions ...
    }

    // Update cards array with new order
    const updatedCards = [...cards];
    const oldIndex = updatedCards.findIndex((c) => c._id === cardData._id);

    if (oldIndex !== -1) {
      // Remove card from old position
      const [movedCard] = updatedCards.splice(oldIndex, 1);

      // Get all cards in the target column
      const columnCards = updatedCards.filter((c) => c.taskStatus === column);

      // Insert at the correct position within the column
      const targetIndex =
        updatedCards.indexOf(
          columnCards[insertIndex] || columnCards[columnCards.length - 1]
        ) || 0;

      // Insert card at new position
      updatedCards.splice(targetIndex, 0, {
        ...movedCard,
        taskStatus: column,
      });

      setCards(updatedCards);

      // Update in database
      try {
        await updateTask(cardData._id, {
          ...cardData,
          taskStatus: column,
        });
      } catch (error) {
        console.error("Error updating task position:", error);
      }
    }
  };

  const filteredCards = cards.filter((c) => c.taskStatus === column);

  return (
    <div className="w-56 shrink-0 h-screen">
      <div
        className="mb-3 flex items-center gap-2 sticky top-0 z-[5] border-neutral-700 p-2 rounded-sm"
        style={{ background: colors.primary[600] }}
      >
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
      </div>
      <div
        className={`h-full w-full transition-colors rounded-md relative  ${
          active ? "bg-neutral-500/20" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDragEnd}
      >
        {/* Drop indicator line */}
        {dropIndicatorY !== null && (
          <div
            className="absolute w-full h-1 bg-violet-400/80 rounded-full transform -translate-y-1/2 pointer-events-none"
            style={{ top: `${dropIndicatorY}px` }}
          />
        )}

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
      <div className="bg-neutral-300 p-6 rounded-lg shadow-lg border border-neutral-700">
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
      <div
        className="task-card h-[10rem] mt-2 cursor-grab rounded border border-neutral-700 p-3 active:cursor-grabbing flex flex-col  justify-between active:border-violet-300/60 hover:border-violet-300/40 "
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
          <p className="text-sm  " style={{ color: `${colors.primary[200]}` }}>
            {taskName}
          </p>
          <button
            className=" hover:text-red-500 "
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

        <p className="text-sm " style={{ color: `${colors.primary[200]}` }}>
          {taskDesc}
        </p>
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
          <p
            className="text-sm  rounded-lg px-1 "
            style={{
              color: `${colors.primary[100]}`,
              background: `${colors.primary[400]}`,
            }}
          >
            {assignedTo}
          </p>
        </div>
      </div>
    </>
  );
};

const TaskBoard = ({
  reloadTaskBoard,
  setReloadTaskBoard,
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
      try {
        const data = await getTasks();
        if (data) {
          console.log("Reloading task board with new data:", data);
          setCards(data);
        }
      } catch (error) {
        console.error("Error loading tasks:", error);
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
        headingColor="text-red-500"
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
        headingColor="text-orange-500"
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
        headingColor="text-blue-500"
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
        headingColor="text-green-500"
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
