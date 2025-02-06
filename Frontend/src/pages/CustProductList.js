import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Box, Button, Modal, Select, MenuItem } from "@mui/material";
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
    setOpen(true);  // Open modal
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
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {product.description}
                  </Typography>
                  <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={() => handleOrderNow(product)}>
                    Order Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Order Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 400, backgroundColor: "white", margin: "auto", padding: 3, marginTop: 10, borderRadius: 2 }}>
          <Typography variant="h6">Order Product</Typography>
          {selectedProduct && (
            <>
              <img src={selectedProduct.image} alt={selectedProduct.name} width="100%" height="200px" style={{ marginTop: "10px" }} />
              <Typography variant="h6">{selectedProduct.name}</Typography>
              <Typography>Price: ${selectedProduct.price}</Typography>
              <Typography>Select Size:</Typography>
              <Select value={size} onChange={(e) => setSize(e.target.value)} fullWidth>
                <MenuItem value="S">Small</MenuItem>
                <MenuItem value="M">Medium</MenuItem>
                <MenuItem value="L">Large</MenuItem>
              </Select>
              <Typography>Select Color:</Typography>
              <Select value={color} onChange={(e) => setColor(e.target.value)} fullWidth>
                <MenuItem value="Red">Red</MenuItem>
                <MenuItem value="Blue">Blue</MenuItem>
                <MenuItem value="Black">Black</MenuItem>
              </Select>
              <Button variant="contained" color="secondary" fullWidth sx={{ mt: 2 }} onClick={handleBuyNow}>
                Buy Now
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ProductList;
