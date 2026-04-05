import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "black" }}>
      <h2 style={{ color: "white" }}>MzansiBuilds</h2>

      <div style={{ marginTop: "10px" }}>
        <Link to="/" style={{ color: "green", marginRight: "10px" }}>
          Home
        </Link>

        <Link to="/login" style={{ color: "green", marginRight: "10px" }}>
          Login
        </Link>

        <Link to="/register" style={{ color: "green" }}>
          Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;