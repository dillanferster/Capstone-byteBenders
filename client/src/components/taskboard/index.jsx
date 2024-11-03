/**
 * Ref: https://www.youtube.com/watch?v=O5lZqqy7VQE&t=264s&ab_channel=TomIsLoading
 */

import React, { Fragment, useState } from "react";

const Column = ({ title, headingColor, cards, setCards, column }) => {
  const [active, setActive] = useState();

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const filteredCards = cards.filter((c) => c.column === column);

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
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-800/50" : ""
        }`}
      >
        {filteredCards.map((c) => (
          <Card key={c.id} {...c} />
        ))}
      </div>
    </div>
  );
};

const Card = ({ id, title, description, column, setCards }) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <div
        className="cursor-grab rounded border border-neutral-700 p-3 bg-neutral-800 active:cursor-grabbing"
        draggable="true"
      >
        <p className="text-sm text-neutral-400">{title}</p>
        <p className="text-sm text-neutral-400">{description}</p>
      </div>
      <DropIndicator beforeId="-1" column={column} />
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

const DeleteBox = () => {
  const [active, setActive] = useState(false);

  return (
    <div
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

// const AddCard = ({ column, setCards }) => {
//   const [text, setText] = useState("");
//   const [adding, setAdding] = useState(false);
//   return (
//     <>
//       {adding ? (
//         <form >
//           <textarea onCh></textarea>
//         </form>
//       ) : (
//         <button
//           onClick={() => setAdding(true)}
//           className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
//         >
//           <span>Add Task +</span>
//         </button>
//       )}
//     </>
//   );
// };

const TaskBoard = () => {
  const [cards, setCards] = useState(initialCards);

  return (
    <div className="flex h-full w-full justify-between overflow-y-scroll p-12 ">
      <Column
        title="Not Started"
        column="not started"
        headingColor="text-red-300"
        cards={cards}
        setCards={setCards}
      />

      <Column
        title="In Progress"
        column="in progress"
        headingColor="text-yellow-300"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Complete"
        column="complete"
        headingColor="text-green-300"
        cards={cards}
        setCards={setCards}
      />

      <DeleteBox />
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
