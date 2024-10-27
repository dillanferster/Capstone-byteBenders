import React, { useState } from "react";

const Column = ({ title, headingColor, cards, setCards }) => {
  return <div className="w-56 shrink-0">column</div>;
};

const TaskBoard = () => {
  const [cards, setCards] = useState();

  return (
    <div className="flex h-full w-full gap-3 overflow-scroll p-12">
      <Column
        title="Not Started"
        column="not started"
        headingColor="text-yellow-200"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Started"
        column="started"
        headingColor="text-yellow-200"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="In Progress"
        column="in progress"
        headingColor="text-yellow-200"
        cards={cards}
        setCards={setCards}
      />
    </div>
  );
};

export default TaskBoard;
