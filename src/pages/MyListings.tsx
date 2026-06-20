import PropertyCard from "../components/PropertyCard";

const myListings = [
  {
    id: 1,
    title: "Luxury Villa",
    location: "Accra",
    price: 950000,
    image: "https://picsum.photos/300/200?random=20",
    images: [
      "https://picsum.photos/800/400?random=20",
      "https://picsum.photos/800/400?random=21",
      "https://picsum.photos/800/400?random=22",
    ],
    description:
      "Beautiful luxury villa with modern facilities and spacious rooms.",
  },
  {
    id: 2,
    title: "Student Hostel",
    location: "Kumasi",
    price: 2000,
    image: "https://picsum.photos/300/200?random=23",
    images: [
      "https://picsum.photos/800/400?random=23",
      "https://picsum.photos/800/400?random=24",
      "https://picsum.photos/800/400?random=25",
    ],
    description:
      "Affordable hostel close to campus with WiFi and security.",
  },
];

function MyListings() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>My Listings</h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {myListings.map((property) => (
          <div key={property.id}>
            <PropertyCard property={property} />

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <button>Edit</button>
              <button>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyListings;