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
}) => {
  const [active, setActive] = useState();

  const handleCardClick = (e, card) => {
    if (e.detail === 2) {
      console.log(
        "double clicked card",
        card._id,
        card.taskName,
        card.assignedTo,
        card.taskStatus,
        card.priority,
        card.taskCategory,
        card.startDate,
        card.dueDate,
        card.projectTask,
        card.projectStatus,
        card.addChronicles,
        card.taskDesc,
        card.attachments,
        card.startTime,
        card.completeTime,
        card.totalTime,
        card.chroniclesComplete
      );

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
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e) => {
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
    // if (selectedTask[0].taskStatus === "Paused" && column === "Completed") {
    //   handleButtonComplete(selectedTask);
    // }
  };

  const filteredCards = cards.filter((c) => c.taskStatus === column);

  return (
    <div className="w-56 shrink-0 ">
      <div className="mb-3 flex items-center gap-2 border-b  border-neutral-700">
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
          />
        ))}
      </div>
    </div>
  );
};

const Card = ({
  _id,
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
}) => {
  return (
    <>
      <div
        className="cursor-grab rounded border border-neutral-700 p-3 bg-neutral-800 active:cursor-grabbing flex flex-col gap-2"
        draggable="true"
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
        <p className="text-sm text-neutral-400">{taskName}</p>
        <p className="text-sm text-neutral-400">{taskDesc}</p>
        <div className="flex justify-between">
          {" "}
          <p className="text-sm text-neutral-400">{priority}</p>
          <p className="text-sm text-neutral-400">{assignedTo}</p>
        </div>
      </div>
      <DropIndicator beforeId={_id} column={taskStatus} />
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

// const DeleteBox = ({ setCards }) => {
//   const [active, setActive] = useState(false);

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setActive(true);
//   };

//   const handleDragLeave = () => {
//     setActive(false);
//   };

//   const handleDrop = (e) => {
//     const cardId = e.dataTransfer.getData("cardId");
//     setCards((prev) => prev.filter((card) => card.id !== Number(cardId)));
//     setActive(false);
//   };

//   return (
//     <div
//       onDragOver={handleDragOver}
//       onDragLeave={handleDragLeave}
//       onDrop={handleDrop}
//       className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-md ${
//         active
//           ? "border-red-800 bg-red-800/20 text-red-500"
//           : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
//       }`}
//     >
//       Delete Task
//     </div>
//   );
// };

// const DeleteBtn = () => {
//   return (
//     <div className="text-red-500 pt-1">
//       <button>Delete</button>
//     </div>
//   );
// };

const TaskBoard = ({
  reloadTaskBoard,
  setIsOpen,
  setViewClicked,
  setSelectedTask,
  handleButtonStart,
  handleButtonPause,
  handleButtonResume,
  handleButtonComplete,
}) => {
  const [cards, setCards] = useState([]);
  const [projects, setProjects] = useState([]);

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
    <div className="flex h-full w-full justify-between overflow-y-scroll p-12 ">
      <Column
        title="Not Started"
        column="Not Started"
        headingColor="text-red-300"
        cards={cards}
        setCards={setCards}
        setIsOpen={setIsOpen}
        setViewClicked={setViewClicked}
        setSelectedTask={setSelectedTask}
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
      />

      {/* <DeleteBox setCards={setCards} /> */}
    </div>
  );
};

export default TaskBoard;
