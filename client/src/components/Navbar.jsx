import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  // ADDED: SINGLE SOURCE OF TRUTH FOR AUTH STATUS
  const getToken = () => localStorage.getItem("token");

  const [token, setToken] = useState(getToken());

  // ADDED: LISTEN FOR LOGIN AND LOGOUT CHANGES
  useEffect(() => {
    const syncAuth = () => {
      setToken(getToken());
    };

    window.addEventListener("authChange", syncAuth);
    window.addEventListener("focus", syncAuth);

    return () => {
      window.removeEventListener("authChange", syncAuth);
      window.removeEventListener("focus", syncAuth);
    };
  }, []);

  // ADDED: LOGOUT HANDLER
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2 style={{ color: "#00c853", margin: 0 }}>MzansiBuilds</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>

        {!token && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {token && (
          <>
            <Link to="/create">Create Project</Link>
            <button
              onClick={handleLogout}
              style={{
                background: "black",
                color: "red",
                border: "1px solid red",
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;