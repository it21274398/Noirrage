import Product from "../models/Product.js";

// @desc   Add a new product (Admin only)
export const addProduct = async (req, res) => {
  try {
    const { name, price, description, category, colors, sizes } = req.body;
    const image = req.file ? req.file.buffer.toString("base64") : null; // Convert image to Base64

    if (
      !name ||
      !price ||
      !description ||
      !category ||
      !image ||
      !colors ||
      !sizes
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create new product with Base64 image
    const newProduct = new Product({
      name,
      price,
      description,
      category,
      image,
      colors,
      sizes,
    });
    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Update a product (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, colors, sizes } = req.body;
    const image = req.file ? req.file.buffer.toString("base64") : null; // Convert image to Base64

    const updatedFields = { name, price, description, category, colors, sizes };
    if (image) updatedFields.image = image; // Only update image if provided

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

// @desc   Delete a product (Admin only)
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