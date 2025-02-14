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

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const navigate = useNavigate();
  const [productImageState, setProductImageState] = useState({});

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
  const handleImageHover = (productId, hover) => {
    setProductImageState((prevState) => ({
      ...prevState,
      [productId]: hover ? 1 : 0, // 1 for hover image, 0 for default image
    }));
  };

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
                  <Card sx={{ maxWidth: 300, perspective: "1000px" }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={`http://localhost:5000${
                        product.images[productImageState[product._id] || 0]
                      }`} // Dynamic image index for each product
                      alt={product.name}
                      id={`image-${product._id}`}
                      sx={{
                        transition: "transform 0.6s ease", // Slow down the rotation effect (1 second)
                        transformStyle: "preserve-3d",
                        ":hover": {
                          transform: "rotateY(180deg)", // Rotate right to left
                        },
                      }}
                      onMouseEnter={() => handleImageHover(product._id, true)} // Hover image
                      onMouseLeave={() => handleImageHover(product._id, false)} // Default image
                    />
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
