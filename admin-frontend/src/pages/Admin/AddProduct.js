import React, { useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  IconButton,
  Chip,
  Collapse,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";

import CloseIcon from "@mui/icons-material/Close";

const AddProduct = () => {
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [imageSectionOpen, setImageSectionOpen] = useState(true); // Control for collapsible image section

  const [productData, setProductData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    images: [], // Ensure this is always an array
    imagePreview: null,
    sizes: [],
    colors: [],
  });

  const admintoken = localStorage.getItem("adminToken");
  const navigate = useNavigate();
  const categories = ["Men", "Women", "Kids"];

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    setProductData((prevData) => ({
      ...prevData,
      images: [...(prevData.images || []), ...files], // Ensure it's always an array
    }));
  };

  const handleRemoveImage = (index) => {
    setProductData((prevData) => ({
      ...prevData,
      images: prevData.images
        ? prevData.images.filter((_, i) => i !== index)
        : [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!admintoken) {
      console.error("No admin token found");
      navigate("/");
      return;
    }

    const formData = new FormData();
    formData.append("title", productData.title);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("category", productData.category);

    productData.images.forEach((image) => {
      formData.append("images", image); // Append each image
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/products/add",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Product added:", response.data);
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const addSize = () => {
    if (sizeInput && !productData.sizes.includes(sizeInput)) {
      setProductData({
        ...productData,
        sizes: [...productData.sizes, sizeInput],
      });
      setSizeInput("");
    }
  };

  const addColor = () => {
    if (colorInput && !productData.colors.includes(colorInput)) {
      setProductData({
        ...productData,
        colors: [...productData.colors, colorInput],
      });
      setColorInput("");
    }
  };
  // Function to handle color removal
  const removeColor = (colorToRemove) => {
    setProductData({
      ...productData,
      colors: productData.colors.filter((color) => color !== colorToRemove),
    });
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",

        padding: 3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
          border: "1px solid rgb(104, 104, 104)",
          boxShadow: "0px 12px 20px rgba(0, 0, 0, 0.88)",
          borderRadius: 2,
          background: "linear-gradient(90deg, #232526, #414345)",
          padding: 4,
        }}
      >
        <Typography variant="h4" color="gold" align="center" gutterBottom>
          Add Product
        </Typography>
        <Grid container spacing={4}>
          {/* Left side: Form to add product details */}
          <Grid item xs={12} sm={8}>
            <TextField
              label="Name"
              fullWidth
              name="name"
              value={productData.name}
              onChange={handleChange}
              required
              sx={{
                marginBottom: 2,
                "& label": { color: "gray" }, // Default label color
                "& label.Mui-focused": { color: "white" }, // Focused label color
                "& input": { color: "white" }, // User-typed text color
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ffd9008f" }, // Default border color
                },
              }}
            />
            <TextField
              label="Price"
              fullWidth
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              required
              sx={{
                marginBottom: 2,
                "& label": { color: "gray" }, // Default label color
                "& label.Mui-focused": { color: "white" }, // Focused label color
                "& input": { color: "white" }, // User-typed text color
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ffd9008f" }, // Default border color
                },
              }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              name="description"
              value={productData.description}
              onChange={handleChange}
              required
              sx={{
                marginBottom: 2,
                "& label": { color: "gray" }, // Default label color
                "& label.Mui-focused": { color: "white" }, // Focused label color
                "& input": { color: "white" }, // User-typed text color
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ffd9008f" }, // Default border color
                },
              }}
            />
            <TextField
              label="Category"
              fullWidth
              name="category"
              value={productData.category}
              onChange={handleChange}
              required
              sx={{
                marginBottom: 2,
                "& label": { color: "gray" }, // Default label color
                "& label.Mui-focused": { color: "white" }, // Focused label color
                "& input": { color: "white" }, // User-typed text color
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ffd9008f" }, // Default border color
                },
              }}
            />

            {/* Sizes Input */}
            <TextField
              label="Add Size"
              fullWidth
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSize()}
              sx={{
                marginBottom: 2,
                "& label": { color: "gray" }, // Default label color
                "& label.Mui-focused": { color: "white" }, // Focused label color
                "& input": { color: "white" }, // User-typed text color
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ffd9008f" }, // Default border color
                },
              }}
            />
            <Button
              onClick={addSize}
              sx={{
                bgcolor: "black",
                color: "white",
                fontWeight: "bold",
                "&:hover": { bgcolor: "gray", color: "black" },
                marginBottom: 2,
                "& label": { color: "gray" }, // Default label color
                "& label.Mui-focused": { color: "white" }, // Focused label color
                "& input": { color: "white" }, // User-typed text color
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ffd9008f" }, // Default border color
                },
              }}
              variant="contained"
              color="primary"
            >
              Add Size
            </Button>
            <Box sx={{ marginBottom: 2 }}>
              {productData.sizes.map((size) => (
                <Chip
                  key={size}
                  label={size}
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "gray",
                    p: 2,
                    color: "black",
                    margin: 0.5,
                  }}
                />
              ))}
            </Box>

            {/* Colors Input */}
            <TextField
              label="Add Color"
              fullWidth
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addColor()}
              sx={{
                marginBottom: 2,
                "& label": { color: "gray" }, // Default label color
                "& label.Mui-focused": { color: "white" }, // Focused label color
                "& input": { color: "white" }, // User-typed text color
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ffd9008f" }, // Default border color
                },
              }}
            />

            <Button
              onClick={addColor}
              variant="contained"
              sx={{
                marginBottom: 2,
                bgcolor: "black",
                color: "white",
                fontWeight: "bold",
                "&:hover": { bgcolor: "gray", color: "black" },
              }}
            >
              Add Color
            </Button>
            <Box sx={{ marginBottom: 2 }}>
              {productData.colors.map((color) => (
                <Chip
                  key={color}
                  label={color}
                  sx={{
                    fontWeight: "bold",
                    fontSize: 15,
                    backgroundColor: color, // Apply the color entered by the user as background
                    p: 1,
                    border: "1px solid rgba(255, 217, 0, 0.32)",
                    color: "black",
                    margin: 0.5,
                    position: "relative", // To position the close icon
                  }}
                  // Adding the delete icon
                  deleteIcon={
                    <DeleteIcon sx={{ color: "white", fontSize: 18 }} />
                  }
                  onDelete={() => removeColor(color)} // Calling the remove function
                />
              ))}
            </Box>
          </Grid>

          {/* Right side: Image Upload Section */}
          <Grid item xs={12} sm={4}>
            <IconButton
              onClick={() => setImageSectionOpen(!imageSectionOpen)}
              sx={{ position: "absolute", top: 16, right: 16 }}
            >
              <CloseIcon />
            </IconButton>
            <Collapse in={imageSectionOpen}>
              <Divider sx={{ marginBottom: 2 }} />
              <Typography variant="h6" color="white" gutterBottom>
                Product Images
              </Typography>

              {/* Display image previews */}
              {productData.images.length > 0 && (
                <Box sx={{ textAlign: "center", marginBottom: 2 }}>
                  {productData.images.map((image, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        display: "inline-block",
                        margin: "5px",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: 8,
                        }}
                      />
                      <IconButton
                        onClick={() => handleRemoveImage(index)}
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          background: "rgba(0,0,0,0.5)",
                          color: "white",
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}

              <input
                accept="image/png, image/jpeg, image/jpg"
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: "block", marginBottom: 2 }}
              />
            </Collapse>
          </Grid>
        </Grid>

        <Box sx={{ marginTop: 3 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "black",
              color: "white",
              fontWeight: "bold",
              "&:hover": { bgcolor: "gold", color: "black" },
            }}
            onClick={handleSubmit}
          >
            Add Product
          </Button>
        </Box>
      </Box>
    </Box></form>
  );
};

export default AddProduct;
