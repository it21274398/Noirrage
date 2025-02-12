import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { Add, Remove } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

const OrderForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const productId = location.state?.productId || null;
  const [step, setStep] = useState(1); // Track current step
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [order, setOrder] = useState({ products: [] });
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

  const cancel = () => {
    navigate("/CustProductList"); // Redirect to Home page
  };

  return (
    <Box
  sx={{
    display: "flex",
    justifyContent: "center", // Center horizontally
    alignItems: "center", // Center vertically
    height: "100vh", // Full viewport height
  }}
>
 
<Container maxWidth="xl">
      
      <Box
        sx={{
          mt: 5, // Moves below navbar (adjust if needed)
          p: 3,
          position: "relative", // Ensures the button positions inside this box
          boxShadow: "0px 12px 20px rgba(0, 0, 0, 0.88)",
          borderRadius: 3,
          background: "linear-gradient(90deg, #232526, #414345)",
        }}
      >
        {/* Close Button in Top-Right */}
        <IconButton
          onClick={cancel}
          sx={{
            position: "absolute",
            top: 8, // Position from the top inside the box
            right: 8, // Position from the right inside the box
            color: "red",
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "rgba(255, 0, 0, 0.1)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Flexbox for Left Image & Right Form */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
          {/* Left Side - Product Image (40%) */}
          <Box sx={{ width: "35%", textAlign: "center" }}>
            <img
              alt={selectedProduct?.name}
              src={`http://localhost:5000${selectedProduct?.image}`}
              style={{
                width: "100%",
                boxShadow: "0px 12px 20px rgb(0, 0, 0), 0.88)",
                objectFit: "contain",
                borderRadius: "10px",
              }}
            />
          </Box>

          {/* Right Side - Order Form (60%) */}
          <Box
            sx={{
              width: "60%",
              p: 3,

              borderRadius: 2,
            }}
          >
            <form onSubmit={handleOrderSubmit}>
              {/*------------------------------------------------------------ Product details------------------------------------------------------------*/}
              {step === 1 && selectedProduct && (
                <>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "'Raleway', sans-serif",
                      fontSize: "2em",
                    }}
                    color="#fdc200"
                    mb={5}
                  >
                  Fill Order Details of {selectedProduct.name}
                  </Typography>

                 

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                   

                    {/* Color & Size Row */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-evenly",

                        flexWrap: "wrap",
                      }}
                    >
                       {/* Quantity Selector */}
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Typography color="#d7d7d7" variant="subtitle1" fontWeight="bold">
                        Quantity
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          width: "fit-content",
                        }}
                      >
                        <IconButton
                          onClick={() =>
                            setQuantity((prev) => Math.max(prev - 1, 1))
                          }
                          sx={{
                            color: "white",
                            border: "1px solid #ccc",
                            borderRadius: "500px",
                          }}
                        >
                          <Remove />
                        </IconButton>
                        <TextField
                          type="number"
                          value={quantity}
                          onChange={(e) =>
                            setQuantity(Math.max(Number(e.target.value), 1))
                          }
                          inputProps={{
                            min: 1,
                            style: {
                              color: "white",
                              border: "1px solid #ccc",
                              textAlign: "center",
                             padding: "10px",
                              MozAppearance: "textfield", // Firefox
                            },
                          }}
                          sx={{
                            width: "50px",
                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                              {
                                WebkitAppearance: "none",
                                margin: 0,
                              },
                          }}
                        />

                        <IconButton
                          onClick={() => setQuantity((prev) => prev + 1)}
                          sx={{
                            color: "white",
                            border: "1px solid #ccc",
                            borderRadius: "500px",
                          }}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                    </Box>
                      {/* Color Selector */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <Typography color="#d7d7d7" variant="subtitle1" fontWeight="bold">
                          Pick a Color
                        </Typography>
                        <ToggleButtonGroup
                          value={color}
                          exclusive
                          onChange={(e) => setColor(e.target.value)}
                          aria-label="color selection"
                          sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                        >
                          {availableColors.length > 0 ? (
                            availableColors.map((color, index) => (
                              <ToggleButton
                                key={index}
                                value={color}
                                sx={{
                                  fontSize:12,
                                  backgroundColor: color.toLowerCase(),
                                  color: "white",
                                  border: "1px solid black",
                                  "&.Mui-selected": {
                                    border: "1px solid black",
                                  },
                                  "&:hover": { opacity: 0.8 },
                                }}
                              >{color}</ToggleButton>
                            ))
                          ) : (
                            <ToggleButton value="" disabled>
                              No colors available
                            </ToggleButton>
                          )}
                        </ToggleButtonGroup>
                      </Box>

                      {/* Size Selector */}
                      <Box
                        sx={{
                          
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <Typography color="#d7d7d7" variant="subtitle1" fontWeight="bold">
                          Available Sizes
                        </Typography>
                        <ToggleButtonGroup
                          value={size}
                          exclusive
                          onChange={(e) => setSize(e.target.value)}
                          aria-label="size selection"
                          sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                        >
                          {availableSizes.length > 0 ? (
                            availableSizes.map((sizeOption, index) => (
                              <ToggleButton
                                key={index}
                                value={sizeOption}
                                sx={{color:"white",
                                  border: "1px solid #ccc",
                                  fontWeight: "bold",
                                  "&.Mui-selected": {
                                    border: "1px solid black",
                                    backgroundColor: "#f0f0f0",
                                  },
                                  "&:hover": { backgroundColor: "#e0e0e0" },
                                }}
                              >
                                {sizeOption}
                              </ToggleButton>
                            ))
                          ) : (
                            <ToggleButton value="" disabled>
                              No sizes available
                            </ToggleButton>
                          )}
                        </ToggleButtonGroup>
                      </Box>
                    </Box>
                  </Box>
                  {/*------------------------------------------------------------ Shipping details------------------------------------------------------------*/}
                  <Typography color="#d7d7d7" mt={3} variant="h5" gutterBottom>
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
                    sx={{
                      "& label": { color: "white" }, // Default label color
                      "& label.Mui-focused": { color: "white" }, // Focused label color
                      "& input": { color: "white" }, // User-typed text color
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "gray" }, // Default border color
                      },
                    }}
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
                    sx={{
                      "& label": { color: "white" }, // Default label color
                      "& label.Mui-focused": { color: "white" }, // Focused label color
                      "& input": { color: "white" }, // User-typed text color
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "gray" }, // Default border color
                      },
                    }}
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
                    sx={{
                      "& label": { color: "white" }, // Default label color
                      "& label.Mui-focused": { color: "white" }, // Focused label color
                      "& input": { color: "white" }, // User-typed text color
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "gray" }, // Default border color
                      },
                    }}
                    required
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      position:"absolute",
                      right:"0",
                      bottom:"0",
                      mr:6,
                      mb:1,
                      bgcolor:"black",
                      // background: "linear-gradient(180deg ,rgba(0, 0, 0, 0.78) , #434343,rgba(0, 0, 0, 0.81))" ,
                      color: "white",
                      fontWeight: "bold",
                      "&:hover": { color:"black", bgcolor: "white", boxShadow: "0px 0px 10px rgba(159, 159, 159, 0.88)", },
                     
                    }}
                    onClick={handleNext}
                    
                  >
                    Next
                  </Button>
                </>
              )}

              {/* Step 2: Shipping details */}
              {step === 2 && (
                <>
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
                   
                    sx={{ mt: 2,background: "linear-gradient(90deg,  #FFD200 , #F7971E, #FFD200)" }}
                    type="submit"
                    fullWidth
                  >
                    Order Now
                  </Button>
                </>
              )}
            </form>
          </Box>
        </Box>
      </Box>
    </Container>
</Box>

  );
};

export default OrderForm;
