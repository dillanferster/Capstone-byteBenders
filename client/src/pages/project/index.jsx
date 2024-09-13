import React from "react";
import ProjectGrid from "../../components/projectgrid";
import { useState, useEffect } from "react";

// database functions from api file
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../../api.js";
//

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function loadAllProjects() {
      const data = await getProjects();
      if (data) {
        setProjects(data);
      }
    }

    loadAllProjects();
  }, []);

  return (
    <div>
      <ProjectGrid></ProjectGrid>
    </div>
  );
};

export default ProjectPage;
