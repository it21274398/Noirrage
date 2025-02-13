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
    <Box sx={{ padding: "40px", minHeight: "100vh" }}>
      <Typography
        sx={{
          textAlign: "center",
          fontSize: "2.7rem",
          fontWeight: "bold",
          color: "white",
          mb: 6,
          fontFamily: "'Raleway', sans-serif",
        }}
      >
        My cart
      </Typography>
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
                  boxShadow: "0px 12px 20px rgb(0, 0, 0)",
                  borderRadius: 2,
                  background: "linear-gradient(90deg, #232526, #414345)",
                  transition: "all 0.2s ease",
                  border: "0.5px solid rgba(100, 100, 100, 0.41)",
                  "&:hover": {
                    border: "1px solid rgba(171, 170, 170, 0.7)",
                    transform: "scale(1)",
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
                  <Box ml={3} sx={{ flex: 1 }}>
                    <Typography
                      variant="h5"
                      mb={2}
                      sx={{
                        fontFamily: "'Raleway', sans-serif",
                        fontWeight: "bold",
                        color: "#f1c40f",
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
                      }}
                    >
                      {item.product?.description}
                    </Typography>
                    <Typography
                      mt={2}
                      variant="h6"
                      sx={{
                        fontWeight: "700",
                        color: "white",
                      }}
                    >
                      Price: Rs {item.product?.price}
                    </Typography>
                  </Box>
                </CardContent>
                {/*order Buttons */}
                <Box sx={{ ml: 30, mb: 5, textAlign: "center" }}>
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
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      marginLeft: 3,
                      bgcolor: "gold",
                      color: "black",
                      fontWeight: "bold",
                      "&:hover": { bgcolor: "red" },
                    }}
                    onClick={() => handleRemoveFromCart(item._id)}
                  >
                    Remove <DeleteIcon />
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
