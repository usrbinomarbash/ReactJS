import React, { useEffect, useState } from "react";
import api from "../api/api";
import Typewriter from "../components/Typewriter";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
  Button,
  Modal,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";
import { Add, Edit, Delete, Search } from "@mui/icons-material";

/* 🔥 IMAGE RESOLVER — THIS BRINGS BACK OLD PICTURES */
const getPetImage = (pet) => {
  if (!pet) return "/images/dog.jpg";

  const species = pet.species?.toLowerCase();
  const breed = pet.breed?.toLowerCase();

  if (breed?.includes("chihuahua")) return "/images/chihuahua.jpg";
  if (breed?.includes("german")) return "/images/germanShep.webp";

  switch (species) {
    case "dog":
      return "/images/dog.jpg";
    case "cat":
      return "/images/cat.jpg";
    case "bird":
      return "/images/bird.jpg";
    case "fish":
      return "/images/fish.jpg";
    default:
      return "/images/dog.jpg";
  }
};

export default function Pets() {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("name");
  const [speciesFilter, setSpeciesFilter] = useState("All");

  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    customerId: "",
  });

  const speciesList = ["Dog", "Cat", "Bird", "Fish", "Rabbit", "Hamster", "Other"];

  useEffect(() => {
    fetchPets();
    fetchCustomers();
  }, []);

  useEffect(() => {
    let filtered = [...pets];

    if (speciesFilter !== "All") {
      filtered = filtered.filter(
        (p) => p.species?.toLowerCase() === speciesFilter.toLowerCase()
      );
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((pet) =>
        pet[searchField]?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPets(filtered);
  }, [searchTerm, searchField, speciesFilter, pets]);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/pets");
      setPets(res.data);
      setFilteredPets(res.data);
    } catch {
      setError("Failed to load pets");
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch {}
  };

  const handleOpen = (pet = null) => {
    setError("");
    if (pet) {
      setEditingPet(pet);
      setForm({
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        customerId: pet.customer?.customerId || "",
      });
    } else {
      setEditingPet(null);
      setForm({ name: "", species: "", breed: "", age: "", customerId: "" });
    }
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      age: Number(form.age),
      customerId: Number(form.customerId),
    };

    try {
      editingPet
        ? await api.put(`/pets/${editingPet.petId}`, payload)
        : await api.post("/pets", payload);
      setOpen(false);
      fetchPets();
    } catch (err) {
      setError(err.response?.data?.message || "Error saving pet");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this pet?")) return;
    await api.delete(`/pets/${id}`);
    fetchPets();
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        <Typewriter text="🐾 Pets" />
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              <TableCell sx={{ color: "white" }}>Pet</TableCell>
              <TableCell sx={{ color: "white" }}>Species</TableCell>
              <TableCell sx={{ color: "white" }}>Breed</TableCell>
              <TableCell sx={{ color: "white" }}>Age</TableCell>
              <TableCell sx={{ color: "white" }}>Owner</TableCell>
              <TableCell sx={{ color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredPets.map((p) => (
              <TableRow key={p.petId} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <img
                      src={getPetImage(p)}
                      alt={p.name}
                      width={48}
                      height={48}
                      style={{
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #1976d2",
                      }}
                      onError={(e) => (e.target.src = "/images/dog.jpg")}
                    />
                    <Box>
                      <Typography fontWeight="bold">{p.name}</Typography>
                      <Typography variant="caption">
                        {p.breed || "Unknown"}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Chip label={p.species} />
                </TableCell>
                <TableCell>{p.breed}</TableCell>
                <TableCell>{p.age}</TableCell>
                <TableCell>{p.customer?.fullName}</TableCell>

                <TableCell>
                  <IconButton onClick={() => handleOpen(p)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(p.petId)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
