import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Typewriter from "../components/Typewriter";
import api from "../api/api";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import PetsIcon from "@mui/icons-material/Pets";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import SpaIcon from "@mui/icons-material/Spa";
import BadgeIcon from "@mui/icons-material/Badge";
import StoreIcon from "@mui/icons-material/Store";
import SearchIcon from "@mui/icons-material/Search";

const sections = [
  { key: "customers", label: "Customers", icon: <PeopleIcon />, color: "#9C27B0", link: "/customers", nameKey: "full_name", subKey: "email" },
  { key: "pets",      label: "Pets",      icon: <PetsIcon />,   color: "#FF9800", link: "/pets",      nameKey: "name",      subKey: "species" },
  { key: "products",  label: "Products",  icon: <ShoppingBagIcon />, color: "#4CAF50", link: "/products", nameKey: "name", subKey: "category" },
  { key: "services",  label: "Services",  icon: <SpaIcon />,    color: "#00BCD4", link: "/services",  nameKey: "name",      subKey: "price" },
  { key: "employees", label: "Employees", icon: <BadgeIcon />,  color: "#607D8B", link: "/employees", nameKey: "name",      subKey: "email" },
  { key: "vendors",   label: "Vendors",   icon: <StoreIcon />,  color: "#FF5722", link: "/vendors",   nameKey: "name",      subKey: "contact_person" },
];

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    api
      .get(`/search?q=${encodeURIComponent(query)}`)
      .then((res) => setResults(res.data))
      .catch(() => setError("Search failed. Please try again."))
      .finally(() => setLoading(false));
  }, [query]);

  if (!query) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <SearchIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
        <Typography variant="h5" color="text.secondary">
          Enter a search term in the top bar to get started.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const totalResults = results?.totalResults ?? 0;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          <Typewriter text="Search Results" />
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          {totalResults > 0
            ? `Found ${totalResults} result${totalResults !== 1 ? "s" : ""} for `
            : "No results found for "}
          <strong>"{query}"</strong>
        </Typography>
      </Box>

      {totalResults === 0 && results && (
        <Alert severity="info">
          No matches found. Try a different search term.
        </Alert>
      )}

      <Grid container spacing={3}>
        {sections.map((section) => {
          const items = results?.[section.key] ?? [];
          if (items.length === 0) return null;

          return (
            <Grid item xs={12} md={6} key={section.key}>
              <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
                <Box
                  sx={{
                    px: 2,
                    py: 1.5,
                    backgroundColor: section.color,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box sx={{ color: "white", display: "flex" }}>{section.icon}</Box>
                  <Typography sx={{ color: "white", fontWeight: "bold" }}>
                    {section.label}
                  </Typography>
                  <Chip
                    label={items.length}
                    size="small"
                    sx={{ ml: "auto", backgroundColor: "rgba(255,255,255,0.25)", color: "white" }}
                  />
                </Box>
                <List dense disablePadding>
                  {items.map((item, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <Divider />}
                      <ListItem
                        component={Link}
                        to={section.link}
                        sx={{
                          textDecoration: "none",
                          color: "inherit",
                          "&:hover": { backgroundColor: "action.hover" },
                          py: 1.5,
                          px: 2,
                        }}
                      >
                        <ListItemIcon sx={{ color: section.color, minWidth: 36 }}>
                          {section.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography fontWeight={500}>
                              {item[section.nameKey] || "Unnamed"}
                            </Typography>
                          }
                          secondary={
                            item[section.subKey]
                              ? String(item[section.subKey])
                              : undefined
                          }
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
