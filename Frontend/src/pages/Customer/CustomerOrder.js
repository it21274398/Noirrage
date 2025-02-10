import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  Grid,
  Select,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const OrderForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Track current step
  const location = useLocation();
  const productId = location.state?.productId || null; // Get cart item ID
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
  const handleNext = () => {
    setStep(2); // Go to next step (Shipping Details)
  };

  const handleBack = () => {
    setStep(1); // Go to next step (Shipping Details)
  };

  const token = localStorage.getItem("userToken"); // Get token from localStorage

  useEffect(() => {
    if (productId) {
      fetchProducts();
    }
  }, [productId]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/products");

      if (data) {
        setProducts(data); // Store all products
      }

      if (data && productId) {
        const selected = data.find((p) => p._id === productId);
        if (selected) {
          setSelectedProduct(selected);
        }
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleOrderSubmit = async (e) => {
    if (!token) {
      toast.error("Unauthorized! Please log in.");
      return;
    }

    const orderData = {
      products: [
        {
          product: selectedProduct?._id,
          quantity,
          size,
          color,
        },
      ],
      totalPrice: calculateTotalPrice(), // Ensure function is called properly
      shippingDetails,
    };

    try {
      await axios.post("http://localhost:5000/api/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` }, // Send token in headers
      });
      //console.log(orderData);
      toast.success("Order Placed Successfully!");
      navigate("/CustProductList"); // Redirect if no token
    } catch (error) {
      console.log("Order Placed Successfully!", error);
      toast.error(error.response?.data?.message || "Failed to place order.");
    }
  };

  const handleAddToCart = async (productId) => {
    if (!token) {
      toast.error("Unauthorized! Please log in.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId, qty: quantity, size, color }, // Use productId
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Added to Cart Successfully!");
      navigate("/CustProductList");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart.");
    }
  };

  const calculateTotalPrice = () => {
    return selectedProduct ? selectedProduct.price * quantity : 0;
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Place an Order
        </Typography>

        <form onSubmit={handleOrderSubmit}>
           <FormControl fullWidth margin="normal">
            <Typography variant="h6" sx={{ mt: 1 }}>
              {selectedProduct ? selectedProduct.name : "No product selected"}
            </Typography>
          </FormControl>
          {/* Step 1: Quantity, Size, Color */}
          {step === 1 && (
            <>
              <TextField
                label="Quantity"
                type="number"
                fullWidth
                margin="normal"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />

              <FormControl fullWidth margin="normal" required>
                <InputLabel>Size</InputLabel>
                <Select
                  label="Size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                >
                  <MenuItem value="S">Small</MenuItem>
                  <MenuItem value="L">Large</MenuItem>
                  <MenuItem value="XL">X-Large</MenuItem>
                  <MenuItem value="XXL">XX-Large</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" required>
                <InputLabel>Color</InputLabel>
                <Select
                  label="Color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  <MenuItem value="Black">Black</MenuItem>
                  <MenuItem value="Gray">Gray</MenuItem>
                  <MenuItem value="White">White</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleNext} // Move to next step
                fullWidth
              >
                Next
              </Button>
            </>
          )}

          {/* Step 2: Shipping Details */}
          {step === 2 && (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Shipping Details
              </Typography>
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={shippingDetails.email}
                onChange={(e) =>
                  setShippingDetails({ ...shippingDetails, email: e.target.value })
                }
                required
              />
              <TextField
                label="Address"
                fullWidth
                margin="normal"
                value={shippingDetails.address}
                onChange={(e) =>
                  setShippingDetails({
                    ...shippingDetails,
                    address: e.target.value,
                  })
                }
                required
              />
              <TextField
                label="Contact Number"
                fullWidth
                margin="normal"
                value={shippingDetails.contactNumber}
                onChange={(e) =>
                  setShippingDetails({
                    ...shippingDetails,
                    contactNumber: e.target.value,
                  })
                }
                required
              />
<Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleBack} // Move to next step
                fullWidth
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleOrderSubmit}
                fullWidth
              >
                Order Now
              </Button>
            </>
          )}
        </form>
      </Box>
    </Container>
  );
};

export default OrderForm;