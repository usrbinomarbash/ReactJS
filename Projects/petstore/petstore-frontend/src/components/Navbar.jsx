import React,{useState} from "react";
import {Box, IconButton, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography} from "@mui/material";
import {Link, useLocation} from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import PetsIcon from "@mui/icons-material/Pets";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import SpaIcon from "@mui/icons-material/Spa";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function NavBar(){
    const [open,setOpen] = useState(false);
    const {pathname} = useLocation();

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const menuItems = [
        {label:"Home", icon: <HomeIcon/>, path:'/', color: "4ABDAC"},
        {label:"Dashboard", icon: <DashboardIcon/>, path:'/dashboard', color: "1976D2"},
        {label:"Customers", icon: <PeopleIcon/>, path:'/customers', color: "9C27B0"},
        {label:"Pets", icon: <PetsIcon/>, path:'/pets', color: "FF9800"},
        {label:"Products", icon: <ShoppingBagIcon/>, path:'/products', color: "4CAF50"},
        {label:"Services", icon: <SpaIcon/>, path:'/services', color: "00BCD4"},
        {label:"Booking", icon: <CalendarMonthIcon/>, path:'/bookings', color: "4ABDAC"},
        {label:"Reports", path: '/reports', color: "4ABDAC" }
    ]

    return(
        <>
            <Box
                sx={{
                    position: "fixed",
                    top:0,
                    left: 0,
                    right:0,
                    height: "64px",
                    backgroundColor: "#4ABDAC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 3,
                    zIndex: 1300,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                }}
            >
                <Typography
                variant="h5"
                component={Link}
                to="/"
                sx={{
                    color: "white",
                    fontWeight: "bold",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
                >
                    PetStore
                </Typography>
                <IconButton
                onClick={toggleDrawer}
                sx={{
                    color:"white",
                    transition: "transform 0.3s ease",
                    transform: open ? "rotate(180deg)" : "rotate(0deg)","&:hover": {
                        backgroundColor: "rgba(255,255,255,0.15)",
                    },
                }}
                >
                    {open ? (
                <CloseIcon sx={{ fontSize: 28 }} />
                ) : (
                    <MenuIcon sx={{ fontSize: 28 }} />
                    )}
                </IconButton>
            </Box>
            <Drawer
                anchor="right"
                open={open}
                onClose={toggleDrawer}
                sx={{
                "& .MuiDrawer-paper": {
                    width: 280,
                    backgroundColor: "#2C3E50",
                    paddingTop: "80px",
                    boxShadow: "-5px 0 20px rgba(0,0,0,0.3)",
                },
                }}
            >
                <List sx={{ px: 2 }}>
                {menuItems.map((item, index) => {
                    const isActive = pathname === item.path;
                    
                    return (
                    <ListItemButton
                        key={item.path}
                        component={Link}
                        to={item.path}
                        onClick={toggleDrawer}
                        sx={{
                        borderRadius: "12px",
                        mb: 1,
                        py: 1.5,
                        backgroundColor: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                        transition: "all 0.25s ease",
                        animation: open ? `slideIn 0.3s ease forwards` : "none",
                        animationDelay: `${index * 0.05}s`,
                        opacity: 0,
                        "@keyframes slideIn": {
                            from: {
                            opacity: 0,
                            transform: "translateX(20px)",
                            },
                            to: {
                            opacity: 1,
                            transform: "translateX(0)",
                            },
                        },
                        "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.1)",
                            transform: "translateX(8px)",
                        },
                        }}
                    >
                        <ListItemIcon
                        sx={{
                            color: isActive ? item.color : "rgba(255,255,255,0.7)",
                            minWidth: 45,
                            transition: "color 0.25s ease",
                        }}
                        >
                        {item.icon}
                        </ListItemIcon>
                        <ListItemText
                        primary={item.label}
                        sx={{
                            "& .MuiTypography-root": {
                            color: isActive ? "white" : "rgba(255,255,255,0.85)",
                            fontWeight: isActive ? 600 : 400,
                            fontSize: "1rem",
                            letterSpacing: "0.5px",
                            },
                        }}
                        />
                        {isActive && (
                        <Box
                            sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: item.color,
                            boxShadow: `0 0 8px ${item.color}`,
                            }}
                        />
                        )}
                    </ListItemButton>
                    );
                })}
                </List>
                <Box
                sx={{
                    position: "absolute",
                    bottom: 20,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                }}
                >
                <Typography
                    variant="caption"
                    sx={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "0.75rem",
                    }}
                >
                </Typography>
                </Box>
      </Drawer>
      <Box sx={{ height: "64px" }} />
        </>
    )
}