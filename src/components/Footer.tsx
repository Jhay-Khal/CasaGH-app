function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#15803D",
        color: "white",
        padding: "40px 20px",
        marginTop: "50px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <h3>CasaGH</h3>
          <p>Find houses and hostels.</p>
        </div>

        <div>
          <h3>Quick Links</h3>
          <p>Home</p>
          <p>Houses</p>
          <p>Hostels</p>
          <p>Login</p>
        </div>

        <div>
          <h3>Contact</h3>
          <p>Email: info@casagh.com</p>
          <p>Phone: +233 XX XXX XXXX</p>
        </div>

        <div>
          <h3>Follow Us</h3>
          <p>Facebook</p>
          <p>Instagram</p>
          <p>X (Twitter)</p>
        </div>
      </div>

      <hr style={{ margin: "20px 0" }} />

      <p style={{ textAlign: "center" }}>
        © 2026 CasaGH. All Rights Reserved.
      </p>
    </footer>
  );
}

export default Footer;