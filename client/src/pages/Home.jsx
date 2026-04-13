import { useEffect, useState } from "react";

function Home() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Live Feed</h2>

      {projects.length === 0 ? (
        <p>No projects yet</p>
      ) : (
        projects.map((project) => (
          <div key={project.id} style={{ border: "1px solid white", margin: "10px", padding: "10px" }}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p><strong>Stage:</strong> {project.stage}</p>
            <p><strong>Support:</strong> {project.support}</p>
            <p><strong>By:</strong> {project.userEmail}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;