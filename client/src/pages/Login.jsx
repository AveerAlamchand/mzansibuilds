import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // FIXED: removed nested function + cleaned logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // FIXED: handle error properly
      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      // ADDED: store JWT token (IMPORTANT FOR NEXT STEPS)
      localStorage.setItem("token", data.token);

      setMessage("Login successful!");

      // ADDED: redirect after login
      navigate("/home");
    } catch (error) {
      setMessage("Server error. Please try again.");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button style={{ marginTop: "10px" }} type="submit">
          Login
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;