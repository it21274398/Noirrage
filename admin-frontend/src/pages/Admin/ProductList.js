import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box, LinearProgress } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
    } catch (error) {
      toast.error("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch {
      toast.error("Error deleting product");
    }
  };

  return (
    <Box maxWidth="lg" sx={{mx:17, my:5,borderRadius:"20px", padding: "40px", backgroundColor: "#121212", color: "#fff" }}>
      <Typography variant="h5" gutterBottom>
        Product List
      </Typography>
      {loading && (
        <Box sx={{ width: "100%", mb: 2 }}>
          <LinearProgress color="primary" />
        </Box>
      )}
      <TableContainer component={Paper} sx={{ backgroundColor: "#1E1E1E" }}>
        <Table>
          <TableHead>
            <TableRow sx={{fontSize:"2rem", color: "black" ,backgroundColor: "gray" }}>
            <TableCell sx={{ fontSize: "1.3rem", textAlign: "center" }}>Image</TableCell>
              <TableCell sx={{ fontSize: "1.3rem", textAlign: "center" }}>Name</TableCell>
              <TableCell sx={{ fontSize: "1.3rem", textAlign: "center" }}>Price</TableCell>
              <TableCell sx={{ fontSize: "1.3rem", textAlign: "center" }}>Description</TableCell>
              <TableCell sx={{ fontSize: "1.3rem", textAlign: "center" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: "#fff" }}>
                  No products available
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product._id} sx={{ backgroundColor: "4d4d4dc9", color: "#fff" }}>
                  <TableCell>
                    <img
                      src={`http://localhost:5000${product.image}`}
                      alt={product.name}
                      style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px" }}
                    />
                  </TableCell>
                  <TableCell sx={{fontSize:"1.2rem", color: "#fff" }}>{product.name}</TableCell>
                  <TableCell sx={{fontSize:"1.2rem", color: "#fff" }}>${product.price}</TableCell>
                  <TableCell sx={{fontSize:"1.2rem", color: "#fff" }}>{product.description}</TableCell>
                  <TableCell>
                   
                    <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      marginLeft: 3,
                      bgcolor: "red",
                      color: "black",
                      fontWeight: "bold",
                      "&:hover": { bgcolor: "black",color:"white" },
                    }}
                    onClick={() =>handleDelete(product._id)}
                  >
                    Remove <DeleteIcon />
                  </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductList;