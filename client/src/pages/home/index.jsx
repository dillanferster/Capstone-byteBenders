import React from "react";
import { useState } from "react";

const HomePage = ({ data, makeProject, loadProjects }) => {
  // show data button state
  const [showData, setShowData] = useState();

  function handleButton() {
    loadProjects();
    setShowData(!showData);
  }

  function handleButtonAdd() {
    makeProject();
  }
  return (
    <div>
      Home
      <button onClick={() => handleButton()} variant="contained">
        show Data
      </button>
      {showData ? <div>{JSON.stringify(data)}</div> : <div></div>}
      <button onClick={() => handleButtonAdd()}>add project</button>
    </div>
  );
};

export default HomePage;
