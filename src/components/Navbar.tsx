import { Link } from "react-router-dom";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

function Navbar({
  darkMode,
  setDarkMode,
}: NavbarProps) {
  return (
    <nav
      style={{
        backgroundColor: "#0F4C81",
        padding: "15px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <h2
        style={{
          color: "white",
          margin: 0,
        }}
      >
        CasaGH
      </h2>

      <ul
        style={{
          display: "flex",
          gap: "25px",
          listStyle: "none",
          margin: 0,
          padding: 0,
          alignItems: "center",
        }}
      >
        <li>
          <Link
            to="/"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            Home
          </Link>
        </li>

        <li>
          <Link
            to="/houses"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            Houses
          </Link>
        </li>

        <li>
          <Link
            to="/hostels"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            Hostels
          </Link>
        </li>

        <li>
          <Link
            to="/dashboard"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            Dashboard
          </Link>
        </li>

        <li>
          <Link
            to="/login"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        </li>

        <li>
          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            style={{
              backgroundColor: "#374151",
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {darkMode
              ? "☀️ Light"
              : "🌙 Dark"}
          </button>
        </li>

        <li>
          <Link to="/add-property">
            <button
              style={{
                backgroundColor: "#F59E0B",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Post Property
            </button>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;