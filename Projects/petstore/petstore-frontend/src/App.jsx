import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Pets from "./pages/Pets";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Bookings from "./pages/Bookings";
import NavBar from "./components/NavBar";
import Reports from "./pages/Reports";


function App() {
  return (
    <Router>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* NavBar appears ONCE at the top */}
        <NavBar/>
        {/* Main content area */}
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/products" element={<Products />} />
            <Route path="/services" element={<Services />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/reports" element={<Reports />} />
            
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;