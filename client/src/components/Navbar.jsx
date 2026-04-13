import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  // ADDED: SINGLE SOURCE OF TRUTH
  const getToken = () => localStorage.getItem("token");

  const [token, setToken] = useState(getToken());

  // ADDED: LISTEN FOR LOGIN/LOGOUT CHANGES
  useEffect(() => {
    const syncAuth = () => {
      setToken(getToken());
    };

    // ADDED: listen to custom auth event (FIXES YOUR ISSUE)
    window.addEventListener("authChange", syncAuth);

    // still useful
    window.addEventListener("focus", syncAuth);

    return () => {
      window.removeEventListener("authChange", syncAuth);
      window.removeEventListener("focus", syncAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px", background: "black" }}>
      <h2 style={{ color: "white" }}>MzansiBuilds</h2>

      <div style={{ marginTop: "10px" }}>
        <Link to="/" style={{ color: "green", marginRight: "10px" }}>
          Home
        </Link>

        {!token && (
          <>
            <Link to="/login" style={{ color: "green", marginRight: "10px" }}>
              Login
            </Link>

            <Link to="/register" style={{ color: "green", marginRight: "10px" }}>
              Register
            </Link>
          </>
        )}

        {token && (
          <>
            <Link to="/create" style={{ color: "green", marginRight: "10px" }}>
              Create Project
            </Link>

            <button
              onClick={handleLogout}
              style={{
                marginLeft: "10px",
                background: "black",
                color: "red",
                border: "1px solid red",
                cursor: "pointer",
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