import React, { useEffect, useState } from "react";
import api from "../api/api";
import {
  Grid,
  Typography,
  Box,
  Button,
  Modal,
  TextField,
  Card,
  CardContent,
  IconButton,
  Alert,
  MenuItem,
  CircularProgress,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Chip
} from "@mui/material";
import { Add, Edit, Delete, ShoppingBag, Search, Clear } from "@mui/icons-material";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("name");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
  });

  const categories = [
    "Cat Food",
    "Dog Food",
    "Fish Food",
    "Bird Food",
    "Equipment",
    "Accessories",
    "Grooming",
    "Health",
    "Toys",
    "Bedding",
    "Furniture",
    "Travel",
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products when search or category changes
  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (categoryFilter !== "All") {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(product => {
        if (searchField === "name") {
          return product.name?.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchField === "description") {
          return product.description?.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
      });
    }

    setFilteredProducts(filtered);
  }, [searchTerm, searchField, categoryFilter, products]);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/products");
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (product = null) => {
    setError("");
    if (product) {
      setEditingProduct(product);
      setForm({
        name: product.name || "",
        category: product.category || "",
        price: product.price?.toString() || "",
        description: product.description || "",
      });
    } else {
      setEditingProduct(null);
      setForm({ name: "", category: "", price: "", description: "" });
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

    if (!form.name || !form.price) {
      setError("Product name and price are required");
      return;
    }

    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Please enter a valid price greater than 0");
      return;
    }

    const payload = {
      name: form.name.trim(),
      category: form.category || "Accessories",
      price: priceNum,
      description: form.description.trim() || ""
    };

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.product_id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      handleClose();
      await fetchProducts();
    } catch (err) {
      if (err.response?.data?.errors) {
        const validationErrors = Object.entries(err.response.data.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(", ");
        setError(validationErrors);
      } else {
        setError(err.response?.data?.message || "Error saving product");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      await fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting product");
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All");
    setFilteredProducts(products);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          🛍️ Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{ bgcolor: "#4CAF50" }}
        >
          Add Product
        </Button>
      </Box>

      {/* Search & Filter Bar */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap", alignItems: "center" }}>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Search By</InputLabel>
          <Select
            value={searchField}
            label="Search By"
            onChange={(e) => setSearchField(e.target.value)}
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="description">Description</MenuItem>
          </Select>
        </FormControl>

        <TextField
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Category"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="All">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {(searchTerm || categoryFilter !== "All") && (
          <Button 
            variant="outlined" 
            startIcon={<Clear />}
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        )}
      </Box>

      {/* Results Count */}
      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
        Showing {filteredProducts.length} of {products.length} products
        {categoryFilter !== "All" && ` in "${categoryFilter}"`}
      </Typography>

      {error && !open && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {filteredProducts.length === 0 ? (
        <Alert severity="info">
          {searchTerm || categoryFilter !== "All" 
            ? "No products match your search/filter." 
            : "No products found. Click 'Add Product' to create one."}
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {filteredProducts.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p.product_id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": { boxShadow: 4 },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <ShoppingBag sx={{ color: "#1976D2", fontSize: 32 }} />
                    <Box>
                      <IconButton size="small" color="primary" onClick={() => handleOpen(p)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(p.product_id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
                    {p.name}
                  </Typography>

                  {p.category && (
                    <Chip
                      label={p.category}
                      size="small"
                      sx={{ mb: 1, bgcolor: "#E3F2FD" }}
                    />
                  )}

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {p.description || "No description"}
                  </Typography>

                  <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
                    {p.price} MAD
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {editingProduct ? "Edit Product" : "Add New Product"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              sx={{ mb: 2 }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Price (MAD)"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
              inputProps={{ step: "0.01", min: "0" }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined" onClick={handleClose} fullWidth>
                Cancel
              </Button>
              <Button variant="contained" type="submit" fullWidth>
                {editingProduct ? "Update" : "Add"} Product
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}