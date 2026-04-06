import React, { useEffect, useState } from "react";
import api from "../api/api";
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
  InputLabel
} from "@mui/material";
import { Add, Edit, Delete, Search } from "@mui/icons-material";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("fullName");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    email: ""
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers when search changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const filtered = customers.filter(customer => {
      const value = customer[searchField];
      if (!value) return false;
      return value.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredCustomers(filtered);
  }, [searchTerm, searchField, customers]);

  const fetchCustomers = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Fetching customers...");
      const res = await api.get("/customers");  
      console.log("Customers loaded:", res.data);
      setCustomers(res.data);
      setFilteredCustomers(res.data);
    } catch (err) {
      console.error("LOAD ERROR:", err);
      setError(err.response?.data?.message || "Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer.customerId}`, form); 
      } else {
        await api.post("/customers", form);
      }
      fetchCustomers();
      handleClose();
    } catch (err) {
      console.error("SAVE ERROR:", err);
      if (err.response?.data?.errors) {
        const validationErrors = Object.entries(err.response.data.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(", ");
        setError(validationErrors);
      } else {
        setError(err.response?.data?.message || "Error saving customer");
      }
    }
  };

  const handleOpen = (customer = null) => {
    setError("");
    if (customer) {
      setEditingCustomer(customer);
      setForm({
        fullName: customer.fullName || "",
        phone: customer.phone || "",
        address: customer.address || "",
        email: customer.email || ""
      });
    } else {
      setEditingCustomer(null);
      setForm({ fullName: "", phone: "", address: "", email: "" });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError("");
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      await api.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting customer");
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredCustomers(customers);
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
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        👥 Customers
      </Typography>

      {/* Search Bar */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Search By</InputLabel>
          <Select
            value={searchField}
            label="Search By"
            onChange={(e) => setSearchField(e.target.value)}
            size="small"
          >
            <MenuItem value="fullName">Name</MenuItem>
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="phone">Phone</MenuItem>
            <MenuItem value="address">Address</MenuItem>
          </Select>
        </FormControl>

        <TextField
          placeholder="Search customers..."
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
          <Button variant="outlined" onClick={handleClearSearch}>
            Clear
          </Button>
        )}

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{ ml: "auto" }}
        >
          Add Customer
        </Button>
      </Box>

      {/* Results Count */}
      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
        Showing {filteredCustomers.length} of {customers.length} customers
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {filteredCustomers.length === 0 ? (
        <Alert severity="info">
          {searchTerm ? "No customers match your search." : "No customers found. Click 'Add Customer' to create one."}
        </Alert>
      ) : (
        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1976d2" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Phone</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Address</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredCustomers.map((c) => (
                <TableRow key={c.customerId} hover>
                  <TableCell>{c.fullName || "N/A"}</TableCell>
                  <TableCell>{c.phone || "N/A"}</TableCell>
                  <TableCell>{c.address || "N/A"}</TableCell>
                  <TableCell>{c.email || "N/A"}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpen(c)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(c.customerId)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            p: 4,
            backgroundColor: "white",
            borderRadius: 3,
            width: 400,
            mx: "auto",
            mt: "10%",
            boxShadow: 5,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {editingCustomer ? "Edit Customer" : "Add Customer"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="success" fullWidth type="submit">
              {editingCustomer ? "Update Customer" : "Add Customer"}
            </Button>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}