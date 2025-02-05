import React, { useEffect, useState } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]); // ✅ Ensure array initialization

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders");
        console.log("Fetched Orders:", response.data); // ✅ Debugging
        setOrders(Array.isArray(response.data) ? response.data : []); // ✅ Ensure it's always an array
      } catch (error) {
        toast.error("Failed to fetch orders");
      }
    };
    fetchOrders();
  }, []);

  const handleMarkPaid = async (orderId) => {
    try {
      const token = localStorage.getItem("token"); // Ensure token is stored
      await axios.put(`http://localhost:5000/api/orders/${orderId}/pay`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, isPaid: true } : order
        )
      );
  
      toast.success("Order marked as paid");
    } catch (error) {
      console.error("Error marking order as paid:", error);
      toast.error(error.response?.data?.message || "Failed to mark order as paid");
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", padding: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        Orders
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.customerName || "Unknown"}</TableCell>
                  <TableCell>
                    {order?.items?.map((item) => (
                      <div key={item._id}>
                        {item.name} x {item.quantity}
                      </div>
                    )) || "No items"}
                  </TableCell>
                  <TableCell>{order.status || "Pending"}</TableCell>
                  <TableCell>
                    {order.status !== "Completed" && (
                     <Button variant="contained" color="primary" onClick={() => handleMarkPaid(order._id)}>
                     Mark as Paid
                   </Button>
                   
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Orders;
