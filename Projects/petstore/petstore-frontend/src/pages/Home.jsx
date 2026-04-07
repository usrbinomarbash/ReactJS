import React from "react";
import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import Typewriter from "../components/Typewriter";
import PetsIcon from "@mui/icons-material/Pets";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleIcon from "@mui/icons-material/People";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SpaIcon from "@mui/icons-material/Spa";

export default function Home() {
  const floatingIconStyle = {
    position: "absolute",
    opacity: 0.25,
    width: "70px",
    animation: "float 6s ease-in-out infinite",
    zIndex: 1,
  };

  const features = [
    { title: "Dashboard", link: "/dashboard", icon: <DashboardIcon sx={{ fontSize: 40 }} />, color: "#1976D2" },
    { title: "Customers", link: "/customers", icon: <PeopleIcon sx={{ fontSize: 40 }} />, color: "#9C27B0" },
    { title: "Pets", link: "/pets", icon: <PetsIcon sx={{ fontSize: 40 }} />, color: "#FF9800" },
    { title: "Products", link: "/products", icon: <ShoppingBagIcon sx={{ fontSize: 40 }} />, color: "#4CAF50" },
    { title: "Services", link: "/services", icon: <SpaIcon sx={{ fontSize: 40 }} />, color: "#00BCD4" },
    { title: "Bookings", link: "/bookings", icon: <CalendarMonthIcon sx={{ fontSize: 40 }} />, color: "#F44336" },
  ];

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", backgroundColor: "#f5f7f8" }}>
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-25px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>


      <Box
        sx={{
          height: "70vh",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1558944351-c6c7d9a5c53d?auto=format&fit=crop&w=1950&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          overflow: "hidden",
        }}
      >

        <img
          src="https://cdn-icons-png.flaticon.com/512/194/194279.png"
          alt="paw"
          style={{ ...floatingIconStyle, top: "22%", left: "12%", animationDuration: "6s" }}
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
          alt="dog"
          style={{ ...floatingIconStyle, top: "58%", left: "78%", animationDuration: "8s" }}
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/1998/1998611.png"
          alt="cat"
          style={{ ...floatingIconStyle, top: "30%", left: "65%", animationDuration: "7s" }}
        />

        {/* Dark Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 2,
          }}
        />

        {/* Centered Content */}
        <Box sx={{ position: "relative", zIndex: 3, textAlign: "center", px: 3 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              mb: 2,
              textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
            }}
          >
            <Typewriter text="Welcome to PetStore 🐾" speed={60} />
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mb: 4,
              textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
            }}
          >
            <Typewriter text="Your one-stop shop for pets, care, grooming, and premium products" speed={25} delay={1200} />
          </Typography>

          <Button
            component={Link}
            to="/dashboard"
            variant="contained"
            size="large"
            sx={{
              px: 5,
              py: 1.5,
              fontSize: "1.1rem",
              backgroundColor: "#4ABDAC",
              "&:hover": { backgroundColor: "#3a978c" },
              boxShadow: "0 4px 12px rgba(74, 189, 172, 0.4)",
            }}
          >
            Get Started
          </Button>
        </Box>
      </Box>

      {/* FEATURES SECTION */}
      <Box sx={{ py: 8, px: 4, backgroundColor: "#fff" }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            mb: 1,
            color: "#333",
          }}
        >
          <Typewriter text="Explore Our Services" speed={50} delay={2800} />
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            mb: 5,
            color: "#666",
          }}
        >
          Manage everything your pet store needs in one place
        </Typography>

        <Grid container spacing={3} sx={{ maxWidth: 1200, mx: "auto" }}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={4} key={feature.title}>
              <Link to={feature.link} style={{ textDecoration: "none" }}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0px 12px 24px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <Box sx={{ color: feature.color, mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    {feature.title}
                  </Typography>
                </Paper>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        sx={{
          py: 4,
          textAlign: "center",
          backgroundColor: "#4ABDAC",
          color: "#fff",
        }}
      >
        <Typography variant="body1">
          © 2025 PetStore CSC 3326
        </Typography>
      </Box>
    </Box>
  );
}