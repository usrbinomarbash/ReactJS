import React, { useEffect, useState } from "react";
import Typewriter from "../components/Typewriter";
import api from "../api/api";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Paper
} from "@mui/material";
import {
  People,
  Pets,
  ShoppingBag,
  CalendarMonth,
  AttachMoney,
  Warning,
  TrendingUp,
  Inventory
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    customers: 0,
    pets: 0,
    products: 0,
    bookings: 0,
    orders: 0,
    revenue: 0,
    lowStockCount: 0
  });
  const [petsPerCustomer, setPetsPerCustomer] = useState([]);
  const [productsPerCategory, setProductsPerCategory] = useState([]);
  const [ordersPerCustomer, setOrdersPerCustomer] = useState([]);
  const [pricePerCustomer, setPricePerCustomer] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch counts
      const [customersRes, petsRes, productsRes, bookingsRes, ordersRes] = await Promise.all([
        api.get("/customers"),
        api.get("/pets"),
        api.get("/products"),
        api.get("/bookings"),
        api.get("/orders")
      ]);

      // Calculate revenue
      const totalRevenue = ordersRes.data.reduce((sum, order) => sum + (order.total || 0), 0);

      // Count low stock
      const lowStock = productsRes.data.filter(p => p.stockQuantity !== null && p.stockQuantity < 10);

      setStats({
        customers: customersRes.data.length,
        pets: petsRes.data.length,
        products: productsRes.data.length,
        bookings: bookingsRes.data.length,
        orders: ordersRes.data.length,
        revenue: totalRevenue,
        lowStockCount: lowStock.length
      });

      setLowStockProducts(lowStock.slice(0, 5));

      // Fetch report data
      try {
        const [petsPerCustRes, prodsPerCatRes, ordersPerCustRes, pricePerCustRes] = await Promise.all([
          api.get("/reports/pets-per-customer"),
          api.get("/reports/products-per-category"),
          api.get("/reports/orders-per-customer"),
          api.get("/reports/price-per-customer")
        ]);
        setPetsPerCustomer(petsPerCustRes.data.slice(0, 6));
        setProductsPerCategory(prodsPerCatRes.data);
        setOrdersPerCustomer(ordersPerCustRes.data.slice(0, 6));
        setPricePerCustomer(pricePerCustRes.data.slice(0, 6));
      } catch (e) {
        console.log("Reports not available:", e);
      }

    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: "100%", borderLeft: `4px solid ${color}` }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography color="textSecondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold", color }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ 
            backgroundColor: `${color}20`, 
            borderRadius: 2, 
            p: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {React.cloneElement(icon, { sx: { fontSize: 32, color } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        <Typewriter text="📊 Dashboard" />
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Customers"
            value={stats.customers}
            icon={<People />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Pets"
            value={stats.pets}
            icon={<Pets />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={stats.products}
            icon={<ShoppingBag />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Bookings"
            value={stats.bookings}
            icon={<CalendarMonth />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={stats.orders}
            icon={<TrendingUp />}
            color="#0288d1"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`${stats.revenue.toFixed(2)} MAD`}
            icon={<AttachMoney />}
            color="#388e3c"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Low Stock Items"
            value={stats.lowStockCount}
            icon={<Warning />}
            color={stats.lowStockCount > 0 ? "#d32f2f" : "#388e3c"}
            subtitle={stats.lowStockCount > 0 ? "Needs attention!" : "All good"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Pets/Customer"
            value={stats.customers > 0 ? (stats.pets / stats.customers).toFixed(1) : 0}
            icon={<Inventory />}
            color="#7b1fa2"
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Pets per Customer */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              🐾 Pets per Customer
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={petsPerCustomer}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="customerName" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="petCount" fill="#8884d8" name="Pets" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Products per Category */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              📦 Products per Category
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productsPerCategory}
                  dataKey="productCount"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ categoryName, productCount }) => `${categoryName}: ${productCount}`}
                >
                  {productsPerCategory.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Price per Customer */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              💰 Price per Customer (Total Spent)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pricePerCustomer}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="customerName" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} MAD`, "Total Spent"]} />
                <Bar dataKey="totalSpent" fill="#FF8042" name="Total Spent" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Orders Chart & Low Stock */}
      <Grid container spacing={3}>
        {/* Orders per Customer */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              🛒 Orders per Customer
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersPerCustomer}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="customerName" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orderCount" fill="#00C49F" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Low Stock Alert */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#d32f2f" }}>
              ⚠️ Low Stock Alert
            </Typography>
            {lowStockProducts.length === 0 ? (
              <Alert severity="success">All products are well stocked!</Alert>
            ) : (
              <Box>
                {lowStockProducts.map((product, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      p: 1.5,
                      mb: 1,
                      borderRadius: 1,
                      bgcolor: product.stockQuantity === 0 ? "#ffebee" : "#fff3e0"
                    }}
                  >
                    <Typography variant="body2">{product.name}</Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "bold",
                        color: product.stockQuantity === 0 ? "#d32f2f" : "#ed6c02"
                      }}
                    >
                      {product.stockQuantity === 0 ? "OUT OF STOCK" : `${product.stockQuantity} left`}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}