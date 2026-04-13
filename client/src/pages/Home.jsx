import { useEffect, useState } from "react";

function Home() {
  const [projects, setProjects] = useState([]);

  // ADDED: STORE COMMENT PER PROJECT (FIXES SHARED INPUT BUG)
  const [commentInputs, setCommentInputs] = useState({});

  // ADDED: HANDLE INPUT CHANGE PER PROJECT
  const handleCommentChange = (projectId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [projectId]: value,
    }));
  };

  // ADDED: SEND COMMENT TO BACKEND
  const addComment = async (projectId) => {
    const token = localStorage.getItem("token");

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

    // ADDED: CLEAR ONLY THAT PROJECT'S INPUT
    setCommentInputs((prev) => ({
      ...prev,
      [projectId]: "",
    }));

    // refresh feed
    const res = await fetch("http://localhost:5000/projects");
    const data = await res.json();
    setProjects(data);
  };

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
            <p>
              <strong>Stage:</strong> {project.stage}
            </p>
            <p>
              <strong>Support:</strong> {project.support}
            </p>
            <p>
              <strong>By:</strong> {project.userEmail}
            </p>

            {/* ADDED: COMMENTS DISPLAY */}
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

              {/* ADDED: COMMENT INPUT (PER PROJECT FIXED) */}
              <input
                type="text"
                value={commentInputs[project.id] || ""}
                onChange={(e) =>
                  handleCommentChange(project.id, e.target.value)
                }
                placeholder="Add a comment..."
              />

              <button onClick={() => addComment(project.id)}>
                Submit Comment
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;