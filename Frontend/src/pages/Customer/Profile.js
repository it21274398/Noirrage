import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Modal,
  Divider,
  Box,
  LinearProgress,
  TextField,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import ViewAllcart from "./ViewAllcart";
import { styled } from "@mui/system";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [pendingRequests, setPendingRequests] = useState(2); // Track API requests

  const token = localStorage.getItem("userToken"); // Get token once

  useEffect(() => {
    if (!token) {
      toast.error("Unauthorized! Please log in.");
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/auth/profileview",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(data);
        setName(data.name);
        setEmail(data.email);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to fetch profile.");
      } finally {
        setPendingRequests((prev) => prev - 1); // Reduce pending requests
      }
    };

    const getUserOrders = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/orders/byid",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders.");
      } finally {
        setPendingRequests((prev) => prev - 1);
      }
    };

    fetchProfile();
    getUserOrders();
  }, [token]);

  // Set loading to false when all requests complete
  useEffect(() => {
    if (pendingRequests === 0) {
      setLoading(false);
    }
  }, [pendingRequests]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleUpdateProfile = async () => {
    if (!token) {
      toast.error("Unauthorized! Please log in.");
      return;
    }

    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/auth/profiledit",
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(data);
      toast.success("Profile updated successfully!");
      handleClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleCancelOrder = async (orderId, orderStatus, event) => {
    event.preventDefault(); // Prevent default behavior

    // Prevent cancellation if order is already shipped
    if (orderStatus === "Shipped") {
      toast.error("Order has already been shipped and cannot be canceled.");
      return;
    }

    if (!token) {
      toast.error("Unauthorized! Please log in.");
      return;
    }

    try {
      const { data } = await axios.delete(
        `http://localhost:5000/api/orders/${orderId}/deleted`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order deleted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error(error.response?.data?.message || "Failed to delete order.");
    }
  };

  const FullWidthSection = styled(Box)({
    width: "100%", // Ensures full width
    padding: "40px 0", // Adds spacing on top and bottom
  });
  return (
    <Container maxWidth={false} sx={{ width: "100%", p: 0 }}>
      <FullWidthSection>
        <Typography variant="h4" sx={{ mb: 3 }}>
          User Profile
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
        ) : user ? (
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              mb: 5,
              bgcolor: "black",
              borderRadius: 2,
              color: "red",
              boxShadow: 3,
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6">Name: {user.name}</Typography>
              <Typography variant="h6">Email: {user.email}</Typography>
            </CardContent>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpen}
              sx={{ height: "40px", minWidth: "120px" }}
            >
              Edit Profile
            </Button>
          </Card>
        ) : (
          <Typography>No profile data found.</Typography>
        )}
        {/* <Divider sx={{ backgroundColor: "#FFD700", height: "0.8px", my: 2 }} /> */}
         <Typography
                sx={{
                  textAlign: "center",
                  fontSize: "2.7rem",
                  fontWeight: "bold",
                  color: "white",
                  fontFamily: "'Raleway', sans-serif",
                }}
              >
               Your Orders
              </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 2,
            p: 2,
          }}
        >
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <Card
                key={order._id}
                sx={{
                  maxWidth: "600px",
                  background: "linear-gradient(135deg, #232526, #414345)",
                  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.5)",
                  borderRadius: "12px",
                  p: 2,
                  m:5,
                  textAlign: "center",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                <CardContent>
                  {/* Product Name Centered */}
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#FFD700",
                      fontWeight: "bold",
                      textAlign: "left",
                    }}
                  >
                    {order.products[0]?.product?.name}
                  </Typography>

                  {/* Image on Left, Details on Right */}
                  <Box
                    mt={2}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "#fff",
                      gap: 2,
                    }}
                  >
                    {/* Image on Left */}
                    <Box
                      sx={{
                        borderRadius: "8px",
                        p: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={`http://localhost:5000${order.products[0]?.product?.image}`}
                        alt={order.products[0]?.product?.name}
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "contain",
                          borderRadius: "5px",
                        }}
                      />
                    </Box>

                    {/* Details in a Column */}
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Typography
                        variant="h5"
                        display="flex"
                        alignItems="center"
                      >
                        Status: {order.status}
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: 50,
                            backgroundColor:
                              order.status === "Shipped" ? "#4CAF50" : "red",
                            ml: 1, // Adds spacing between text and dot
                          }}
                        />
                      </Typography>
                      <Typography variant="h5">
                        Price: ${order.totalPrice}
                      </Typography>
                      <Typography variant="body2" color="rgba(255,255,255,0.7)">
                        Ordered on:{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    sx={{
                      fontWeight: "bold",
                      color: "black",
                      background: "gold",
                      mt: 2,
                      "&:hover": { background: "red" },
                    }}
                    onClick={(event) =>
                      handleCancelOrder(order._id, order.status, event)
                    }
                  >
                    Cancel Order
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography
              variant="h6"
              sx={{ color: "#fff", textAlign: "center" }}
            >
              No orders found.
            </Typography>
          )}
        </Box>
        {/* Edit Profile Modal */}
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "white",
              boxShadow: 24,
              p: 3,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Edit Profile
            </Typography>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateProfile}
              fullWidth
            >
              Save Changes
            </Button>
          </Box>
        </Modal>
        <Divider sx={{ backgroundColor: "#FFD700", height: "0.8px", my: 2 }} />

        <ViewAllcart />
      </FullWidthSection>
    </Container>
  );
};

export default Profile;
