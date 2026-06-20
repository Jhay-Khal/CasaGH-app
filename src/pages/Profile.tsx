function Profile() {
  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "30px",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h1>My Profile</h1>

      <div style={{ marginTop: "20px" }}>
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
      </div>

      <button
        style={{
          marginTop: "20px",
          padding: "12px 20px",
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
  );
}

export default Profile;