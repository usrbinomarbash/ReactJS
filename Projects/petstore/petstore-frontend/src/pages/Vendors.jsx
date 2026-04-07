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
  Chip,
} from "@mui/material";
import { Add, Edit, Delete, Search, Store } from "@mui/icons-material";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    name: "",
    contactPerson: "",
    areaCode: "",
    countryCode: "",
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFiltered(vendors);
      return;
    }
    const q = searchTerm.toLowerCase();
    setFiltered(
      vendors.filter(
        (v) =>
          v.name?.toLowerCase().includes(q) ||
          v.contactPerson?.toLowerCase().includes(q) ||
          v.countryCode?.toLowerCase().includes(q)
      )
    );
  }, [searchTerm, vendors]);

  const fetchVendors = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/vendors");
      setVendors(res.data);
      setFiltered(res.data);
    } catch (err) {
      setError("Failed to load vendors.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (vendor = null) => {
    setError("");
    if (vendor) {
      setEditing(vendor);
      setForm({
        name: vendor.name || "",
        contactPerson: vendor.contactPerson || "",
        areaCode: vendor.areaCode || "",
        countryCode: vendor.countryCode || "",
      });
    } else {
      setEditing(null);
      setForm({ name: "", contactPerson: "", areaCode: "", countryCode: "" });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError("");
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await api.put(`/vendors/${editing.vendorId}`, form);
      } else {
        await api.post("/vendors", form);
      }
      fetchVendors();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "Error saving vendor.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vendor?")) return;
    try {
      await api.delete(`/vendors/${id}`);
      fetchVendors();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting vendor.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
        <Store fontSize="large" sx={{ color: "#FF5722" }} />
        <Typewriter text="Vendors" />
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
        <TextField
          placeholder="Search vendors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ flexGrow: 1, maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        {searchTerm && (
          <Button variant="outlined" onClick={() => setSearchTerm("")}>
            Clear
          </Button>
        )}
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{ ml: "auto", backgroundColor: "#FF5722", "&:hover": { backgroundColor: "#E64A19" } }}
        >
          Add Vendor
        </Button>
      </Box>

      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
        Showing {filtered.length} of {vendors.length} vendors
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {filtered.length === 0 ? (
        <Alert severity="info">
          {searchTerm ? "No vendors match your search." : "No vendors found. Click 'Add Vendor' to create one."}
        </Alert>
      ) : (
        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#FF5722" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Vendor Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Contact Person</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Area Code</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Country</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((v) => (
                <TableRow key={v.vendorId} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{v.name || "N/A"}</TableCell>
                  <TableCell>{v.contactPerson || "N/A"}</TableCell>
                  <TableCell>{v.areaCode || "N/A"}</TableCell>
                  <TableCell>
                    {v.countryCode ? (
                      <Chip label={v.countryCode} size="small" color="default" />
                    ) : "N/A"}
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpen(v)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(v.vendorId)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            p: 4,
            bgcolor: "background.paper",
            borderRadius: 3,
            width: 420,
            mx: "auto",
            mt: "10%",
            boxShadow: 5,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {editing ? "Edit Vendor" : "Add Vendor"}
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Vendor Name" name="name"
              value={form.name} onChange={handleChange} required sx={{ mb: 2 }}
            />
            <TextField
              fullWidth label="Contact Person" name="contactPerson"
              value={form.contactPerson} onChange={handleChange} sx={{ mb: 2 }}
            />
            <TextField
              fullWidth label="Area Code" name="areaCode"
              value={form.areaCode} onChange={handleChange} sx={{ mb: 2 }}
            />
            <TextField
              fullWidth label="Country Code" name="countryCode"
              value={form.countryCode} onChange={handleChange} sx={{ mb: 2 }}
            />
            <Button variant="contained" color="success" fullWidth type="submit">
              {editing ? "Update Vendor" : "Add Vendor"}
            </Button>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}
