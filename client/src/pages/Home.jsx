import { useEffect, useState } from "react";

function Home() {
  const [projects, setProjects] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [showMessage, setShowMessage] = useState(false);

  const token = localStorage.getItem("token");

//FETCH PROJECTS ON PAGE LOAD FROM OUR ENDPOINTS
  useEffect(() => {
    fetch("http://localhost:5000/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  //HANDLE COMMENT INPUT PER PROJECT
  const handleCommentChange = (projectId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [projectId]: value,
    }));
  };

  //ADD COMMENT
  const addComment = async (projectId) => {
    if (!token) return;

    const text = commentInputs[projectId];
    if (!text) return;

    await fetch(`http://localhost:5000/projects/${projectId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });

    setCommentInputs((prev) => ({
      ...prev,
      [projectId]: "",
    }));

    const res = await fetch("http://localhost:5000/projects");
    const data = await res.json();
    setProjects(data);
  };

  //RAISE HAND
  const raiseHand = async (projectId) => {
    if (!token) return;

    await fetch(`http://localhost:5000/projects/${projectId}/collaborate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await fetch("http://localhost:5000/projects");
    const data = await res.json();
    setProjects(data);
  };

  //FILTER COMPLETED PROJECTS FOR CELEBRATION WALL
  const completedProjects = projects.filter((p) => p.stage === "completed");

  return (
    <div className="container page">
    {!token && (
    <div className="card" style={{ marginBottom: "20px" }}>
      <button onClick={() => setShowMessage(!showMessage)}>
        Click Me
      </button>

      {showMessage && (
        <p style={{ marginTop: "15px", lineHeight: "1.6" }}>
          Dear Derivco Hiring Team,
          
          I trust you are well, It has come to my attention that this graduate program 
          is for people ready to work in 2026. Unfortunately, I am still an honours student 
          and therefore will not be able to continue with the application process.
          Nevertheless, I enjoyed working on this MzansiBuilds project and I hope
          you enjoy what I managed to create. Thank you for this opportunity and I
          hope I am considered for any future graduate program and positions.

          Thank you for your time and consideration.

          Kind regards,
          Aveer Alamchand
        </p>
      )}  
    </div>
    )}
      <h2 style={{ color: "#00e676" }}>Live Feed</h2>

      {projects.length === 0 ? (
        <p>No projects yet</p>
      ) : (
        projects.map((project) => (
          <div key={project.id} className="card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>

            <p>
              <strong>Stage:</strong> {project.stage}
            </p>
            <p>
              <strong>Support:</strong> {project.support}
            </p>
            <p>
              <strong>By:</strong> {project.userEmail}
            </p>
            <p>
              <strong>Collaborators:</strong>{" "}
              {project.collaborators?.length || 0}
            </p>

            <div style={{ marginTop: "15px" }}>
              <h4>Comments</h4>

              {project.comments?.length > 0 ? (
                project.comments.map((c, i) => (
                  <p
                    key={i}
                    style={{
                      borderLeft: "2px solid #00c853",
                      paddingLeft: "10px",
                      marginBottom: "8px",
                    }}
                  >
                    <strong>{c.userEmail}:</strong> {c.text}
                  </p>
                ))
              ) : (
                <p style={{ color: "#aaa" }}>No comments yet</p>
              )}

              <input
                type="text"
                value={commentInputs[project.id] || ""}
                onChange={(e) =>
                  handleCommentChange(project.id, e.target.value)
                }
                placeholder="Add a comment..."
              />

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button onClick={() => addComment(project.id)}>Submit Comment</button>
                  <button onClick={() => raiseHand(project.id)}>Raise Hand</button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      <hr style={{ margin: "30px 0", borderColor: "#222" }} />

      <h2 style={{ color: "#00e676" }}>Celebration Wall</h2>

      {completedProjects.length === 0 ? (
        <p>No completed projects yet</p>
      ) : (
        completedProjects.map((project) => (
          <div
            key={project.id}
            className="card"
            style={{
              border: "2px solid #00c853",
              backgroundColor: "#101010",
            }}
          >
            <h3>{project.title}</h3>
            <p>{project.description}</p>

            <p>
              <strong>Completed by:</strong> {project.userEmail}
            </p>
            <p>
              <strong>Collaborators:</strong>{" "}
              {project.collaborators?.length || 0}
            </p>
          </div>
        ))
      )}
    </div>
  );
  
}

export default Home;