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

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("userToken");

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

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        My Cart
      </Typography>

      {loading ? (
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
      ) : cartItems.length === 0 ? (
        <Typography>No products available</Typography>
      ) : (
        <Grid container spacing={3}>
          {cartItems.map((item) => (
            <Grid  item xs={12} md={6} key={item._id}>
              <Card>
                <CardContent sx={{
                 
                  background: "linear-gradient(45deg, #232526, #414345)",
                  boxShadow: "0 4px 10px rgba(58, 58, 58, 0.76)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  // "&:hover": {
                  //   transform: "scale(1.03)",
                  //   boxShadow: "0 8px 16px rgba(0, 0, 0, 0.89)",
                  // },
                }}>
                  {" "}
                  <Typography variant="h6">{item.product?.name}</Typography>
                  <Box sx={{ textAlign: "center", mb: 2 }}>
                    <img
                      alt={item.product?.name}
                      src={`http://localhost:5000${item.product?.image}`}
                      style={{
                        width: "50%",
                        maxHeight: "150px",
                        objectFit: "contain",
                        borderRadius: "8px",
                      }}
                    />
                  </Box>
                  <Card
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 2,
                    }}
                  >
                    <Typography>
                      Quantity:
                      <br />
                      {item.qty || 1}
                    </Typography>
                    <Typography>
                      Size:
                      <br /> {item.size || "N/A"}
                    </Typography>
                    <Typography>
                      Color: <br />
                      {item.color || "N/A"}
                    </Typography>

                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleRemoveFromCart(item._id)}
                    >
                      Remove
                    </Button>
                  </Card>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Cart;
