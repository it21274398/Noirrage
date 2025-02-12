import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("Unauthorized! Please log in.");
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/cart/view",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCartItems(
          Array.isArray(response.data)
            ? response.data
            : response.data.items || []
        );
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch cart.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token]);

  const handleRemoveFromCart = async (itemId) => {
    if (!token) {
      toast.error("Unauthorized! Please log in.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/cart/remove/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Item removed from cart!");
      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== itemId)
      );
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to remove item.");
    }
  };

  const handleOrderNow = (productId) => {
    navigate("/CustomerOrder", { state: { productId } });
  };

  return (
    <Box sx={{ padding: "40px", minHeight: "100vh", background: "#1a1a1a" }}>
      {loading ? (
        <Box sx={{ width: "100%", mb: 2 }}>
          <LinearProgress
            sx={{
              backgroundColor: "black",
              borderRadius: 10,
              "& .MuiLinearProgress-bar": { backgroundColor: "gold" },
            }}
          />
        </Box>
      ) : cartItems.length === 0 ? (
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "22px",
            fontWeight: "bold",
            color: "#aaa",
          }}
        >
          Your cart is empty.
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {cartItems.map((item) => (
            <Grid item xs={12} sm={10} md={6} key={item._id}>
              <Card
                sx={{
                  backdropFilter: "blur(15px)",
                  boxShadow: "0px 12px 20px rgb(0, 0, 0)",
                  borderRadius: 2,
                  background: "linear-gradient(90deg, #232526, #414345)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.9)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px",
                  }}
                >
                  {/* Product Image */}
                  <Box
                    sx={{ flexShrink: 0, textAlign: "center", mr: { sm: 3 } }}
                  >
                    <img
                      alt={item.product?.name}
                      src={`http://localhost:5000${item.product?.image}`}
                      style={{
                        width: "100%",
                        height: "230px",
                        objectFit: "cover",
                        borderRadius: 6,
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </Box>

                  {/* Product Details */}
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        color: "#f1c40f",
                        textAlign: "center",
                        mb: 1,
                      }}
                    >
                      {item.product?.name}
                    </Typography>
                    <Typography
                      variant="h7"
                      sx={{
                        color: "white",
                        textAlign: "center",
                        opacity: 0.8,
                        mb: 1,
                      }}
                    >
                      {item.product?.description}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "700",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      Price: ${item.product?.price}
                    </Typography>
                  </Box>
                </CardContent>
                {/*order Buttons */}
                <Box sx={{ ml:30,mt: -4,mb:5, textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      bgcolor: "black",
                      color: "white",
                      fontWeight: "bold",
                      "&:hover": { bgcolor: "gray" },
                    }}
                    onClick={() => handleOrderNow(item.product?._id)}
                  >
                    Order Now
                  </Button>

                  {/*remove Buttons */}
                  <Button
                    sx={{
                      borderRadius: 10,
                      bgcolor: "#00000000",
                      color: "gold",
                      fontWeight: "bold",
                      "&:hover": { bgcolor: "#00000000" },
                    }}
                    onClick={() => handleRemoveFromCart(item._id)}
                  >
                    <DeleteIcon />
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Cart;
