import Product from "../models/Product.js";

// ✅ Add a new product with image upload and sizes/colors handling
export const addProduct = async (req, res) => {
  try {
    const { name, price, description, category, sizes, colors } = req.body;

    if (!name || !price || !description || !category || !sizes || !colors) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Convert sizes and colors to arrays
    const sizesArray = Array.isArray(sizes) ? sizes : sizes.split(",");
    const colorsArray = Array.isArray(colors) ? colors : colors.split(",");

    // Handle multiple images
    const imageUrls = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const newProduct = new Product({
      name,
      price,
      description,
      category,
      sizes: sizesArray,
      colors: colorsArray,
      images: imageUrls,
    });

    await newProduct.save();
    return res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all products (with sizes and colors)
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get single product (with sizes and colors)
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Update a product (Admin only), including size and color updates
export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, colors, sizes } = req.body;

    // Convert sizes and colors to arrays
    const sizesArray = Array.isArray(sizes) ? sizes : sizes.split(",");
    const colorsArray = Array.isArray(colors) ? colors : colors.split(",");

    // Handle multiple images
    const imageUrls = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const updatedFields = {
      name,
      price,
      description,
      category,
      colors: colorsArray,
      sizes: sizesArray,
    };
    if (imageUrls.length) updatedFields.images = imageUrls;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });
    res
      .status(200)
      .json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete a product (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
