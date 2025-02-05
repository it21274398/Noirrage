import React, { useState, useEffect } from "react";
import { Button, TextField, Grid, Typography, Box, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CustomerOrder = () => {
  const [products, setProducts] = useState([]);
  const [orderData, setOrderData] = useState({
    productId: "",
    quantity: 1,
    address: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
      } catch (error) {
        toast.error("Failed to fetch products");
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData({ ...orderData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/orders/place", orderData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success(response.data.message);
      navigate("/orders");
    } catch (error) {
      toast.error(error.response?.data.message || "Error placing order");
    }
  };

  return (
    <Box sx={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Place Order
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Product</InputLabel>
              <Select name="productId" value={orderData.productId} onChange={handleChange}>
                {products.map((product) => (
                  <MenuItem key={product._id} value={product._id}>
                    {product.name} - ${product.price}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Quantity"
              type="number"
              variant="outlined"
              fullWidth
              name="quantity"
              value={orderData.quantity}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Delivery Address"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              name="address"
              value={orderData.address}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Place Order
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default CustomerOrder;
