// Sidebar.jsx
import React from "react";
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PetsIcon from "@mui/icons-material/Pets";
import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import SpaIcon from "@mui/icons-material/Spa";

export default function Sidebar() {
  const { pathname } = useLocation();

  const items = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { label: "Bookings", icon: <CalendarMonthIcon />, path: "/bookings" },
    { label: "Customers", icon: <PeopleIcon />, path: "/customers" },
    { label: "Pets", icon: <PetsIcon />, path: "/pets" },
    { label: "Products", icon: <ShoppingBagIcon />, path: "/products" },
    { label: "Services", icon: <SpaIcon />, path: "/services" },
  ];

  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        backgroundColor: "#4ABDAC",
        color: "white",
        position: "fixed",
        top: 0,
        left: 0,
        pt: 10,
      }}
    >
      <List>
        {items.map((item) => (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            sx={{
              color: pathname === item.path ? "#fff" : "rgba(255,255,255,0.7)",
              backgroundColor: pathname === item.path ? "rgba(255,255,255,0.15)" : "transparent",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.25)" },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
