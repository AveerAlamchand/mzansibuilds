const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  console.log("Login request:", email, password);

  res.json({ message: "Login successful (mock)" });
});

// Register route
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  console.log("Register request:", email, password);

  res.json({ message: "Register successful (mock)" });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});