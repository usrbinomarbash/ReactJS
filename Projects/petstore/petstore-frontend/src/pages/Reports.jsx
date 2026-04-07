import React, { useEffect, useState } from "react";
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
  Tabs,
  Tab,
  Chip,
  TableContainer,
  Avatar,
} from "@mui/material";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import PetsIcon from "@mui/icons-material/Pets";
import CategoryIcon from "@mui/icons-material/Category";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

// Color palettes
const COLORS = {
  primary: ["#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e"],
  warm: ["#f59e0b", "#f97316", "#ef4444", "#dc2626", "#b91c1c", "#991b1b"],
  cool: ["#06b6d4", "#0891b2", "#0e7490", "#155e75", "#164e63", "#134e4a"],
  earth: ["#84cc16", "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9"],
  gradient: ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe", "#00f2fe"],
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 1.5, bgcolor: "rgba(30, 30, 46, 0.95)", border: "1px solid rgba(99, 102, 241, 0.3)", borderRadius: 2 }}>
        <Typography sx={{ color: "#e2e8f0", fontWeight: 600, fontSize: "0.85rem" }}>{label}</Typography>
        {payload.map((entry, index) => (
          <Typography key={index} sx={{ color: entry.color, fontSize: "0.8rem", mt: 0.5 }}>
            {entry.name}: {entry.value}
          </Typography>
        ))}
      </Paper>
    );
  }
  return null;
};

// Section Header
const SectionHeader = ({ icon, title, subtitle, color = "#6366f1" }) => (
  <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
    <Avatar sx={{ bgcolor: `${color}20`, color: color, width: 48, height: 48 }}>{icon}</Avatar>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e1e2e" }}>{title}</Typography>
      <Typography variant="body2" sx={{ color: "#64748b" }}>{subtitle}</Typography>
    </Box>
  </Box>
);

