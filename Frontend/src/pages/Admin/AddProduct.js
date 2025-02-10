import React, { useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: null,
    imagePreview: null,
    sizes: [],
    colors: [],
  });
  const admintoken = localStorage.getItem("adminToken"); // Get token from localStorage
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle multiple selections for sizes and colors
    if (name === "sizes" || name === "colors") {
      setProductData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setProductData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setProductData((prevData) => ({
        ...prevData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    } else {
      toast.error("Only PNG, JPG, and JPEG files are allowed.");
    }
  };

  const handleSubmit = async (e) => {
    //if token not found redirect to admin login
    if (!admintoken) {
      console.error("No admin token found");
      navigate("/admin/login"); // Redirect if no token
      return;
    }
    e.preventDefault();

    if (!productData.image) {
      toast.error("Please upload a product image.");
      return;
    }

    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (key !== "imagePreview") formData.append(key, value);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/products/add",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success(response.data.message);
      navigate("/admin/ProductList");
    } catch (error) {
      toast.error(error.response?.data.message || "Error adding product");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "0 auto",
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Add Product
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              name="name"
              value={productData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Price"
              variant="outlined"
              fullWidth
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              name="description"
              value={productData.description}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={productData.category}
                onChange={handleChange}
              >
                {["Electronics", "Clothing", "Furniture"].map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Sizes Selection */}
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Sizes</InputLabel>
              <Select
                name="sizes"
                multiple
                value={productData.sizes}
                onChange={handleChange}
              >
                {["S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Colors Selection */}
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Colors</InputLabel>
              <Select
                name="colors"
                multiple
                value={productData.colors}
                onChange={handleChange}
              >
                {["Black", "Gray", "White"].map((color) => (
                  <MenuItem key={color} value={color}>
                    {color}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <input
              accept="image/png, image/jpeg, image/jpg"
              type="file"
              onChange={handleFileChange}
              required
            />
          </Grid>
          {productData.imagePreview && (
            <Grid item xs={12}>
              <img
                src={productData.imagePreview}
                alt="Preview"
                style={{ width: "100%", borderRadius: 8, marginTop: 10 }}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Add Product
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddProduct;
