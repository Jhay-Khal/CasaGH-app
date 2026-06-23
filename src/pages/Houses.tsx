import { useState } from "react";

import PropertyCard from "../components/PropertyCard";



const houses = [

  {

    id: 1,

    title: "Luxury Villa",

    location: "Accra",

    price: 950000,

    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",

  },

  {

    id: 2,

    title: "Modern Apartment",

    location: "Kumasi",

    price: 550000,

    image:  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",

  },

  {

    id: 3,

    title: "Family House",

    location: "Takoradi",

    price: 700000,

    image:      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",

  },

];



function Houses() {

  const [location, setLocation] = useState("");

  const [maxPrice, setMaxPrice] = useState("");



  const filteredHouses = houses.filter((house) => {

    const matchesLocation = house.location

      .toLowerCase()

      .includes(location.toLowerCase());



    const matchesPrice =

      maxPrice === "" ||

      house.price <= Number(maxPrice);



    return matchesLocation && matchesPrice;

  });



  return (

    <div style={{ padding: "20px" }}>

      <h1>Available Houses</h1>



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

        {filteredHouses.map((house) => (

          <PropertyCard

            key={house.id}

            property={house}

          />

        ))}

      </div>

    </div>

  );

}



export default Houses;