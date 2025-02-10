import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  InputAdornment,
  Button,
  Container,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import {
  FcAdvertising,
  FcBusinessman,
  FcLock,
  FcUnlock,
} from "react-icons/fc";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { toast } from "react-toastify"; // Import Toast

const Signup = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/user/register",
        formData
      );
      toast.success("Signup successful! ");
      setTimeout(() => navigate("/"), 700);
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed! Try again."); // Show error message
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Signup
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="name"
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <FcBusinessman style={{ fontSize: "25px" }} />
                </InputAdornment>
              ),
            }}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <FcAdvertising style={{ fontSize: "25px" }} />
                </InputAdornment>
              ),
            }}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Password"
            margin="normal"
            name="password"
            type={showPassword ? "text" : "password"} // Fix for password visibility toggle
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <FcUnlock /> : <FcLock />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, bgcolor: "primary.main" }}
          >
            Sign Up
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Signup;
