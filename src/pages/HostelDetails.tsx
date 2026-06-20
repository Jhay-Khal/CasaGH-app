import InquiryForm from "../components/InquiryForm";
import { useParams } from "react-router-dom";
import { hostels } from "../data/hostels";

function HostelDetails() {
  const { id } = useParams();

  const hostel = hostels.find(
    (h) => h.id === Number(id)
  );

  if (!hostel) {
    return <h1>Hostel Not Found</h1>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{hostel.title}</h1>

      <img
        src={hostel.image}
        alt={hostel.title}
        style={{
          width: "100%",
          maxWidth: "800px",
          borderRadius: "10px",
        }}
      />

      <h2>Location</h2>
      <p>{hostel.location}</p>

      <h2>Price Per Academic Year</h2>
      <p>GHS {hostel.price}</p>

      <h2>Description</h2>
      <p>{hostel.description}</p>

      <InquiryForm />
    </div>
  );
}

export default HostelDetails;