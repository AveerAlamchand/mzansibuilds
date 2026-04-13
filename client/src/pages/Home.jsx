import { useEffect, useState } from "react";

function Home() {
  const [projects, setProjects] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});

  const token = localStorage.getItem("token");

  const handleCommentChange = (projectId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [projectId]: value,
    }));
  };

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

  useEffect(() => {
    fetch("http://localhost:5000/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  // ADDED: FILTER COMPLETED PROJECTS
  const completedProjects = projects.filter(
    (p) => p.stage === "completed"
  );

  return (
    <div style={{ padding: "20px" }}>
      {/* ===================== */}
      {/* LIVE FEED SECTION */}
      {/* ===================== */}
      <h2>Live Feed</h2>

      {projects.length === 0 ? (
        <p>No projects yet</p>
      ) : (
        projects.map((project) => (
          <div
            key={project.id}
            style={{
              border: "1px solid white",
              margin: "10px",
              padding: "10px",
            }}
          >
            <h3>{project.title}</h3>
            <p>{project.description}</p>

            <p><strong>Stage:</strong> {project.stage}</p>
            <p><strong>Support:</strong> {project.support}</p>
            <p><strong>By:</strong> {project.userEmail}</p>

            <p>
              <strong>Collaborators:</strong>{" "}
              {project.collaborators?.length || 0}
            </p>

            {/* COMMENTS */}
            <div style={{ marginTop: "10px" }}>
              <h4>Comments</h4>

              {project.comments?.length > 0 ? (
                project.comments.map((c, i) => (
                  <p key={i}>
                    <strong>{c.userEmail}:</strong> {c.text}
                  </p>
                ))
              ) : (
                <p>No comments yet</p>
              )}

              <input
                type="text"
                value={commentInputs[project.id] || ""}
                onChange={(e) =>
                  handleCommentChange(project.id, e.target.value)
                }
                placeholder="Add a comment..."
              />

              <button onClick={() => addComment(project.id)} disabled={!token}>
                Submit Comment
              </button>

              <button
                onClick={() => raiseHand(project.id)}
                disabled={!token}
                style={{
                  marginTop: "10px",
                  background: "green",
                  color: "black",
                  border: "none",
                  padding: "5px",
                }}
              >
                Raise Hand 🤝
              </button>
            </div>
          </div>
        ))
      )}

      {/* ===================== */}
      {/* CELEBRATION WALL */}
      {/* ===================== */}
      <hr style={{ margin: "30px 0" }} />

      <h2 style={{ color: "green" }}>🎉 Celebration Wall</h2>

      {completedProjects.length === 0 ? (
        <p>No completed projects yet</p>
      ) : (
        completedProjects.map((project) => (
          <div
            key={project.id}
            style={{
              border: "2px solid green",
              margin: "10px",
              padding: "10px",
              background: "black",
              color: "white",
            }}
          >
            <h3>🏆 {project.title}</h3>
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