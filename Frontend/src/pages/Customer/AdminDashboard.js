import { useState,useEffect } from "react";
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
  Box,
  Button,
  TextField,
  Card,
  CardContent,
} from "@mui/material";
import { Search as SearchIcon, ShoppingCart, Done, AttachMoney } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


// Sample Order Data
const orders = [
  { id: 1, email: "customer1@gmail.com", total: 120, status: "Pending" },
  { id: 2, email: "customer2@gmail.com", total: 250, status: "Completed" },
  { id: 3, email: "customer3@gmail.com", total: 80, status: "Pending" },
  { id: 4, email: "customer4@gmail.com", total: 300, status: "Completed" },
];

// Calculate Dashboard Stats
const totalOrders = orders.length;
const pendingOrders = orders.filter((o) => o.status === "Pending").length;
const completedOrders = orders.filter((o) => o.status === "Completed").length;
const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

// Graph Data
const revenueData = [
  { name: "Jan", revenue: 500 },
  { name: "Feb", revenue: 700 },
  { name: "Mar", revenue: 900 },
  { name: "Apr", revenue: 800 },
];

const orderBreakdown = [
  { name: "Pending", value: pendingOrders },
  { name: "Completed", value: completedOrders },
];

const COLORS = ["#FFBB28", "#00C49F"];


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
    <Container  maxWidth={false}>
      {/* Title */}
      <Typography variant="h4" sx={{ my: 2, fontWeight: "bold", color: "#1976d2" }}>
        Admin Dashboard
      </Typography>

      {/* Overview Cards */}
      <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
        <Card sx={{ flex: 1, bgcolor: "#f5f5f5", textAlign: "center", p: 2, boxShadow: 3 }}>
          <CardContent>
            <ShoppingCart sx={{ fontSize: 40, color: "#1976d2" }} />
            <Typography variant="h6">Total Orders</Typography>
            <Typography variant="h5">{totalOrders}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, bgcolor: "#ffeb3b", textAlign: "center", p: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6">Pending Orders</Typography>
            <Typography variant="h5">{pendingOrders}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, bgcolor: "#4caf50", textAlign: "center", p: 2, color: "white", boxShadow: 3 }}>
          <CardContent>
            <Done sx={{ fontSize: 40 }} />
            <Typography variant="h6">Completed Orders</Typography>
            <Typography variant="h5">{completedOrders}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, bgcolor: "#2196f3", textAlign: "center", p: 2, color: "white", boxShadow: 3 }}>
          <CardContent>
            <AttachMoney sx={{ fontSize: 40 }} />
            <Typography variant="h6">Total Revenue</Typography>
            <Typography variant="h5">${totalRevenue}</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Graphs Section */}
      <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
        {/* Revenue Graph */}
        <Card sx={{ flex: 2, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Revenue Over Time
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Orders Pie Chart */}
        <Card sx={{ flex: 1, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Order Breakdown
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={orderBreakdown} cx="50%" cy="50%" outerRadius={60} fill="#8884d8" dataKey="value">
                {orderBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Box>

      {/* Search Bar */}
      <Box sx={{ display: "flex", alignItems: "center", width: "100%", mb: 2 }}>
        <SearchIcon sx={{ color: "#1976d2", mr: 1 }} />
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
              "&:focus-within": { boxShadow: "0 0 8px rgba(25, 118, 210, 0.9)" },
            },
          }}
        />
      </Box>

      {/* Pending Orders Table */}
      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
        Pending Orders
      </Typography>
      <TableContainer component={Paper} sx={{ marginBottom: "70px", boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell>Customer Email</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.filter((o) => o.status === "Pending").map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.email}</TableCell>
                <TableCell>${order.total}</TableCell>
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
