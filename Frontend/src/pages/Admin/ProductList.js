import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, Grid, LinearProgress, Box } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Product List
      </Typography>
      {loading && (
        <Box sx={{ width: "100%", mb: 2 }}>
          <LinearProgress color="primary" />
        </Box>
      )}
      <Grid container spacing={3}>
        {products.length === 0 ? (
          <Typography>No products available</Typography>
        ) : (
          products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card sx={{ width: 300, height: 500, display: "flex", flexDirection: "column", padding: "10px" }}>
                <Box sx={{ height: 350, width: "100%", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <img
                    src={`data:image/jpeg;base64,${product.image}`}
                    alt={product.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
                <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: 150, padding: "10px" }}>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ${product.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {product.description}
                  </Typography>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(product._id)}>
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default ProductList;