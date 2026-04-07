import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Avatar,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PeopleIcon from "@mui/icons-material/People";
import PetsIcon from "@mui/icons-material/Pets";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [pets, setPets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const [customerRes, petsRes, ordersRes, bookingsRes] = await Promise.all([
          api.get(`/customers/${id}`),
          api.get("/pets"),
          api.get(`/orders/customer/${id}`).catch(() => ({ data: [] })),
          api.get("/bookings").catch(() => ({ data: [] })),
        ]);
        setCustomer(customerRes.data);
        setPets(petsRes.data.filter((p) => String(p.customerId) === String(id)));
        setOrders(ordersRes.data);
        setBookings(
          bookingsRes.data.filter(
            (b) => String(b.customer?.customerId) === String(id)
          )
        );
      } catch (err) {
        setError("Failed to load customer details.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: "2rem" }}>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/customers")} sx={{ mt: 2 }}>
          Back to Customers
        </Button>
      </Box>
    );
  }

  const initials = customer?.fullName
    ? customer.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <Box sx={{ padding: "2rem" }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/customers")}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Back to Customers
      </Button>

      {/* Profile Card */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3, display: "flex", alignItems: "center", gap: 3 }}>
        <Avatar sx={{ width: 72, height: 72, fontSize: "1.8rem", bgcolor: "#9C27B0" }}>
          {initials}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            {customer?.fullName || "Unknown"}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {customer?.email && (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {customer.email}
              </Typography>
            )}
            {customer?.phone && (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {customer.phone}
              </Typography>
            )}
            {customer?.address && (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {customer.address}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2, bgcolor: "#fce7f3", minWidth: 80 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#FF9800" }}>{pets.length}</Typography>
            <Typography variant="caption" sx={{ color: "#64748b" }}>Pets</Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2, bgcolor: "#e0f2fe", minWidth: 80 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0288d1" }}>{orders.length}</Typography>
            <Typography variant="caption" sx={{ color: "#64748b" }}>Orders</Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2, bgcolor: "#e8f5e9", minWidth: 80 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#4ABDAC" }}>{bookings.length}</Typography>
            <Typography variant="caption" sx={{ color: "#64748b" }}>Bookings</Typography>
          </Paper>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Pets */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Avatar sx={{ bgcolor: "#FF980020", color: "#FF9800", width: 40, height: 40 }}>
                <PetsIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Pets</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {pets.length === 0 ? (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>No pets registered.</Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#FF9800" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Species</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Breed</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pets.map((p) => (
                    <TableRow key={p.petId} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{p.name}</TableCell>
                      <TableCell>{p.species}</TableCell>
                      <TableCell>{p.breed || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Grid>

        {/* Orders */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Avatar sx={{ bgcolor: "#0288d120", color: "#0288d1", width: 40, height: 40 }}>
                <ShoppingCartIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Order History</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {orders.length === 0 ? (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>No orders found.</Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#0288d1" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Order ID</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Total</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Payment</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o.orderId} hover>
                      <TableCell>#{o.orderId}</TableCell>
                      <TableCell>
                        <Typography sx={{ color: "#10b981", fontWeight: 700 }}>
                          {o.total != null ? `${o.total} MAD` : "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={o.paymentMethod || "N/A"} size="small" color="info" />
                      </TableCell>
                      <TableCell>
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Grid>

        {/* Bookings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Avatar sx={{ bgcolor: "#4ABDAC20", color: "#4ABDAC", width: 40, height: 40 }}>
                <CalendarMonthIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Bookings</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {bookings.length === 0 ? (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>No bookings found.</Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#4ABDAC" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Booking ID</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Pet</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Service</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((b) => (
                    <TableRow key={b.bookingId} hover>
                      <TableCell>#{b.bookingId}</TableCell>
                      <TableCell>
                        <Chip label={b.date || "—"} size="small" sx={{ bgcolor: "#e0e7ff", color: "#4f46e5" }} />
                      </TableCell>
                      <TableCell>{b.pet?.name || "—"}</TableCell>
                      <TableCell>
                        <Chip label={b.serviceType || "—"} size="small" sx={{ bgcolor: "#fef3c7", color: "#d97706" }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
