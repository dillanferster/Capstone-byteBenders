import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { FilledInput } from "@mui/material";
import "./App.css";

function App() {
  const [data, setData] = useState();
  const [showData, setShowData] = useState();

  function createProject() {
    let projectObject = {
      projectName: "new project",
      projectDesc: "the new one",
      assignedTo: "dillan",
      dateCreated: new Date(),
    };

    axios.post("http://localhost:3000/projects", projectObject);
  }

  useEffect(() => {
    async function getData() {
      const response = await axios.get("http://localhost:3000/projects");
      if (response.status === 200) {
        setData(response);
      }
    }

    getData();
  }, []);

  return (
    <>
      <Button onClick={() => setShowData(!showData)} variant="contained">
        show Data
      </Button>
      {showData ? <div>{JSON.stringify(data)}</div> : <div></div>}
      <Button onClick={() => createProject()}>add project</Button>
    </>
  );
}

export default App;
