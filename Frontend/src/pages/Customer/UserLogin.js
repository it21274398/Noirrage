import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { FcAdvertising, FcLock, FcUnlock } from "react-icons/fc";
import axios from "axios";
import { toast } from "react-toastify"; // Import Toast
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

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
        "http://localhost:5000/api/auth/user/login",
        admin
      );

      localStorage.setItem("userToken", data.token);
      if (data.admin && data.admin.email) {
        localStorage.setItem("userEmail", data.admin.email); // Store email only if available
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      toast.success(data.email, "Logged In Successfully");
      navigate("/Home"); // Redirect to orders page
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            required
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
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"} // Fix for password visibility toggle
            fullWidth
            margin="normal"
            required
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
          <Link to="/user/signup" className="nav-link">
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

export default UserLogin;
