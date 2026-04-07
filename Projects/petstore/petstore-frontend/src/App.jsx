import { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Pets from "./pages/Pets";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Bookings from "./pages/Bookings";
import NavBar from "./components/Navbar";
import Reports from "./pages/Reports";
import Vendors from "./pages/Vendors";
import Employees from "./pages/Employees";
import SearchResults from "./pages/SearchResults";
import Orders from "./pages/Orders";
import Categories from "./pages/Categories";
import CustomerDetail from "./pages/CustomerDetail";

function App() {
  const [mode, setMode] = useState("light");
  const toggleDarkMode = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {}
            : {
                background: { default: "#121212", paper: "#1e1e1e" },
              }),
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <NavBar mode={mode} toggleDarkMode={toggleDarkMode} />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/pets" element={<Pets />} />
              <Route path="/products" element={<Products />} />
              <Route path="/services" element={<Services />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/customers/:id" element={<CustomerDetail />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
