import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products/");
      setProducts(response.data);
    } catch (error) {
      toast.error(error.response?.data.message || "Error fetching products");
    }
  };

  const handleOrderNow = (product) => {
    setSelectedProduct(product);
    navigate("/CustomerOrder");
  };

  const handleBuyNow = () => {
    setOpen(false);
    navigate("/order", { state: { product: selectedProduct, size, color } });
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Product List
      </Typography>
      <Grid container spacing={3}>
        {products.length === 0 ? (
          <Typography>No products available</Typography>
        ) : (
          products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card sx={{ maxWidth: 345, padding: "10px" }}>
                <img
                  src={`data:image/jpeg;base64,${product.image}`} // Handling Base64 image
                  alt={product.name}
                  style={{ width: "100%", height: "auto" }}
                />
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ${product.price}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {product.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => handleOrderNow(product)}
                  >
                    Order Now
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
