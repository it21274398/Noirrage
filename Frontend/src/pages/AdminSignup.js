import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { toast } from "react-toastify"; // Import Toast
import axios from "axios";
import { Container, TextField, Button, Typography, Box } from "@mui/material";



const Signup = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/admin/register", admin);
      console.log(data);
      toast.success("Signup successful! "); 
      setTimeout(() => navigate("/"), 700); 
    } catch (error) {
        toast.error(error.response?.data?.message || "Signup failed! Try again."); // Show error message
    }
  };

  return (
    <Container maxWidth="sm">
    <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        Admin Signup
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Name" name="name" fullWidth margin="normal" required onChange={handleChange} />
        <TextField label="Email" name="email" type="email" fullWidth margin="normal" required onChange={handleChange} />
        <TextField label="Phone" name="phone" fullWidth margin="normal" required onChange={handleChange} />
        <TextField label="Password" name="password" type="password" fullWidth margin="normal" required onChange={handleChange} />

        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
          Register
        </Button>
      </form>
    </Box>
  </Container>
  );
};

export default Signup;
