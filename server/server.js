const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];
const projects = [];

// FIXED: move secret into constant (better practice)
const JWT_SECRET = "SECRET_KEY";

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// LOGIN ROUTE
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // ADDED: include full user payload for future features
  const token = jwt.sign(
    { id: user.id || email, email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  // FIXED: consistent response structure
  res.json({
    message: "Login successful",
    token,
  });
});

// REGISTER ROUTE
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // ADDED: simple ID system (important for later ownership features)
  const newUser = {
    id: users.length + 1,
    email,
    password,
  };

  users.push(newUser);

  console.log("Users:", users);

  res.json({ message: "User registered successfully" });
});


// ADDED: AUTH MIDDLEWARE (USED FOR ALL PROTECTED ROUTES)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, "SECRET_KEY", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  });
};

// PROJECTS ROUTE (PUBLIC FOR NOW — WE WILL SECURE NEXT STEP)
// UPDATED: NOW SECURED + USER OWNERSHIP ADDED
app.post("/projects", authenticateToken, (req, res) => {
  const { title, description, stage, support } = req.body;

  const newProject = {
    id: projects.length + 1,

    // ADDED: OWNER INFO (IMPORTANT FOR FUTURE FEATURES)
    userId: req.user.id,
    userEmail: req.user.email,

    title,
    description,
    stage,
    support,
    comments: [], //COMMENTS FOR EACH PROJECT
  };

  projects.push(newProject);

  console.log("Projects:", projects);

  res.json({
    message: "Project created successfully",
    project: newProject,
  });
});

app.get("/projects", (req, res) => {
  res.json(projects);
});

// ADDED: ADD COMMENT TO A PROJECT (COLLABORATION FEATURE)
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

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});