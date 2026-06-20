
import { Link } from "react-router-dom";
function Dashboard() {
  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          marginBottom: "10px",
        }}
      >
        Dashboard
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom: "30px",
        }}
      >
        Welcome back to CasaGH
      </p>

      {/* Statistics Cards */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "40px",
        }}
      >
        <div style={cardStyle}>
          <h2>12</h2>
          <p>Properties Posted</p>
        </div>

        <div style={cardStyle}>
          <h2>8</h2>
          <p>Saved Properties</p>
        </div>

        <div style={cardStyle}>
          <h2>5</h2>
          <p>Messages</p>
        </div>

        <div style={cardStyle}>
          <h2>90%</h2>
          <p>Profile Complete</p>
        </div>
      </div>

      {/* Profile Information */}
      <div
        style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          marginBottom: "30px",
        }}
      >
        <h2>👤 My Profile</h2>

        <p>
          <strong>Name:</strong> John Doe
        </p>

        <p>
          <strong>Email:</strong> johndoe@gmail.com
        </p>

        <p>
          <strong>Phone:</strong> +233 55 123 4567
        </p>

        <p>
          <strong>Account Type:</strong> Property Owner
        </p>

        <button
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: "#0F4C81",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Edit Profile
        </button>
      </div>

      {/* Dashboard Sections */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
       <Link
  to="/my-listings"
  style={{
    textDecoration: "none",
    color: "inherit",
  }}
>
  <div style={sectionStyle}>
    <h3>🏠 My Listings</h3>
    <p>Manage your houses and hostels.</p>
  </div>
</Link>

 <Link
  to="/saved-properties"
  style={{
    textDecoration: "none",
    color: "inherit",
  }}
>
  <div style={sectionStyle}>
    <h3>❤️ Saved Properties</h3>
    <p>View your favourite properties.</p>
  </div>
</Link>

        <div style={sectionStyle}>
          <h3>⚙️ Settings</h3>
          <p>Manage your account settings.</p>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "12px",
  width: "220px",
  textAlign: "center" as const,
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const sectionStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "12px",
  width: "280px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

export default Dashboard;