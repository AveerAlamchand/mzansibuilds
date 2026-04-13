import { useState } from "react";

function CreateProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState("idea");
  const [support, setSupport] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, stage, support }),
    });

    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Project</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br /><br />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br /><br />

        <select value={stage} onChange={(e) => setStage(e.target.value)}>
          <option value="idea">Idea</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <br /><br />

        <input
          placeholder="Support needed"
          value={support}
          onChange={(e) => setSupport(e.target.value)}
        />

        <br /><br />

        <button type="submit">Create Project</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateProject;