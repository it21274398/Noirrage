import React, { useState, useEffect } from "react";
import { Container, Typography, Button, TextField, Grid, Card, CardContent } from "@mui/material";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/orders"; // Change this if needed

const OrderTestPage = () => {
  const [orders, setOrders] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({ productId: "", userId: "", size: "", color: "" });
  const [userId, setUserId] = useState("");

  // Fetch all orders (Admin Only)
  const fetchOrders = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data?.message || error.message);
    }
  };

  // Fetch user-specific orders
  const fetchUserOrders = async () => {
    if (!userId) {
      alert("Enter a User ID");
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/user/${userId}`);
      setUserOrders(res.data);
    } catch (error) {
      console.error("Error fetching user orders:", error.response?.data?.message || error.message);
    }
  };

  // Create a new order
  const createOrder = async () => {
    try {
      const res = await axios.post(API_BASE_URL, newOrder);
      alert("Order Created Successfully!");
      setNewOrder({ productId: "", userId: "", size: "", color: "" });
      fetchOrders();
    } catch (error) {
      console.error("Error creating order:", error.response?.data?.message || error.message);
    }
  };

  // Mark order as shipped
  const markAsShipped = async (orderId) => {
    try {
      await axios.put(`${API_BASE_URL}/${orderId}/ship`);
      alert("Order marked as shipped!");
      fetchOrders();
    } catch (error) {
      console.error("Error marking order as shipped:", error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchOrders(); // Load orders on page load
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">Order API Test Page</Typography>

      {/* Create Order Form */}
      <Typography variant="h6">Create Order</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Product ID" value={newOrder.productId} onChange={(e) => setNewOrder({ ...newOrder, productId: e.target.value })} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="User ID" value={newOrder.userId} onChange={(e) => setNewOrder({ ...newOrder, userId: e.target.value })} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth label="Size" value={newOrder.size} onChange={(e) => setNewOrder({ ...newOrder, size: e.target.value })} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth label="Color" value={newOrder.color} onChange={(e) => setNewOrder({ ...newOrder, color: e.target.value })} />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" fullWidth onClick={createOrder}>Create Order</Button>
        </Grid>
      </Grid>

      {/* Fetch All Orders (Admin) */}
      <Typography variant="h6" sx={{ mt: 4 }}>All Orders (Admin)</Typography>
      <Button variant="outlined" onClick={fetchOrders}>Refresh Orders</Button>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {orders.map((order) => (
          <Grid item xs={12} md={6} key={order._id}>
            <Card>
              <CardContent>
                <Typography>Order ID: {order._id}</Typography>
                <Typography>User ID: {order.userId}</Typography>
                <Typography>Product ID: {order.productId}</Typography>
                <Typography>Size: {order.size}</Typography>
                <Typography>Color: {order.color}</Typography>
                <Typography>Status: {order.status}</Typography>
                {order.status !== "Shipped" && (
                  <Button variant="contained" color="secondary" onClick={() => markAsShipped(order._id)}>Mark as Shipped</Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Fetch User Orders */}
      <Typography variant="h6" sx={{ mt: 4 }}>Get User Orders</Typography>
      <TextField fullWidth label="Enter User ID" value={userId} onChange={(e) => setUserId(e.target.value)} sx={{ mb: 2 }} />
      <Button variant="outlined" fullWidth onClick={fetchUserOrders}>Fetch User Orders</Button>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {userOrders.map((order) => (
          <Grid item xs={12} md={6} key={order._id}>
            <Card>
              <CardContent>
                <Typography>Order ID: {order._id}</Typography>
                <Typography>Product ID: {order.productId}</Typography>
                <Typography>Size: {order.size}</Typography>
                <Typography>Color: {order.color}</Typography>
                <Typography>Status: {order.status}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default OrderTestPage;
