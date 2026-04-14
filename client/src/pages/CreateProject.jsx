import { useState } from "react";

function CreateProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState("idea");
  const [support, setSupport] = useState("");
  const [message, setMessage] = useState("");

  // ADDED: HANDLE PROJECT SUBMISSION
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, stage, support }),
    });

    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div className="card">
        <h2>Create Project</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <input
              placeholder="Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <select value={stage} onChange={(e) => setStage(e.target.value)}>
              <option value="idea">Idea</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <input
              placeholder="Support needed"
              value={support}
              onChange={(e) => setSupport(e.target.value)}
            />
          </div>

          <button type="submit">Create Project</button>
        </form>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default CreateProject;