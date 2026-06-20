import PropertyCard from "../components/PropertyCard";

function SavedProperties() {
  const savedProperties = [
    {
      id: 1,
      title: "Luxury Villa",
      location: "Accra",
      price: 950000,
      image: "https://picsum.photos/300/200?random=30",
      images: [
        "https://picsum.photos/800/400?random=30",
        "https://picsum.photos/800/400?random=31",
        "https://picsum.photos/800/400?random=32",
      ],
      description:
        "Beautiful luxury villa with modern facilities and spacious rooms.",
    },
    {
      id: 2,
      title: "Modern Apartment",
      location: "Kumasi",
      price: 550000,
      image: "https://picsum.photos/300/200?random=33",
      images: [
        "https://picsum.photos/800/400?random=33",
        "https://picsum.photos/800/400?random=34",
        "https://picsum.photos/800/400?random=35",
      ],
      description:
        "Modern apartment located in a peaceful neighborhood.",
    },
  ];

  return (
    <div
      style={{
        padding: "30px",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
      }}
    >
      <h1>❤️ Saved Properties</h1>

      <p
        style={{
          color: "#666",
          marginBottom: "30px",
        }}
      >
        Properties you have saved for later.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {savedProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
          />
        ))}
      </div>
    </div>
  );
}

export default SavedProperties;