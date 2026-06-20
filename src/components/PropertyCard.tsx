import { Link } from "react-router-dom";
import { useState } from "react";
import type { Property } from "../types/Property";

interface PropertyCardProps {
  property: Property;
  linkPath?: string;
}

function PropertyCard({
  property,
  linkPath = "/property",
}: PropertyCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <div
      style={{
        width: "300px",
        borderRadius: "15px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        backgroundColor: "#fff",
        transition: "0.3s",
      }}
    >
      <div style={{ position: "relative" }}>
        <img
          src={property.image}
          alt={property.title}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
          }}
        />

        <button
          onClick={() => setSaved(!saved)}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "white",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            cursor: "pointer",
            fontSize: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          {saved ? "❤️" : "🤍"}
        </button>
      </div>

      <div style={{ padding: "15px" }}>
        <h2
          style={{
            margin: "0 0 10px 0",
            fontSize: "1.3rem",
          }}
        >
          {property.title}
        </h2>

        <p
          style={{
            color: "#666",
          }}
        >
          📍 {property.location}
        </p>

        <h3
          style={{
            color: "#0F4C81",
          }}
        >
          GHS {property.price.toLocaleString()}
        </h3>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "15px",
          }}
        >
          <Link
            to={`${linkPath}/${property.id}`}
            style={{
              flex: 1,
              textDecoration: "none",
            }}
          >
            <button
              style={{
                width: "100%",
                backgroundColor: "#F59E0B",
                color: "white",
                border: "none",
                padding: "12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              View Details
            </button>
          </Link>

          <button
            onClick={() => setSaved(!saved)}
            style={{
              backgroundColor: saved ? "#ef4444" : "#e5e7eb",
              color: saved ? "white" : "black",
              border: "none",
              padding: "12px",
              borderRadius: "8px",
              cursor: "pointer",
              minWidth: "60px",
            }}
          >
            ❤️
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;