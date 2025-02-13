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
    image: null,
    imagePreview: null,
    sizes: [],
    colors: [],
  });

  const admintoken = localStorage.getItem("adminToken");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    e.preventDefault();

    if (!admintoken) {
      console.error("No admin token found");
      navigate("/"); 
      return;
    }

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
          border:"1px solid rgb(104, 104, 104)",
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
              sx={{ bgcolor: "black",
                color: "white",
                fontWeight: "bold",
                "&:hover": { bgcolor: "gray",color: "black"},
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
                <Chip  key={size} label={size} sx={{ fontWeight: "bold", backgroundColor:"gray",p:2, color:"black",margin: 0.5 }} />
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
                Product Image
              </Typography>
              {productData.imagePreview && (
                <Box sx={{ textAlign: "center", marginBottom: 2 }}>
                  <img
                    src={productData.imagePreview}
                    alt="Preview"
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                </Box>
              )}
              <input
                accept="image/png, image/jpeg, image/jpg"
                type="file"
                onChange={handleFileChange}
                sx={{ marginBottom: 2 }}
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
              "&:hover": { bgcolor: "gold",color: "black"},
            }}
            onClick={handleSubmit}
          >
            Add Product
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddProduct;
