import { FaWhatsapp, FaPhone } from "react-icons/fa";
import { useState } from "react";

function InquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    alert("Inquiry Sent!");

    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div
      style={{
        marginTop: "30px",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2>📨 Contact Owner</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          required
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
          style={inputStyle}
        />

        <textarea
          placeholder="Write your message..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          rows={5}
          required
          style={inputStyle}
        />

        <button
          type="submit"
          style={{
            backgroundColor: "#0F4C81",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          Send Inquiry
        </button>
      </form>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
       <a
  href="tel:+233551234567"
  style={{
    textDecoration: "none",
  }}
>
  <button
    style={{
      backgroundColor: "#2563eb",
      color: "white",
      border: "none",
      padding: "12px 20px",
      borderRadius: "8px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    }}
  >
    <FaPhone />
    Call 
  </button>
</a>

       <a
  href="https://wa.me/233551234567"
  target="_blank"
  rel="noreferrer"
  style={{
    textDecoration: "none",
  }}
>

  <button
    style={{
      backgroundColor: "#25D366",
      color: "white",
      border: "none",
      padding: "12px 20px",
      borderRadius: "8px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    }}
  >
    <FaWhatsapp />
    WhatsApp 
  </button>
</a>
      </div>
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

export default InquiryForm;