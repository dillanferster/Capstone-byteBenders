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

const Column = ({ title, headingColor, cards, setCards, column }) => {
  const [active, setActive] = useState();

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card._id);
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

    const cardId = e.dataTransfer.getData("cardId");

    let copy = [...cards];

    let cardToMove = copy.find((c) => c._id === cardId);

    cardToMove.taskStatus = column;

    copy = copy.filter((c) => c._id !== cardId);

    copy.push(cardToMove);

    setCards(copy);
  };

  const filteredCards = cards.filter((c) => c.taskStatus === column);

  console.log("Column:", column);
  console.log("All cards:", cards);
  console.log("Filtered cards:", filteredCards);

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center gap-2 ">
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
          <Card key={c.id} {...c} handleDragStart={handleDragStart} />
        ))}
      </div>
    </div>
  );
};

const Card = ({ _id, taskName, taskDesc, taskStatus, handleDragStart }) => {
  return (
    <>
      <div
        className="cursor-grab rounded border border-neutral-700 p-3 bg-neutral-800 active:cursor-grabbing"
        draggable="true"
        onDragStart={(e) =>
          handleDragStart(e, { _id, taskName, taskDesc, taskStatus })
        }
      >
        <p className="text-sm text-neutral-400">{taskName}</p>
        <p className="text-sm text-neutral-400">{taskDesc}</p>
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

const DeleteBox = ({ setCards }) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDrop = (e) => {
    const cardId = e.dataTransfer.getData("cardId");
    setCards((prev) => prev.filter((card) => card.id !== Number(cardId)));
    setActive(false);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-md ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      Delete Task
    </div>
  );
};

const TaskBoard = () => {
  const [cards, setCards] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

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
  }, []);

  return (
    <div className="flex h-full w-full justify-between overflow-y-scroll p-12 ">
      <Column
        title="Not Started"
        column="Not Started"
        headingColor="text-red-300"
        cards={cards}
        setCards={setCards}
      />

      <Column
        title="In Progress"
        column="In Progress"
        headingColor="text-yellow-300"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Completed"
        column="Completed"
        headingColor="text-green-300"
        cards={cards}
        setCards={setCards}
      />

      <DeleteBox setCards={setCards} />
    </div>
  );
};

export default TaskBoard;

const initialCards = [
  {
    id: 1,
    title: "Task 1",
    description: "Description 1",
    column: "not started",
  },
  {
    id: 2,
    title: "Task 2",
    description: "Description 2",
    column: "in progress",
  },
  {
    id: 4,
    title: "Task 4",
    description: "Description 4",
    column: "in progress",
  },
  { id: 3, title: "Task 3", description: "Description 3", column: "complete" },
];
