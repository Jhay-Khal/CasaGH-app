import { useState } from "react";

function Settings() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      style={{
        padding: "30px",
        minHeight: "100vh",
        backgroundColor: darkMode ? "#121212" : "#f5f7fa",
        color: darkMode ? "white" : "black",
      }}
    >
      <h1>⚙️ Settings</h1>

      <div
        style={{
          backgroundColor: darkMode ? "#1e1e1e" : "white",
          padding: "25px",
          borderRadius: "12px",
          marginTop: "20px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Appearance</h2>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            backgroundColor: "#16A34A",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          {darkMode
            ? "☀️ Disable Dark Mode"
            : "🌙 Enable Dark Mode"}
        </button>

        <p
          style={{
            marginTop: "15px",
            color: darkMode ? "#ccc" : "#666",
          }}
        >
          Toggle between light and dark theme.
        </p>
      </div>
    </div>
  );
}

export default Settings;