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
} from "@mui/material";
import { Add, Edit, Delete, Search, Category } from "@mui/icons-material";
import Typewriter from "../components/Typewriter";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ name: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFiltered(categories);
      return;
    }
    const q = searchTerm.toLowerCase();
    setFiltered(categories.filter((c) => (c.name || "").toLowerCase().includes(q)));
  }, [searchTerm, categories]);

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
      setFiltered(res.data);
    } catch (err) {
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (cat = null) => {
    setError("");
    if (cat) {
      setEditing(cat);
      setForm({ name: cat.name || "" });
    } else {
      setEditing(null);
      setForm({ name: "" });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await api.put(`/categories/${editing.categoryId}`, form);
      } else {
        await api.post("/categories", form);
      }
      fetchCategories();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "Error saving category.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting category.");
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
        <Category fontSize="large" sx={{ color: "#f59e0b" }} />
        <Typewriter text="Categories" />
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
        <TextField
          placeholder="Search categories..."
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
          sx={{ ml: "auto", backgroundColor: "#f59e0b", "&:hover": { backgroundColor: "#d97706" } }}
        >
          Add Category
        </Button>
      </Box>

      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
        Showing {filtered.length} of {categories.length} categories
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {filtered.length === 0 ? (
        <Alert severity="info">
          {searchTerm ? "No categories match your search." : "No categories found. Click 'Add Category' to create one."}
        </Alert>
      ) : (
        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f59e0b" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((cat) => (
                <TableRow key={cat.categoryId} hover>
                  <TableCell>{cat.categoryId}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{cat.name || "N/A"}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpen(cat)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(cat.categoryId)}>
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
            width: 400,
            mx: "auto",
            mt: "10%",
            boxShadow: 5,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {editing ? "Edit Category" : "Add Category"}
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Category Name" name="name"
              value={form.name} onChange={(e) => setForm({ name: e.target.value })}
              required sx={{ mb: 3 }}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined" onClick={handleClose} fullWidth>Cancel</Button>
              <Button
                variant="contained" type="submit" fullWidth
                sx={{ backgroundColor: "#f59e0b", "&:hover": { backgroundColor: "#d97706" } }}
              >
                {editing ? "Update" : "Create"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}
