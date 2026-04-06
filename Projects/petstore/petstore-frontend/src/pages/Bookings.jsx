import React, { useState, useEffect } from "react";
import api from "../api/api";
import {
  Box,
  Grid,
  Typography,
  Button,
  Modal,
  TextField,
  Paper,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete, Refresh } from "@mui/icons-material";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    date: "",
    petId: "",
    customerId: "",
    serviceType: "",
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Fetching bookings from API...");
      const res = await api.get("/bookings");
      console.log("Bookings received:", res.data);
      console.log("Number of bookings:", res.data.length);
      
      // Log each booking for debugging
      res.data.forEach((booking, index) => {
        console.log(`Booking ${index + 1}:`, {
          id: booking.bookingId,
          date: booking.date,
          customer: booking.customer?.fullName,
          pet: booking.pet?.name,
          service: booking.serviceType
        });
      });
      
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      console.error("Error details:", err.response?.data);
      setError(err.response?.data?.message || "Failed to load bookings. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (booking = null) => {
    setError("");
    if (booking) {
      setEditingBooking(booking);
      console.log("Editing booking:", booking);
      
      const customerId = booking.customer?.customerId || "";
      const petId = booking.pet?.petId || "";
      
      setForm({
        date: booking.date || "",
        petId: petId.toString(),
        customerId: customerId.toString(),
        serviceType: booking.serviceType || "",
      });
    } else {
      setEditingBooking(null);
      setForm({ date: "", petId: "", customerId: "", serviceType: "" });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.date || !form.customerId || !form.petId || !form.serviceType) {
      setError("All fields are required");
      return;
    }

    const payload = {
      date: form.date,
      customerId: Number(form.customerId),
      petId: Number(form.petId),
      serviceType: form.serviceType
    };

    console.log("Submitting booking payload:", payload);

    try {
      if (editingBooking) {
        const response = await api.put(`/bookings/${editingBooking.bookingId}`, payload);
        console.log("Booking updated successfully:", response.data);
      } else {
        const response = await api.post("/bookings", payload);
        console.log("Booking created successfully:", response.data);
      }
      
      // Close modal first
      handleClose();
      
      // Then refresh the bookings list
      console.log("Refreshing bookings list...");
      await fetchBookings();
      
    } catch (err) {
      console.error("Error saving booking:", err);
      console.error("Error response:", err.response?.data);
      
      // Handle validation errors
      if (err.response?.data?.errors) {
        const validationErrors = Object.entries(err.response.data.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(", ");
        setError(validationErrors);
      } else {
        const errorMsg = err.response?.data?.message || 
                        err.response?.data || 
                        "Error saving booking. Check if Customer ID and Pet ID exist.";
        setError(errorMsg);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      console.log("Booking deleted successfully");
      fetchBookings();
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert(err.response?.data?.message || "Error deleting booking");
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
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        🗓️ Manage Bookings
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Booking
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchBookings}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {bookings.length === 0 ? (
        <Alert severity="info">
          No bookings yet. Click "Add Booking" to create one.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((b) => (
            <Grid item xs={12} sm={6} md={4} key={b.bookingId}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 3,
                  background: "#fffaf0",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Booking #{b.bookingId}
                </Typography>
                <Typography>
                  <b>Date:</b> {b.date}
                </Typography>
                <Typography>
                  <b>Customer:</b> {b.customer?.fullName || "N/A"}
                </Typography>
                <Typography>
                  <b>Pet:</b> {b.pet?.name || "N/A"}
                </Typography>
                <Typography>
                  <b>Service:</b> {b.serviceType}
                </Typography>

                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(b)}
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(b.bookingId)}
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal for Add/Edit */}
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
            {editingBooking ? "Edit Booking" : "Add Booking"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Customer ID"
              name="customerId"
              type="number"
              value={form.customerId}
              onChange={handleChange}
              required
              helperText="Enter an existing customer ID"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Pet ID"
              name="petId"
              type="number"
              value={form.petId}
              onChange={handleChange}
              required
              helperText="Enter an existing pet ID"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Service Type"
              name="serviceType"
              value={form.serviceType}
              onChange={handleChange}
              required
              helperText="e.g., Grooming, Checkup, Washing"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined" onClick={handleClose} fullWidth>
                Cancel
              </Button>
              <Button variant="contained" color="success" type="submit" fullWidth>
                {editingBooking ? "Update" : "Create"} Booking
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}