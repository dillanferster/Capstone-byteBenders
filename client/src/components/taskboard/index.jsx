import React, { useState } from "react";

const Column = ({ title, headingColor, cards, setCards }) => {
  const [active, setActive] = useState();

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center gap-2 ">
        <span className="rounded text-sm text-neutral-400">
          {" "}
          {cards.length}
        </span>
        <h3 className={`font-medium ${headingColor}`}>{title} </h3>
      </div>
      <div
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-800/50" : ""
        }`}
      >
        {" "}
      </div>
    </div>
  );
};

const TaskBoard = () => {
  const [cards, setCards] = useState([]);

  return (
    <div className="flex h-full w-full justify-between overflow-y-scroll p-12 border">
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
    </div>
  );
};

export default TaskBoard;
