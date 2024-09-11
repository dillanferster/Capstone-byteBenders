import React from "react";

const HomePage = ({setShowData, showData, data}) => {
  return (
    <div>
      Home
      <button onClick={() => setShowData(!showData)} variant="contained">
        show Data
      </button>
      {showData ? <div>{JSON.stringify(data)}</div> : <div></div>}
      <button onClick={() => createProject()}>add project</button>
    </div>
  );
};

export default HomePage;
