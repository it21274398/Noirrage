import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Modal,
  Box,
  LinearProgress,
  TextField,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import ViewAllcart from "./ViewAllcart"


const Profile = () => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("userToken"); // Get token from localStorage

  // Fetch user profile
  useEffect(() => {
    if (!token) {
      toast.error("Unauthorized! Please log in.");
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/auth/profileview",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(data);
        setName(data.name);
        setEmail(data.email);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to fetch profile.");
      } finally {
        setLoading(false); // ✅ Stop loading once data is fetched
      }
    };

    fetchProfile();
  }, [token]);

  // Open edit popup
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);



  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("userToken"); // ✅ Get token before request
  
    if (!token) {
      toast.error("Unauthorized! Please log in.");
      return;
    }
  
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/auth/profiledit", // ✅ Make sure endpoint is correct
        { name, email },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Ensure token is properly set
          },
        }
      );
      setUser(data);
      toast.success("Profile updated successfully!");
      handleClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };
  
  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        User Profile
      </Typography>

      {/* Loading Indicator */}
      {loading ? (
        <Box sx={{ width: "100%", mb: 2 }}>
          <LinearProgress color="primary" />
        </Box>
      ) : user ? (
        <Card>
          <CardContent>
            <Typography variant="h6">Name: {user.name}</Typography>
            <Typography variant="h6">Email: {user.email}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpen}
              sx={{ mt: 2 }}
            >
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Typography>No profile data found.</Typography>
      )}

      {/* Popup for Editing Profile */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "white",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit Profile
          </Typography>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateProfile}
            fullWidth
          >
            Save Changes
          </Button>
        </Box>
      </Modal>
      <ViewAllcart/>
    </Container>
  );
};

export default Profile;
