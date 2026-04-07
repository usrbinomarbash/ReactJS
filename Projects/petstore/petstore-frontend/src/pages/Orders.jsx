import { useEffect, useState } from "react";
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
  Chip,
  MenuItem,
} from "@mui/material";
import { Add, Edit, Delete, Search, ShoppingCart } from "@mui/icons-material";
import Typewriter from "../components/Typewriter";

const PAYMENT_METHODS = ["Cash", "Credit Card", "Debit Card", "Bank Transfer", "Online"];

function getPaymentChipColor(method) {
  if (!method) return "default";
  if (method === "Cash") return "success";
  if (method.includes("Card")) return "info";
  return "default";
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    customerId: "",
    employeeId: "",
    paymentMethod: "Cash",
    total: "",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFiltered(orders);
      return;
    }
    const q = searchTerm.toLowerCase();
    setFiltered(
      orders.filter(
        (o) =>
          String(o.customerId).includes(q) ||
          (o.paymentMethod || "").toLowerCase().includes(q) ||
          String(o.orderId).includes(q)
      )
    );
  }, [searchTerm, orders]);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
      setFiltered(res.data);
    } catch (err) {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (order = null) => {
    setError("");
    if (order) {
      setEditing(order);
      setForm({
        customerId: order.customerId || "",
        employeeId: order.employeeId || "",
        paymentMethod: order.paymentMethod || "Cash",
        total: order.total || "",
      });
    } else {
      setEditing(null);
      setForm({ customerId: "", employeeId: "", paymentMethod: "Cash", total: "" });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError("");
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      customerId: Number(form.customerId),
      employeeId: form.employeeId ? Number(form.employeeId) : null,
      paymentMethod: form.paymentMethod,
      total: form.total ? parseFloat(form.total) : null,
    };
    try {
      if (editing) {
        await api.put(`/orders/${editing.orderId}`, payload);
      } else {
        await api.post("/orders", payload);
      }
      fetchOrders();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "Error saving order.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await api.delete(`/orders/${id}`);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting order.");
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
        <ShoppingCart fontSize="large" sx={{ color: "#0288d1" }} />
        <Typewriter text="Orders" />
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
        <TextField
          placeholder="Search by order ID, customer ID, or payment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ flexGrow: 1, maxWidth: 420 }}
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
          sx={{ ml: "auto", backgroundColor: "#0288d1", "&:hover": { backgroundColor: "#0277bd" } }}
        >
          Add Order
        </Button>
      </Box>

      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
        Showing {filtered.length} of {orders.length} orders
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {filtered.length === 0 ? (
        <Alert severity="info">
          {searchTerm ? "No orders match your search." : "No orders found. Click 'Add Order' to create one."}
        </Alert>
      ) : (
        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#0288d1" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Order ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Customer ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Employee ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Payment Method</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Total</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Created At</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((o) => (
                <TableRow key={o.orderId} hover>
                  <TableCell sx={{ fontWeight: 600 }}>#{o.orderId}</TableCell>
                  <TableCell>{o.customerId || "N/A"}</TableCell>
                  <TableCell>{o.employeeId || "—"}</TableCell>
                  <TableCell>
                    <Chip
                      label={o.paymentMethod || "N/A"}
                      color={getPaymentChipColor(o.paymentMethod)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: "#10b981", fontWeight: 700 }}>
                      {o.total != null ? `${o.total} MAD` : "—"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpen(o)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(o.orderId)}>
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
            width: 440,
            mx: "auto",
            mt: "8%",
            boxShadow: 5,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {editing ? "Edit Order" : "Add Order"}
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Customer ID" name="customerId" type="number"
              value={form.customerId} onChange={handleChange} required sx={{ mb: 2 }}
              helperText="Enter an existing customer ID"
            />
            <TextField
              fullWidth label="Employee ID" name="employeeId" type="number"
              value={form.employeeId} onChange={handleChange} sx={{ mb: 2 }}
              helperText="Optional — leave blank if unassigned"
            />
            <TextField
              fullWidth select label="Payment Method" name="paymentMethod"
              value={form.paymentMethod} onChange={handleChange} sx={{ mb: 2 }}
            >
              {PAYMENT_METHODS.map((m) => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth label="Total (MAD)" name="total" type="number"
              value={form.total} onChange={handleChange} sx={{ mb: 3 }}
              inputProps={{ step: "0.01", min: "0" }}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined" onClick={handleClose} fullWidth>Cancel</Button>
              <Button
                variant="contained" type="submit" fullWidth
                sx={{ backgroundColor: "#0288d1", "&:hover": { backgroundColor: "#0277bd" } }}
              >
                {editing ? "Update Order" : "Create Order"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}
