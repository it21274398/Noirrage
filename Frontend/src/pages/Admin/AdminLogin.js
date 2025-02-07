import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify"; // Import Toast
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/admin/login",
        admin
      );

      localStorage.setItem("adminToken", data.token);
      if (data.admin && data.admin.email) {
        localStorage.setItem("adminEmail", data.admin.email); // Store email only if available
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      toast.success("Admin Logged In Successfully");
      navigate("/Home"); // Redirect to orders page
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Admin Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            required
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            required
            onChange={handleChange}
          />
          <Link to="/admin/signup" className="nav-link">
            Sing up
          </Link>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AdminLogin;
