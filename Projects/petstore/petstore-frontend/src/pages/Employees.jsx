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
  Chip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Add, Edit, Delete, Search, Badge } from "@mui/icons-material";
import Typewriter from "../components/Typewriter";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    hiringDate: "",
    isAvailable: true,
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFiltered(employees);
      return;
    }
    const q = searchTerm.toLowerCase();
    setFiltered(
      employees.filter(
        (e) =>
          e.name?.toLowerCase().includes(q) ||
          e.email?.toLowerCase().includes(q) ||
          e.phone?.toLowerCase().includes(q)
      )
    );
  }, [searchTerm, employees]);

  const fetchEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
      setFiltered(res.data);
    } catch (err) {
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (employee = null) => {
    setError("");
    if (employee) {
      setEditing(employee);
      setForm({
        name: employee.name || "",
        phone: employee.phone || "",
        email: employee.email || "",
        hiringDate: employee.hiringDate || "",
        isAvailable: employee.isAvailable ?? true,
      });
    } else {
      setEditing(null);
      setForm({ name: "", phone: "", email: "", hiringDate: "", isAvailable: true });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await api.put(`/employees/${editing.employeeId}`, form);
      } else {
        await api.post("/employees", form);
      }
      fetchEmployees();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "Error saving employee.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting employee.");
    }
  };

  const handleToggleAvailability = async (employee) => {
    try {
      const newValue = !employee.isAvailable;
      await api.patch(`/employees/${employee.employeeId}/availability?available=${newValue}`);
      fetchEmployees();
    } catch (err) {
      alert("Error toggling availability.");
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
        <Badge fontSize="large" sx={{ color: "#607D8B" }} />
        <Typewriter text="Employees" />
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
        <TextField
          placeholder="Search employees..."
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
          sx={{ ml: "auto", backgroundColor: "#607D8B", "&:hover": { backgroundColor: "#455A64" } }}
        >
          Add Employee
        </Button>
      </Box>

      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
        Showing {filtered.length} of {employees.length} employees
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {filtered.length === 0 ? (
        <Alert severity="info">
          {searchTerm ? "No employees match your search." : "No employees found. Click 'Add Employee' to create one."}
        </Alert>
      ) : (
        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#607D8B" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Phone</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Hired</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Availability</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((emp) => (
                <TableRow key={emp.employeeId} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{emp.name || "N/A"}</TableCell>
                  <TableCell>{emp.phone || "N/A"}</TableCell>
                  <TableCell>{emp.email || "N/A"}</TableCell>
                  <TableCell>{emp.hiringDate || "N/A"}</TableCell>
                  <TableCell>
                    <Chip
                      label={emp.isAvailable ? "Available" : "Unavailable"}
                      color={emp.isAvailable ? "success" : "default"}
                      size="small"
                      onClick={() => handleToggleAvailability(emp)}
                      sx={{ cursor: "pointer" }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpen(emp)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(emp.employeeId)}>
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
            mt: "8%",
            boxShadow: 5,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {editing ? "Edit Employee" : "Add Employee"}
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Full Name" name="name"
              value={form.name} onChange={handleChange} required sx={{ mb: 2 }}
            />
            <TextField
              fullWidth label="Phone" name="phone"
              value={form.phone} onChange={handleChange} sx={{ mb: 2 }}
            />
            <TextField
              fullWidth label="Email" name="email" type="email"
              value={form.email} onChange={handleChange} sx={{ mb: 2 }}
            />
            <TextField
              fullWidth label="Hiring Date" name="hiringDate" type="date"
              value={form.hiringDate} onChange={handleChange}
              InputLabelProps={{ shrink: true }} sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  name="isAvailable"
                  checked={form.isAvailable}
                  onChange={handleChange}
                  color="success"
                />
              }
              label="Available"
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="success" fullWidth type="submit">
              {editing ? "Update Employee" : "Add Employee"}
            </Button>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}
