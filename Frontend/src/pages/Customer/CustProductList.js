import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CardMedia,
  Box,
  Button,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("userToken"); // Get token from localStorage

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products/");
      setProducts(response.data);
    } catch (error) {
      toast.error(error.response?.data.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderNow = (productId) => {
    navigate("/CustomerOrder", { state: { productId } });
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

  // Automatically change the image when the user hovers over the image
  useEffect(() => {
    let interval;
    if (isHovering) {
      interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === products.images?.length - 1 ? 0 : prevIndex + 1
        );
      },700); // Change image every 0.5 seconds
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval); // Clear the interval on unmount or hover end
  }, [isHovering, products.images?.length]);

  return (
    <Box sx={{ padding: "20px" }}>
      {loading && (
        <Box sx={{ width: "100%", mb: 2 }}>
          <LinearProgress
            sx={{
              backgroundColor: "black",
              borderRadius: 10,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "gold",
                borderRadius: 4,
              },
            }}
          />
        </Box>
      )}

      <Grid container spacing={2} sx={{ justifyContent: "center" }}>
        {!loading && products.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ width: "100%", textAlign: "center" }}
          >
            No products available.
          </Typography>
        ) : (
          products.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product._id}>
              <Card
                sx={{
                  width: "75%",
                  border: "1px solid rgba(109, 109, 109, 0.34)",
                  display: "flex",
                  flexDirection: "column",
                  padding: "20px",
                  margin: "10px", // Reduced margin here
                  borderRadius: 2,
                  background: "linear-gradient(45deg, #232526, #414345)",
                  boxShadow: "0 4px 10px rgb(39, 38, 38)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                <Box
                  sx={{
                    height: 350,
                    width: "100%",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 1,
                  }}
                >
                  <Card>
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: 200,
                        overflow: "hidden",
                      }}
                      onMouseEnter={() => setIsHovering(true)} // Start auto transition on hover
                      onMouseLeave={() => setIsHovering(false)} // Stop transition when hover ends
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={`http://localhost:5000${product.images[currentImageIndex]}`}
                        alt={product.name}
                        sx={{
                          transition: "transform 0.5s ease", // Smooth transition for images
                        }}
                      />
                      <Typography variant="h6" sx={{ padding: 1 }}>
                        {product.name}
                      </Typography>
                    </Box>
                  </Card>
                </Box>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",

                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "35px", fontWeight: 500, color: "#fdc200" }}
                  >
                    {product.name}
                  </Typography>
                  <Typography variant="h7" color="#d0d0d0">
                    {product.description}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mt: 1, color: "#fff" }}
                  >
                    {" "}
                    Price: ${product.price}
                  </Typography>

                  <Grid
                    container
                    spacing={1}
                    sx={{ mt: 1, justifyContent: "center" }}
                  >
                    {/* Order Now Button */}
                    <Grid item xs={8}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                          bgcolor: "black",
                          color: "white",
                          fontWeight: "bold",
                          "&:hover": { bgcolor: "gray" },
                        }}
                        onClick={() => handleOrderNow(product._id)}
                      >
                        Order Now
                      </Button>
                    </Grid>

                    {/* Add to Cart Button */}
                    <Grid item xs={2}>
                      <Button
                        sx={{
                          borderRadius: 10,
                          bgcolor: "#00000000",
                          color: "gold",
                          fontWeight: "bold",
                          "&:hover": { color: "#1ac600" },
                        }}
                        onClick={() => handleAddToCart(product._id)} // Pass product ID
                      >
                        {" "}
                        <ShoppingCartIcon />
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default ProductList;