// Stat Card
const StatCard = ({ title, value, icon, color }) => (
  <Paper sx={{ p: 3, borderRadius: 3, background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`, border: `1px solid ${color}30`, position: "relative", overflow: "hidden" }}>
    <Box sx={{ position: "absolute", top: -20, right: -20, opacity: 0.1, transform: "rotate(15deg)" }}>
      {React.cloneElement(icon, { sx: { fontSize: 100, color } })}
    </Box>
    <Typography variant="body2" sx={{ color: "#64748b", mb: 1 }}>{title}</Typography>
    <Typography variant="h3" sx={{ fontWeight: 800, color }}>{value}</Typography>
  </Paper>
);

// Empty State
const EmptyState = ({ message }) => (
  <Box sx={{ py: 6, textAlign: "center", color: "#94a3b8" }}>
    <Typography>{message}</Typography>
    <Typography variant="body2" sx={{ mt: 1 }}>Make sure the backend endpoint is configured</Typography>
  </Box>
);

const tableHeaderStyle = { fontWeight: 700, bgcolor: "#f8fafc", color: "#475569", borderBottom: "2px solid #e2e8f0" };

const getSpeciesColor = (species) => {
  const colors = { Dog: "#f59e0b", Cat: "#8b5cf6", Bird: "#10b981", Fish: "#06b6d4", Rabbit: "#ec4899", Hamster: "#f43f5e" };
  return colors[species] || "#6366f1";
};

const getSpeciesDistribution = (pets) => {
  return pets.reduce((acc, pet) => {
    const species = pet.species || "Unknown";
    const existing = acc.find((item) => item.name === species);
    if (existing) existing.value++;
    else acc.push({ name: species, value: 1 });
    return acc;
  }, []);
};

export default function Reports() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [petsWithOwners, setPetsWithOwners] = useState([]);
  const [petsPerCustomer, setPetsPerCustomer] = useState([]);
  const [productCatalog, setProductCatalog] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [productsPerCategory, setProductsPerCategory] = useState([]);
  const [productsPerVendor, setProductsPerVendor] = useState([]);
  const [ordersPerCustomer, setOrdersPerCustomer] = useState([]);
  const [pricePerCustomer, setPricePerCustomer] = useState([]);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);

  useEffect(() => {
    fetchAllReportData();
  }, []);

  const fetchAllReportData = async () => {
    setLoading(true);
    setError("");
    try {
      const [petsOwnersRes, petsCountRes, catalogRes, topProductsRes, categoryCountRes, vendorCountRes, orderCountRes, pricePerCustRes, bookingDetailsRes, monthlyRes, dailyRes] = await Promise.all([
        api.get("/reports/pets-with-owners").catch(() => ({ data: [] })),
        api.get("/reports/pets-per-customer").catch(() => ({ data: [] })),
        api.get("/reports/product-catalog").catch(() => ({ data: [] })),
        api.get("/reports/top-selling-products?limit=10").catch(() => ({ data: [] })),
        api.get("/reports/products-per-category").catch(() => ({ data: [] })),
        api.get("/reports/products-per-vendor").catch(() => ({ data: [] })),
        api.get("/reports/orders-per-customer").catch(() => ({ data: [] })),
        api.get("/reports/price-per-customer").catch(() => ({ data: [] })),
        api.get("/reports/booking-details").catch(() => ({ data: [] })),
        api.get("/reports/revenue/monthly").catch(() => ({ data: [] })),
        api.get("/reports/revenue/daily").catch(() => ({ data: [] })),
      ]);

      setPetsWithOwners(petsOwnersRes.data);
      setPetsPerCustomer(petsCountRes.data);
      setProductCatalog(catalogRes.data);
      setTopSellingProducts(topProductsRes.data);
      setProductsPerCategory(categoryCountRes.data);
      setProductsPerVendor(vendorCountRes.data);
      setOrdersPerCustomer(orderCountRes.data);
      const priceData = pricePerCustRes.data;
      setPricePerCustomer(priceData);
      setBookingDetails(bookingDetailsRes.data);
      setMonthlyRevenue(monthlyRes.data);
      setDailyRevenue(dailyRes.data);
    } catch (err) {
      console.error("Error fetching report data:", err);
      setError("Failed to load some report data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", flexDirection: "column", gap: 2 }}>
        <CircularProgress size={50} sx={{ color: "#6366f1" }} />
        <Typography sx={{ color: "#64748b" }}>Loading reports...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", mb: 1 }}>
          <Typewriter text="📊 Analytics & Reports" />
        </Typography>
        <Typography variant="body1" sx={{ color: "#64748b" }}>Insights from JOIN queries showing table relationships</Typography>
      </Box>

      {error && <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {/* Summary Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}><StatCard title="Pets Registered" value={petsWithOwners.length} icon={<PetsIcon />} color="#6366f1" /></Grid>
        <Grid item xs={6} md={3}><StatCard title="Product Categories" value={productsPerCategory.length} icon={<CategoryIcon />} color="#f59e0b" /></Grid>
        <Grid item xs={6} md={3}><StatCard title="Active Vendors" value={productsPerVendor.length} icon={<LocalShippingIcon />} color="#10b981" /></Grid>
        <Grid item xs={6} md={3}><StatCard title="Total Bookings" value={bookingDetails.length} icon={<EventIcon />} color="#ec4899" /></Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 4, borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} variant="scrollable" scrollButtons="auto"
          sx={{ bgcolor: "#fff", "& .MuiTab-root": { textTransform: "none", fontWeight: 600, py: 2 }, "& .Mui-selected": { color: "#6366f1 !important" }, "& .MuiTabs-indicator": { bgcolor: "#6366f1", height: 3 } }}>
          <Tab icon={<PetsIcon />} iconPosition="start" label="Pets & Owners" />
          <Tab icon={<CategoryIcon />} iconPosition="start" label="Products & Categories" />
          <Tab icon={<ShoppingCartIcon />} iconPosition="start" label="Sales & Orders" />
          <Tab icon={<EventIcon />} iconPosition="start" label="Bookings" />
          <Tab icon={<AttachMoneyIcon />} iconPosition="start" label="Revenue" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && <PetsOwnersTab petsWithOwners={petsWithOwners} petsPerCustomer={petsPerCustomer} />}
      {activeTab === 1 && <ProductsCategoriesTab productCatalog={productCatalog} productsPerCategory={productsPerCategory} productsPerVendor={productsPerVendor} />}
      {activeTab === 2 && <SalesOrdersTab topSellingProducts={topSellingProducts} ordersPerCustomer={ordersPerCustomer} pricePerCustomer={pricePerCustomer} />}
      {activeTab === 3 && <BookingsTab bookingDetails={bookingDetails} />}
      {activeTab === 4 && <RevenueTab monthlyRevenue={monthlyRevenue} dailyRevenue={dailyRevenue} />}
    </Box>
  );
}

// ========== TAB COMPONENTS ==========

function PetsOwnersTab({ petsWithOwners, petsPerCustomer }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
          <SectionHeader icon={<PeopleIcon />} title="Pets per Customer" subtitle="Customer → Pets (LEFT JOIN + COUNT)" color="#8b5cf6" />
          {petsPerCustomer.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={petsPerCustomer.slice(0, 10)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis type="category" dataKey="customerName" width={120} stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="petCount" name="Pets" radius={[0, 8, 8, 0]}>
                  {petsPerCustomer.slice(0, 10).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.primary[index % COLORS.primary.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyState message="No pet ownership data" />}
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
          <SectionHeader icon={<PetsIcon />} title="Species Distribution" subtitle="Breakdown of pet types" color="#6366f1" />
          {petsWithOwners.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={getSpeciesDistribution(petsWithOwners)} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {getSpeciesDistribution(petsWithOwners).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.gradient[index % COLORS.gradient.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <EmptyState message="No species data" />}
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <SectionHeader icon={<PetsIcon />} title="Pets with Owners" subtitle="Pet → Customer (INNER JOIN)" color="#10b981" />
          {petsWithOwners.length > 0 ? (
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={tableHeaderStyle}>Pet ID</TableCell>
                    <TableCell sx={tableHeaderStyle}>Pet Name</TableCell>
                    <TableCell sx={tableHeaderStyle}>Species</TableCell>
                    <TableCell sx={tableHeaderStyle}>Breed</TableCell>
                    <TableCell sx={tableHeaderStyle}>Owner Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {petsWithOwners.map((pet, index) => (
                    <TableRow key={index} sx={{ "&:hover": { bgcolor: "#f1f5f9" } }}>
                      <TableCell>{pet.petId}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{pet.name}</TableCell>
                      <TableCell>
                        <Chip label={pet.species} size="small" sx={{ bgcolor: getSpeciesColor(pet.species) + "20", color: getSpeciesColor(pet.species), fontWeight: 600 }} />
                      </TableCell>
                      <TableCell>{pet.breed || "—"}</TableCell>
                      <TableCell>{pet.ownerName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : <EmptyState message="No pets with owners data" />}
        </Paper>
      </Grid>
    </Grid>
  );
}

function ProductsCategoriesTab({ productCatalog, productsPerCategory, productsPerVendor }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
          <SectionHeader icon={<CategoryIcon />} title="Products per Category" subtitle="Category → Products (LEFT JOIN + COUNT)" color="#f59e0b" />
          {productsPerCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={productsPerCategory} cx="50%" cy="50%" outerRadius={100} dataKey="productCount" nameKey="categoryName" label={(entry) => entry.categoryName}>
                  {productsPerCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.warm[index % COLORS.warm.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : <EmptyState message="No category data" />}
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
          <SectionHeader icon={<LocalShippingIcon />} title="Products per Vendor" subtitle="Vendor → Products (LEFT JOIN + COUNT)" color="#10b981" />
          {productsPerVendor.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productsPerVendor}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="vendorName" stroke="#64748b" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="productCount" name="Products" radius={[8, 8, 0, 0]}>
                  {productsPerVendor.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.earth[index % COLORS.earth.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyState message="No vendor data" />}
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <SectionHeader icon={<ShoppingCartIcon />} title="Product Catalog" subtitle="Product → Category, Vendor (LEFT JOINs)" color="#6366f1" />
          {productCatalog.length > 0 ? (
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={tableHeaderStyle}>ID</TableCell>
                    <TableCell sx={tableHeaderStyle}>Product Name</TableCell>
                    <TableCell sx={tableHeaderStyle}>Price</TableCell>
                    <TableCell sx={tableHeaderStyle}>Stock</TableCell>
                    <TableCell sx={tableHeaderStyle}>Category</TableCell>
                    <TableCell sx={tableHeaderStyle}>Vendor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productCatalog.map((product, index) => (
                    <TableRow key={index} sx={{ "&:hover": { bgcolor: "#f1f5f9" } }}>
                      <TableCell>{product.productId}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{product.name}</TableCell>
                      <TableCell><Typography sx={{ color: "#10b981", fontWeight: 700 }}>{product.price} MAD</Typography></TableCell>
                      <TableCell>
                        <Chip label={product.stockQuantity} size="small" sx={{ bgcolor: product.stockQuantity < 10 ? "#fee2e2" : "#d1fae5", color: product.stockQuantity < 10 ? "#dc2626" : "#059669", fontWeight: 600 }} />
                      </TableCell>
                      <TableCell>{product.categoryName || "—"}</TableCell>
                      <TableCell>{product.vendorName || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : <EmptyState message="No product catalog data" />}
        </Paper>
      </Grid>
    </Grid>
  );
}

function SalesOrdersTab({ topSellingProducts, ordersPerCustomer, pricePerCustomer }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
          <SectionHeader icon={<TrendingUpIcon />} title="Top Selling Products" subtitle="Product → OrderItem (INNER JOIN + SUM)" color="#ec4899" />
          {topSellingProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={topSellingProducts}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="totalQuantity" name="Units Sold" stroke="#ec4899" fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : <EmptyState message="No sales data" />}
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
          <SectionHeader icon={<PeopleIcon />} title="Orders per Customer" subtitle="Customer → Orders (LEFT JOIN + COUNT)" color="#6366f1" />
          {ordersPerCustomer.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersPerCustomer.slice(0, 10)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis type="category" dataKey="customerName" width={120} stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="orderCount" name="Orders" radius={[0, 8, 8, 0]}>
                  {ordersPerCustomer.slice(0, 10).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.cool[index % COLORS.cool.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyState message="No order data" />}
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <SectionHeader icon={<ShoppingCartIcon />} title="Customer Order Summary" subtitle="Full customer order statistics" color="#8b5cf6" />
          {ordersPerCustomer.length > 0 ? (
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={tableHeaderStyle}>Rank</TableCell>
                    <TableCell sx={tableHeaderStyle}>Customer Name</TableCell>
                    <TableCell sx={tableHeaderStyle}>Total Orders</TableCell>
                    <TableCell sx={tableHeaderStyle}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ordersPerCustomer.map((customer, index) => (
                    <TableRow key={index} sx={{ "&:hover": { bgcolor: "#f1f5f9" } }}>
                      <TableCell>
                        <Avatar sx={{ width: 28, height: 28, fontSize: "0.8rem", bgcolor: index < 3 ? ["#fbbf24", "#94a3b8", "#cd7c32"][index] : "#e2e8f0", color: index < 3 ? "#fff" : "#64748b" }}>
                          {index + 1}
                        </Avatar>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{customer.customerName}</TableCell>
                      <TableCell><Typography sx={{ fontWeight: 700, color: "#6366f1" }}>{customer.orderCount}</Typography></TableCell>
                      <TableCell>
                        <Chip label={customer.orderCount >= 5 ? "VIP" : customer.orderCount >= 2 ? "Regular" : "New"} size="small"
                          sx={{ bgcolor: customer.orderCount >= 5 ? "#fef3c7" : customer.orderCount >= 2 ? "#dbeafe" : "#f3e8ff", color: customer.orderCount >= 5 ? "#d97706" : customer.orderCount >= 2 ? "#2563eb" : "#9333ea", fontWeight: 600 }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : <EmptyState message="No customer order data" />}
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
          <SectionHeader icon={<AttachMoneyIcon />} title="Price per Customer (Total Spent)" subtitle="Customer → Orders (LEFT JOIN + SUM)" color="#f59e0b" />
          {pricePerCustomer.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pricePerCustomer.slice(0, 10)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" tickFormatter={(v) => `${v} MAD`} />
                <YAxis type="category" dataKey="customerName" width={130} stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} formatter={(v) => [`${v} MAD`, "Total Spent"]} />
                <Bar dataKey="totalSpent" name="Total Spent" radius={[0, 8, 8, 0]}>
                  {pricePerCustomer.slice(0, 10).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.warm[index % COLORS.warm.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyState message="No spending data" />}
        </Paper>
      </Grid>
    </Grid>
  );
}

function RevenueTab({ monthlyRevenue, dailyRevenue }) {
  const totalRevenue = monthlyRevenue.reduce((s, m) => s + Number(m.revenue || 0), 0);
  const totalOrders = monthlyRevenue.reduce((s, m) => s + Number(m.order_count || 0), 0);
  const latestAvg = monthlyRevenue[0]?.avg_order_value ?? 0;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={7}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <SectionHeader icon={<TrendingUpIcon />} title="Monthly Revenue" subtitle="Total revenue per month" color="#10b981" />
          {monthlyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={[...monthlyRevenue].reverse()}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tickFormatter={(v) => `${v} MAD`} />
                <Tooltip content={<CustomTooltip />} formatter={(v) => [`${v} MAD`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : <EmptyState message="No monthly revenue data" />}
        </Paper>
      </Grid>

      <Grid item xs={12} md={5}>
        <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
          <SectionHeader icon={<AttachMoneyIcon />} title="Revenue Summary" subtitle="Key financial metrics" color="#f59e0b" />
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#f0fdf4", borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#10b981" }}>
                  {totalRevenue.toFixed(0)} MAD
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>Total Revenue</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#fef3c7", borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#f59e0b" }}>
                  {totalOrders}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>Total Orders</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#ede9fe", borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#8b5cf6" }}>
                  {Number(latestAvg).toFixed(2)} MAD
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>Avg Order Value (Latest Month)</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <SectionHeader icon={<TrendingUpIcon />} title="Daily Revenue" subtitle="Revenue per day (current month)" color="#6366f1" />
          {dailyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={[...dailyRevenue].reverse()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={70} />
                <YAxis stroke="#64748b" tickFormatter={(v) => `${v} MAD`} />
                <Tooltip content={<CustomTooltip />} formatter={(v) => [`${v} MAD`, "Revenue"]} />
                <Bar dataKey="revenue" name="Revenue" radius={[6, 6, 0, 0]}>
                  {[...dailyRevenue].reverse().map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.earth[index % COLORS.earth.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyState message="No daily revenue data for current month" />}
        </Paper>
      </Grid>
    </Grid>
  );
}

function BookingsTab({ bookingDetails }) {
  const bookingsByService = bookingDetails.reduce((acc, booking) => {
    const service = booking.serviceName || "Unknown";
    const existing = acc.find((item) => item.name === service);
    if (existing) existing.count++;
    else acc.push({ name: service, count: 1 });
    return acc;
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
          <SectionHeader icon={<EventIcon />} title="Bookings by Service" subtitle="Service distribution" color="#ec4899" />
          {bookingsByService.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={bookingsByService} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={5} dataKey="count">
                  {bookingsByService.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.primary[index % COLORS.primary.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <EmptyState message="No booking service data" />}
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
          <SectionHeader icon={<TrendingUpIcon />} title="Booking Statistics" subtitle="Quick overview" color="#10b981" />
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#f0fdf4", borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#10b981" }}>{bookingDetails.length}</Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>Total Bookings</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#fef3c7", borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#f59e0b" }}>{bookingsByService.length}</Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>Service Types</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#ede9fe", borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#8b5cf6" }}>{new Set(bookingDetails.map((b) => b.customerName)).size}</Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>Unique Customers</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#fce7f3", borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#ec4899" }}>{new Set(bookingDetails.map((b) => b.petName)).size}</Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>Pets Served</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <SectionHeader icon={<EventIcon />} title="Booking Details" subtitle="Booking → Customer, Pet, Service, Employee (Multiple JOINs)" color="#6366f1" />
          {bookingDetails.length > 0 ? (
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={tableHeaderStyle}>ID</TableCell>
                    <TableCell sx={tableHeaderStyle}>Date</TableCell>
                    <TableCell sx={tableHeaderStyle}>Customer</TableCell>
                    <TableCell sx={tableHeaderStyle}>Pet</TableCell>
                    <TableCell sx={tableHeaderStyle}>Service</TableCell>
                    <TableCell sx={tableHeaderStyle}>Employee</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookingDetails.map((booking, index) => (
                    <TableRow key={index} sx={{ "&:hover": { bgcolor: "#f1f5f9" } }}>
                      <TableCell>{booking.bookingId}</TableCell>
                      <TableCell><Chip label={booking.date} size="small" sx={{ bgcolor: "#e0e7ff", color: "#4f46e5", fontWeight: 600 }} /></TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{booking.customerName}</TableCell>
                      <TableCell>{booking.petName}</TableCell>
                      <TableCell><Chip label={booking.serviceName || "—"} size="small" sx={{ bgcolor: "#fef3c7", color: "#d97706" }} /></TableCell>
                      <TableCell>{booking.employeeName || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : <EmptyState message="No booking details" />}
        </Paper>
      </Grid>
    </Grid>
  );
}