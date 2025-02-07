import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import PopupModal from "./PopupModal"; // Import the modal component

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
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
    setOpen(true); // Open the pop-up
  };

  const handleClose = () => {
    setOpen(false);
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
              <Card sx={{ width: 300, height: 400, display: "flex", flexDirection: "column", padding: "10px" }}>
                <Box
                  sx={{
                    height: 200,
                    width: "100%",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={`data:image/jpeg;base64,${product.image}`}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "calc(100% - 200px)",
                    padding: "10px",
                  }}
                >
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ${product.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
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

      {/* Pop-up component */}
      <PopupModal open={open} handleClose={handleClose} product={selectedProduct} />
    </Box>
  );
};

export default ProductList;
