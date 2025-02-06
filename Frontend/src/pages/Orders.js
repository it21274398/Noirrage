import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const OrderForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, size, color } = location.state || {};

  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");

  const handleSubmit = async () => {
    try {
      const orderData = {
        productId: product._id,
        size,
        color,
        email,
        address,
        contact,
        status: "Processing",
      };

      await axios.post("http://localhost:5000/api/orders", orderData);
      toast.success("Order placed successfully!");
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data.message || "Error placing order");
    }
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: 500, margin: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Confirm Your Order
      </Typography>
      <img src={product?.image} alt={product?.name} width="100%" height="200px" />
      <Typography>Product: {product?.name}</Typography>
      <Typography>Size: {size}</Typography>
      <Typography>Color: {color}</Typography>

      <TextField label="Email" fullWidth sx={{ mt: 2 }} value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField label="Address" fullWidth sx={{ mt: 2 }} value={address} onChange={(e) => setAddress(e.target.value)} />
      <TextField label="Contact Number" fullWidth sx={{ mt: 2 }} value={contact} onChange={(e) => setContact(e.target.value)} />

      <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }} onClick={handleSubmit}>
        Confirm Order
      </Button>
    </Box>
  );
};

export default OrderForm;
