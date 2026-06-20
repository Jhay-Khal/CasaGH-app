import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Houses from "./pages/Houses";
import Hostels from "./pages/Hostels";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MyListings from "./pages/MyListings";
import SavedProperties from "./pages/SavedProperties";
import AddProperty from "./pages/AddProperty";
import ForgotPassword from "./pages/ForgotPassword";
import PropertyDetails from "./pages/PropertyDetails";
import HostelDetails from "./pages/HostelDetails";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#121212" : "#f5f7fa",
        color: darkMode ? "white" : "black",
        minHeight: "100vh",
      }}
    >
      <BrowserRouter>
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/houses" element={<Houses />} />
          <Route path="/hostels" element={<Hostels />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/add-property"
            element={<AddProperty />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/my-listings"
            element={<MyListings />}
          />

          <Route
            path="/saved-properties"
            element={<SavedProperties />}
          />

          <Route
            path="/property/:id"
            element={<PropertyDetails />}
          />

          <Route
            path="/hostel/:id"
            element={<HostelDetails />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;