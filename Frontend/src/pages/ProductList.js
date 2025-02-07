import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  LinearProgress,
  Box,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/products?page=${page}`
      );
      setProducts(response.data);
    } catch (error) {
      toast.error(error.response?.data.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/products/${id}`
      );
      toast.success(response.data.message);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data.message || "Error deleting product");
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
          <Typography></Typography>
        ) : (
          products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card>
                <img
                  src={`data:image/jpeg;base64,${product.image}`} // Handling Base64 image
                  alt={product.name}
                  style={{ width: "100%", height: "auto" }}
                />
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography>Price: ${product.price}</Typography>
                  <Typography>Stock: {product.stock}</Typography>
                  <Typography>{product.description}</Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(product._id)}
                  >
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
