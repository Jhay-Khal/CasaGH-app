import { useState } from "react";
import PropertyCard from "../components/PropertyCard";
import Footer from "../components/Footer";
import { properties } from "../data/properties";

function Home() {
  const [search, setSearch] = useState("");

  const filteredProperties = properties.filter((property) =>
    property.location
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <section
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "500px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: "40px",
            borderRadius: "15px",
            textAlign: "center",
            color: "white",
          }}
        >
          <h1
  style={{
    fontSize: "3rem",
    marginBottom: "10px",
    color: "#DCFCE7",
  }}
>
   Welcome to CasaGH
</h1>

          <p
            style={{
              fontSize: "1.2rem",
              marginBottom: "20px",
            }}
          >
            Find Houses for Sale and Hostels for Rent Across Ghana
          </p>

         <input
  type="text"
  placeholder="Search by location..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    padding: "12px",
    width: "300px",
    borderRadius: "8px",
    border: "2px solid #16A34A",
    outline: "none",
  }}
/>

          <div style={{ marginTop: "20px" }}>
            <button
              style={{
               backgroundColor: "#15803D",
                color: "white",
                border: "none",
                padding: "12px 20px",
                marginRight: "10px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Buy a House
            </button>

            <button
              style={{
                backgroundColor: "#16A34A",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Rent a Hostel
            </button>
          </div>
        </div>
      </section>

      <section style={{ padding: "40px 20px" }}>
        <h2
  style={{
    color: "#16A34A",
    marginBottom: "20px",
  }}
>
  Featured Properties
</h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;