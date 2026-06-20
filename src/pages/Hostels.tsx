import { useState } from "react";
import PropertyCard from "../components/PropertyCard";
import { hostels } from "../data/hostels";

function Hostels() {
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filteredHostels = hostels.filter((hostel) => {
    const matchesLocation = hostel.location
      .toLowerCase()
      .includes(location.toLowerCase());

    const matchesPrice =
      maxPrice === "" ||
      hostel.price <= Number(maxPrice);

    return matchesLocation && matchesPrice;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1>Available Hostels</h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {filteredHostels.map((hostel) => (
          <PropertyCard
            key={hostel.id}
            property={hostel}
            linkPath="/hostel"
          />
        ))}
      </div>
    </div>
  );
}

export default Hostels;