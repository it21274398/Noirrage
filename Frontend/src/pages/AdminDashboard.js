import React, { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, Button, Grid, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);


  const token = localStorage.getItem("adminToken"); // Get token from localStorage

console.log(token)
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
      });
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const markAsShipped = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/shipped`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
      });
      fetchOrders(); // Refresh the list after updating
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" my={4}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout}>Logout</Button>
      </Box>

      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>Pending Orders</Typography>
      <Grid container spacing={2}>
        {orders.filter(order => order.status === "pending").map(order => (
          <Grid item xs={12} md={6} key={order._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">Order ID: {order._id}</Typography>
                <Typography>Customer: {order.customerName}</Typography>
                <Typography>Items: {order.items.length}</Typography>
                <Typography>Status: {order.status}</Typography>
                <Button variant="contained" color="primary" onClick={() => markAsShipped(order._id)} sx={{ mt: 2 }}>
                  Mark as Completed
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>Completed Orders</Typography>
      <Grid container spacing={2}>
        {orders.filter(order => order.status === "shipped").map(order => (
          <Grid item xs={12} md={6} key={order._id}>
            <Card sx={{ backgroundColor: "#f0f0f0" }}>
              <CardContent>
                <Typography variant="h6">Order ID: {order._id}</Typography>
                <Typography>Customer: {order.customerName}</Typography>
                <Typography>Items: {order.items.length}</Typography>
                <Typography>Status: {order.status}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
