import React, { useEffect, useState, useRef } from "react";
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
  CardMedia,
  IconButton,
  Alert,
  MenuItem,
  CircularProgress,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  ShoppingBag,
  Search,
  Clear,
  CloudUpload,
  Image as ImageIcon,
} from "@mui/icons-material";

// ─── Placeholder shown when a product has no image ───────────────────────────
const PLACEHOLDER = "https://placehold.co/400x220/e3f2fd/1976d2?text=No+Image";

export default function Products() {
  const [products, setProducts]               = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [open, setOpen]                       = useState(false);
  const [editingProduct, setEditingProduct]   = useState(null);
  const [error, setError]                     = useState("");
  const [loading, setLoading]                 = useState(true);

  // Search / filter
  const [searchTerm, setSearchTerm]     = useState("");
  const [searchField, setSearchField]   = useState("name");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Image upload state
  const [selectedFile, setSelectedFile]   = useState(null);   // File object
  const [previewUrl, setPreviewUrl]       = useState("");      // local blob URL
  const [uploading, setUploading]         = useState(false);   // spinner during upload
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name:        "",
    category:    "",
    price:       "",
    description: "",
    imageUrl:    "",   // NEW
  });

  const categories = [
    "Cat Food", "Dog Food", "Fish Food", "Bird Food",
    "Equipment", "Accessories", "Grooming", "Health",
    "Toys", "Bedding", "Furniture", "Travel",
  ];

  useEffect(() => { fetchProducts(); }, []);

  // Re-filter whenever search/filter/products change
  useEffect(() => {
    let filtered = [...products];
    if (categoryFilter !== "All") {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }
    if (searchTerm.trim()) {
      filtered = filtered.filter(product => {
        if (searchField === "name")
          return product.name?.toLowerCase().includes(searchTerm.toLowerCase());
        if (searchField === "description")
          return product.description?.toLowerCase().includes(searchTerm.toLowerCase());
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

  // ─── Modal open/close ──────────────────────────────────────────────────────

  const handleOpen = (product = null) => {
    setError("");
    setSelectedFile(null);
    setPreviewUrl("");
    setUploadProgress(0);

    if (product) {
      setEditingProduct(product);
      setForm({
        name:        product.name        || "",
        category:    product.category    || "",
        price:       product.price?.toString() || "",
        description: product.description || "",
        imageUrl:    product.imageUrl    || "",
      });
      setPreviewUrl(product.imageUrl || "");
    } else {
      setEditingProduct(null);
      setForm({ name: "", category: "", price: "", description: "", imageUrl: "" });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError("");
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);  // free memory
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ─── Image selection (local preview before upload) ─────────────────────────

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side type check
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Only JPEG, PNG, GIF, or WebP images are allowed.");
      return;
    }

    // Client-side size check (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }

    setError("");
    setSelectedFile(file);

    // Show a local preview immediately (no upload yet)
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // ─── Upload to backend, then save product ─────────────────────────────────

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

    try {
      // Step 1: upload the image if one was picked
      let imageUrl = form.imageUrl;
      if (selectedFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(pct);
          },
        });
        imageUrl = uploadRes.data.url;
        setUploading(false);
      }

      // Step 2: save / update the product (imageUrl included in payload)
      const payload = {
        name:        form.name.trim(),
        category:    form.category || "Accessories",
        price:       priceNum,
        description: form.description.trim() || "",
        imageUrl:    imageUrl || null,
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct.product_id}`, payload);
      } else {
        await api.post("/products", payload);
      }

      handleClose();
      await fetchProducts();

    } catch (err) {
      setUploading(false);
      if (err.response?.data?.errors) {
        const msgs = Object.entries(err.response.data.errors)
          .map(([f, m]) => `${f}: ${m}`)
          .join(", ");
        setError(msgs);
      } else {
        setError(err.response?.data?.error || err.response?.data?.message || "Error saving product");
      }
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────────────

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

  // ─── Render ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
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
          <Select value={searchField} label="Search By" onChange={(e) => setSearchField(e.target.value)}>
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
              <InputAdornment position="start"><Search /></InputAdornment>
            ),
          }}
        />

        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Category</InputLabel>
          <Select value={categoryFilter} label="Category" onChange={(e) => setCategoryFilter(e.target.value)}>
            <MenuItem value="All">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {(searchTerm || categoryFilter !== "All") && (
          <Button variant="outlined" startIcon={<Clear />} onClick={handleClearFilters}>
            Clear Filters
          </Button>
        )}
      </Box>

      {/* Count */}
      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
        Showing {filteredProducts.length} of {products.length} products
        {categoryFilter !== "All" && ` in "${categoryFilter}"`}
      </Typography>

      {error && !open && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>
      )}

      {/* Product grid */}
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
                {/* Product image */}
                <CardMedia
                  component="img"
                  height="180"
                  image={p.imageUrl || PLACEHOLDER}
                  alt={p.name}
                  sx={{ objectFit: "cover", bgcolor: "#f5f5f5" }}
                  onError={(e) => { e.target.src = PLACEHOLDER; }}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <ShoppingBag sx={{ color: "#1976D2", fontSize: 28 }} />
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
                    <Chip label={p.category} size="small" sx={{ mb: 1, bgcolor: "#E3F2FD" }} />
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

      {/* ── Add / Edit Modal ─────────────────────────────────────────────── */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 520,
            maxHeight: "90vh",
            overflowY: "auto",
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
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Product Name" name="name"
              value={form.name} onChange={handleChange}
              required sx={{ mb: 2 }}
            />

            <TextField
              fullWidth select label="Category" name="category"
              value={form.category} onChange={handleChange}
              sx={{ mb: 2 }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth label="Price (MAD)" name="price" type="number"
              value={form.price} onChange={handleChange}
              required inputProps={{ step: "0.01", min: "0" }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth label="Description" name="description"
              value={form.description} onChange={handleChange}
              multiline rows={3} sx={{ mb: 2 }}
            />

            {/* ── Image upload section ─────────────────────────────────── */}
            <Box
              sx={{
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
                mb: 2,
                textAlign: "center",
                cursor: "pointer",
                "&:hover": { borderColor: "primary.main", bgcolor: "#f5f9ff" },
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />

              {previewUrl ? (
                <Box>
                  <img
                    src={previewUrl}
                    alt="preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 160,
                      objectFit: "contain",
                      borderRadius: 8,
                      marginBottom: 8,
                    }}
                    onError={(e) => { e.target.src = PLACEHOLDER; }}
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Click to change image
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <ImageIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Click to upload product image
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    JPEG, PNG, GIF, WebP · max 5 MB
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Upload progress bar */}
            {uploading && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Uploading… {uploadProgress}%
                </Typography>
                <LinearProgress variant="determinate" value={uploadProgress} sx={{ mt: 0.5 }} />
              </Box>
            )}

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined" onClick={handleClose} fullWidth disabled={uploading}>
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={uploading}
                startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : null}
              >
                {uploading ? "Uploading…" : (editingProduct ? "Update" : "Add")} Product
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}