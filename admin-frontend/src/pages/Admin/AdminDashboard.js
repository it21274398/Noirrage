import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) => {
    const emailMatch = order.shippingDetails.email
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const priceMatch = order.totalPrice
      .toString()
      .includes(searchTerm.toLowerCase());

    return order.status === "Shipped" && (emailMatch || priceMatch);
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/orders/all",
        {}
      );
      setOrders(data);
    } catch (error) {
      console.error(
        "Error fetching orders:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const markAsShipped = async (orderId) => {
    const token = localStorage.getItem("adminToken"); // Fetch token

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
      fetchOrders();
      toast.success("Marked");
    } catch (error) {
      console.error(
        "Error updating order:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 1 }}>
        Admin Dashboard
      </Typography>

      {/* Pending Orders Table */}
      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
        Pending Orders
      </Typography>
      <TableContainer component={Paper} sx={{ marginBottom: "70px" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell>Customer Email</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Contact No</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders
              .filter((order) => order.status === "Pending")
              .map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.shippingDetails.email}</TableCell>
                  {order.products?.map((item) => (
                    <Box>
                      <img
                        alt={item.product?.name}
                        src={`http://localhost:5000${item.product?.image}`}
                        style={{
                          maxHeight: "100px",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                  ))}
                  <TableCell>{order.products[0]?.quantity }</TableCell>
                  <TableCell>{order.shippingDetails.address}</TableCell>
                  <TableCell>{order.shippingDetails.contactNumber}</TableCell>
                  <TableCell>{order.products[0]?.size}</TableCell>
                  <TableCell>{order.products[0]?.color}</TableCell>
                  <TableCell>${order.totalPrice}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => markAsShipped(order._id)}
                    >
                      Completed
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Search Bar */}
      <Box sx={{ display: "flex", alignItems: "center", width: "100%", mb: 2 }}>
        <SearchIcon sx={{ color: "#1976d2", mr: 1 }} /> {/* Blue search icon */}
        <TextField
          fullWidth
          label="Search by Email or Price"
          variant="outlined"
          size="small"
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            transition: "0.3s",
            "&:hover": { boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)" },
            "& .MuiOutlinedInput-root": {
              "&:focus-within": { boxShadow: "0 0 8pxrgba(25, 118, 210, 0.9)" },
            },
          }}
        />
      </Box>

      {/* Completed Orders Table */}
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Completed Orders
      </Typography>
      <TableContainer component={Paper} sx={{ marginBottom: "100px" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell>Customer Email</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Total Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.shippingDetails.email}</TableCell>
                  {order.products?.map((item) => (
                    <Box>
                      <img
                        alt={item.product?.name}
                        src={`http://localhost:5000${item.product?.image}`}
                        style={{
                          maxHeight: "100px",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                  ))}
                  <TableCell>{order.products[0]?.quantity || "N/A"}</TableCell>
                  <TableCell>{order.shippingDetails.address}</TableCell>
                  <TableCell>{order.products[0]?.size || "N/A"}</TableCell>
                  <TableCell>{order.products[0]?.color || "N/A"}</TableCell>
                  <TableCell>${order.totalPrice}</TableCell>
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
    </Container>
  );
};

export default AdminDashboard;
