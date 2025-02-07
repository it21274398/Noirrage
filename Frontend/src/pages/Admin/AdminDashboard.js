import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Box,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem("adminToken"); // Get token from localStorage

  useEffect(() => {
    if (!token) {
      console.error("No admin token found");
      navigate("/admin/login"); // Redirect if no token
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      });
      setOrders(data);
      console.log("Orders fetched", data);
    } catch (error) {
      console.error(
        "Error fetching orders:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const markAsShipped = async (orderId) => {
    const token = localStorage.getItem("adminToken"); // Fetch token

    console.log("Sending Token:", token); // Debugging

    try {
      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/ship`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure token is in Authorization header
          },
        }
      );
      console.log("Order marked as shipped:", response.data);
      fetchOrders();
    } catch (error) {
      console.error(
        "Error updating order:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        my={4}
      >
        <Typography variant="h4">Admin Dashboard</Typography>
      </Box>

      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
        Pending Orders
      </Typography>
      <Grid container spacing={2}>
        {orders
          .filter((order) => order.status === "Pending")
          .map((order) => (
            <Grid item xs={12} md={6} key={order._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Order ID: {order._id}</Typography>
                  <Typography>
                    Customer Email: {order.shippingDetails.email}
                  </Typography>
                  <Typography>Items: {order.products.length}</Typography>
                  <Typography>Status: {order.status}</Typography>
                  <Typography>Total Price: ${order.totalPrice}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => markAsShipped(order._id)}
                    sx={{ mt: 2 }}
                  >
                    Mark as Completed
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
        Completed Orders
      </Typography>
      <Grid container spacing={2}>
        {orders
          .filter((order) => order.status === "Shipped")
          .map((order) => (
            <Grid item xs={12} md={6} key={order._id}>
              <Card sx={{ backgroundColor: "#f0f0f0" }}>
                <CardContent>
                  <Typography variant="h6">Order ID: {order._id}</Typography>
                  <Typography>
                    Customer Email: {order.shippingDetails.email}
                  </Typography>
                  <Typography>Items: {order.products.length}</Typography>
                  <Typography>Status: {order.status}</Typography>
                  <Typography>Total Price: ${order.totalPrice}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
