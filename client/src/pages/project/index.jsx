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
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    async function loadAllProjects() {
      const data = await getProjects();
      if (data) {
        setProjects(data);
        setIsLoading(false);
      }
    }

    loadAllProjects();
  }, []);

  return (
    <div>
      <ProjectGrid isloading={isloading} projects={projects}></ProjectGrid>
    </div>
  );
};

export default ProjectPage;
