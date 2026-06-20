import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      email,
      password,
      rememberMe,
    });

    alert("Login Successful!");
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "50px auto",
        padding: "30px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h1>Welcome Back</h1>

      <p
        style={{
          color: "#666",
          marginBottom: "20px",
        }}
      >
        Login to your CasaGH account
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() =>
                setRememberMe(!rememberMe)
              }
            />
            {" "}Remember Me
          </label>
<Link to="/forgot-password">
  Forgot Password?
</Link>
          
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#0F4C81",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>

      <p
        style={{
          marginTop: "20px",
          textAlign: "center",
        }}
      >
        Don't have an account?{" "}
        <Link to="/register">
          Create Account
        </Link>
      </p>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxSizing: "border-box" as const,
};

export default Login;