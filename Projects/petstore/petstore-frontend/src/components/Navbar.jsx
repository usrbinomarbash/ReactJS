import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  TextField,
  InputAdornment,
  Tooltip,
  Badge,
  Popover,
  ListItem,
  Divider,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import PetsIcon from "@mui/icons-material/Pets";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import SpaIcon from "@mui/icons-material/Spa";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssessmentIcon from "@mui/icons-material/Assessment";
import StoreIcon from "@mui/icons-material/Store";
import BadgeIcon from "@mui/icons-material/Badge";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import api from "../api/api";

export default function NavBar({ mode, toggleDarkMode }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [lowStockItems, setLowStockItems] = useState([]);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const toggleDrawer = () => setOpen(!open);

  useEffect(() => {
    api.get("/reports/low-stock")
      .then((res) => setLowStockItems(res.data))
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setOpen(false);
    }
  };

  const menuItems = [
    { label: "Home",       icon: <HomeIcon />,          path: "/",           color: "#4ABDAC" },
    { label: "Dashboard",  icon: <DashboardIcon />,      path: "/dashboard",  color: "#1976D2" },
    { label: "Customers",  icon: <PeopleIcon />,         path: "/customers",  color: "#9C27B0" },
    { label: "Pets",       icon: <PetsIcon />,           path: "/pets",       color: "#FF9800" },
    { label: "Products",   icon: <ShoppingBagIcon />,    path: "/products",   color: "#4CAF50" },
    { label: "Services",   icon: <SpaIcon />,            path: "/services",   color: "#00BCD4" },
    { label: "Bookings",   icon: <CalendarMonthIcon />,  path: "/bookings",   color: "#4ABDAC" },
    { label: "Orders",     icon: <ShoppingCartIcon />,   path: "/orders",     color: "#0288d1" },
    { label: "Categories", icon: <CategoryIcon />,       path: "/categories", color: "#f59e0b" },
    { label: "Vendors",    icon: <StoreIcon />,          path: "/vendors",    color: "#FF5722" },
    { label: "Employees",  icon: <BadgeIcon />,          path: "/employees",  color: "#607D8B" },
    { label: "Reports",    icon: <AssessmentIcon />,     path: "/reports",    color: "#4ABDAC" },
  ];

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "64px",
          backgroundColor: "#4ABDAC",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          zIndex: 1300,
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{ color: "white", fontWeight: "bold", textDecoration: "none", flexShrink: 0 }}
        >
          PetStore
        </Typography>

        {/* Global Search */}
        <TextField
          placeholder="Search anything... (Enter)"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
          sx={{
            flexGrow: 1,
            maxWidth: 420,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: "20px",
              color: "white",
              "& fieldset": { borderColor: "rgba(255,255,255,0.4)" },
              "&:hover fieldset": { borderColor: "rgba(255,255,255,0.8)" },
              "&.Mui-focused fieldset": { borderColor: "white" },
            },
            "& .MuiInputBase-input::placeholder": { color: "rgba(255,255,255,0.75)" },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "rgba(255,255,255,0.8)" }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {/* Notification Bell */}
          <Tooltip title="Low Stock Alerts">
            <IconButton
              onClick={(e) => setNotifAnchor(e.currentTarget)}
              sx={{ color: "white", "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" } }}
            >
              <Badge badgeContent={lowStockItems.length} color="error" max={99}>
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Dark Mode Toggle */}
          <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            <IconButton
              onClick={toggleDarkMode}
              sx={{ color: "white", "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" } }}
            >
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>

          {/* Hamburger */}
          <IconButton
            onClick={toggleDrawer}
            sx={{
              color: "white",
              transition: "transform 0.3s ease",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
            }}
          >
            {open ? <CloseIcon sx={{ fontSize: 28 }} /> : <MenuIcon sx={{ fontSize: 28 }} />}
          </IconButton>
        </Box>
      </Box>

      {/* Low Stock Popover */}
      <Popover
        open={Boolean(notifAnchor)}
        anchorEl={notifAnchor}
        onClose={() => setNotifAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: { width: 320, maxHeight: 400, overflow: "auto", borderRadius: 2, mt: 1 },
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid #e2e8f0" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Low Stock Alerts</Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {lowStockItems.length} product{lowStockItems.length !== 1 ? "s" : ""} below threshold
          </Typography>
        </Box>
        {lowStockItems.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
            <Typography variant="body2">All products are well stocked</Typography>
          </Box>
        ) : (
          <List dense disablePadding>
            {lowStockItems.map((item, idx) => (
              <Box key={item.product_id ?? idx}>
                <ListItem sx={{ py: 1.5, px: 2 }}>
                  <WarningAmberIcon
                    sx={{
                      color: item.stock_quantity === 0 ? "#d32f2f" : "#ed6c02",
                      mr: 1.5,
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  />
                  <ListItemText
                    primary={item.name}
                    secondary={
                      item.stock_quantity === 0
                        ? "OUT OF STOCK"
                        : `${item.stock_quantity} left · ${item.category_name || "Uncategorized"}`
                    }
                    primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }}
                    secondaryTypographyProps={{
                      color: item.stock_quantity === 0 ? "error.main" : "warning.main",
                      fontWeight: 500,
                    }}
                  />
                </ListItem>
                {idx < lowStockItems.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </Popover>

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
                    from: { opacity: 0, transform: "translateX(20px)" },
                    to: { opacity: 1, transform: "translateX(0)" },
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
      </Drawer>

      <Box sx={{ height: "64px" }} />
    </>
  );
}
