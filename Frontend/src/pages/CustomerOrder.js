import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const OrderForm = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [shippingDetails, setShippingDetails] = useState({
    email: "",
    address: "",
    contactNumber: "",
  });

  const token = localStorage.getItem("adminToken"); // Get token from localStorage

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/products");
      setProducts(data);
      console.log("Products fetched",data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Unauthorized! Please log in.");
      return;
    }

    const orderData = {
      products: [{ product: selectedProduct, quantity, size, color }],
      totalPrice: calculateTotalPrice(selectedProduct, quantity),
      shippingDetails,
    };

    try {
      await axios.post("http://localhost:5000/api/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` }, // Send token in headers
      });
      console.log(token)
      toast.success("Order Placed Successfully!");
    } catch (error) {

      console.log(token,error)
      toast.error(error.response?.data?.message || "Failed to place order.");
      
    }
  };

  const calculateTotalPrice = (productId, quantity) => {
    const product = products.find((p) => p._id === productId);
    return product ? product.price * quantity : 0;
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>Place an Order</Typography>
        <form onSubmit={handleOrderSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Product</InputLabel>
            <Select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
              {products.map((product) => (
                <MenuItem key={product._id} value={product._id}>
                  {product.name} - ${product.price}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField label="Quantity" type="number" fullWidth margin="normal" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
          <TextField label="Size" fullWidth margin="normal" value={size} onChange={(e) => setSize(e.target.value)} required />
          <TextField label="Color" fullWidth margin="normal" value={color} onChange={(e) => setColor(e.target.value)} required />

          <Typography variant="h6" sx={{ mt: 2 }}>Shipping Details</Typography>
          <TextField label="Email" type="email" fullWidth margin="normal" value={shippingDetails.email} onChange={(e) => setShippingDetails({ ...shippingDetails, email: e.target.value })} required />
          <TextField label="Address" fullWidth margin="normal" value={shippingDetails.address} onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })} required />
          <TextField label="Contact Number" fullWidth margin="normal" value={shippingDetails.contactNumber} onChange={(e) => setShippingDetails({ ...shippingDetails, contactNumber: e.target.value })} required />

          <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
            Place Order
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default OrderForm;
