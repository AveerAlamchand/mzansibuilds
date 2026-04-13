const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];
const projects = [];

const JWT_SECRET = "SECRET_KEY";

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("API is running...");
});

// =========================
// AUTH MIDDLEWARE
// =========================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  });
};

// =========================
// REGISTER
// =========================
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  const existingUser = users.find((u) => u.email === email);

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = {
    id: users.length + 1,
    email,
    password,
  };

  users.push(newUser);

  res.json({ message: "User registered successfully" });
});

// =========================
// LOGIN
// =========================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful",
    token,
  });
});

// =========================
// CREATE PROJECT
// =========================
app.post("/projects", authenticateToken, (req, res) => {
  const { title, description, stage, support } = req.body;

  const newProject = {
    id: projects.length + 1,
    userId: req.user.id,
    userEmail: req.user.email,

    title,
    description,
    stage,
    support,

    comments: [],

    // ADDED: RAISE HAND FEATURE
    collaborators: [],
  };

  projects.push(newProject);

  res.json({
    message: "Project created successfully",
    project: newProject,
  });
});

// =========================
// GET PROJECTS
// =========================
app.get("/projects", (req, res) => {
  res.json(projects);
});

// =========================
// COMMENTS
// =========================
app.post("/projects/:id/comments", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  const project = projects.find((p) => p.id === parseInt(id));

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const newComment = {
    userEmail: req.user.email,
    text,
    timestamp: new Date().toISOString(),
  };

  project.comments.push(newComment);

  res.json({
    message: "Comment added",
    comment: newComment,
  });
});

// =========================
// RAISE HAND (COLLABORATION)
// =========================
app.post("/projects/:id/collaborate", authenticateToken, (req, res) => {
  const { id } = req.params;

  const project = projects.find((p) => p.id === parseInt(id));

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const alreadyRaised = project.collaborators.find(
    (c) => c.userEmail === req.user.email
  );

  if (alreadyRaised) {
    return res.status(400).json({ message: "Already raised hand" });
  }

  const collaborator = {
    userEmail: req.user.email,
    timestamp: new Date().toISOString(),
  };

  project.collaborators.push(collaborator);

  res.json({
    message: "Raised hand successfully",
    collaborators: project.collaborators,
  });
});

// =========================
// START SERVER
// =========================
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});