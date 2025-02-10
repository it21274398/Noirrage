import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const OrderForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const productId = location.state?.productId || null;
  const [step, setStep] = useState(1); // Track current step
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [shippingDetails, setShippingDetails] = useState({
    email: "",
    address: "",
    contactNumber: "",
  });
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);

  const token = localStorage.getItem("userToken"); // Get token from localStorage

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/products");
      const selected = data.find((p) => p._id === productId);
      setSelectedProduct(selected);
      setAvailableColors(selected.colors || []);
      setAvailableSizes(selected.sizes || []);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleNext = () => setStep(2); // Go to next step (Shipping Details)
  const handleBack = () => setStep(1); // Go to previous step (Product Selection)

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Unauthorized! Please log in.");
      return;
    }

    const orderData = {
      products: [{ product: selectedProduct?._id, quantity, size, color }],
      totalPrice: selectedProduct?.price * quantity,
      shippingDetails,
    };

    try {
      await axios.post("http://localhost:5000/api/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Order Placed Successfully!");
      navigate("/CustProductList"); // Redirect after order is placed
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Place an Order
        </Typography>
        <form onSubmit={handleOrderSubmit}>
          {/* Step 1: Product selection */}
          {step === 1 && selectedProduct && (
            <>
              <Typography variant="h6">{selectedProduct.name}</Typography>
              <TextField
                label="Quantity"
                type="number"
                fullWidth
                margin="normal"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Color</InputLabel>
                <Select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  {availableColors.length > 0 ? (
                    availableColors.map((colorOption, index) => (
                      <MenuItem key={index} value={colorOption}>
                        {colorOption}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      No colors available
                    </MenuItem>
                  )}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" required>
                <InputLabel>Size</InputLabel>
                <Select value={size} onChange={(e) => setSize(e.target.value)}>
                  {availableSizes.length > 0 ? (
                    availableSizes.map((sizeOption, index) => (
                      <MenuItem key={index} value={sizeOption}>
                        {sizeOption}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      No sizes available
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleNext}
                fullWidth
              >
                Next
              </Button>
            </>
          )}

          {/* Step 2: Shipping details */}
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
                  setShippingDetails({
                    ...shippingDetails,
                    email: e.target.value,
                  })
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
                color="secondary"
                sx={{ mt: 2 }}
                onClick={handleBack}
                fullWidth
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                type="submit"
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
