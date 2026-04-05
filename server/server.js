const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (user.password !== password) {
    return res.status(400).json({ message: "Invalid password" });
  }

  res.json({ message: "Login successful" });
});

// Register route
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  // check if user exists
  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // store user
  users.push({ email, password });

  console.log("Users:", users);

  res.json({ message: "User registered successfully" });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});