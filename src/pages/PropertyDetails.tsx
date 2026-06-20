import InquiryForm from "../components/InquiryForm";
import { useParams } from "react-router-dom";
import { properties } from "../data/properties";

function PropertyDetails() {
  const { id } = useParams();

  const property = properties.find(
    (p) => p.id === Number(id)
  );

  if (!property) {
    return <h1>Property Not Found</h1>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{property.title}</h1>

      <img
        src={property.image}
        alt={property.title}
        style={{
          width: "100%",
          maxWidth: "800px",
          borderRadius: "10px",
        }}
      />

      <h2>Location</h2>
      <p>{property.location}</p>

      <h2>Price</h2>
      <p>GHS {property.price}</p>

      <h2>Description</h2>
      <p>{property.description}</p>
      <InquiryForm />
    </div>
  );
}

export default PropertyDetails;    