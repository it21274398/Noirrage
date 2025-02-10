import Product from "../models/Product.js";

// ✅ Add a new product with image upload
export const addProduct = async (req, res) => {
  try {
    console.log("Received Body:", req.body); // ✅ Debugging
    console.log("Received File:", req.file); // ✅ Debugging

    const { name, price, description, category, sizes, colors } = req.body;

    if (!name || !price || !description || !category || !sizes || !colors) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Ensure sizes and colors are arrays
    const sizesArray = Array.isArray(sizes) ? sizes : sizes.split(",");
    const colorsArray = Array.isArray(colors) ? colors : colors.split(",");

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = new Product({
      name,
      price,
      description,
      category,
      sizes: sizesArray,
      colors: colorsArray,
      image: imageUrl,
    });

    await newProduct.save();
    return res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error); // ✅ Log error
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Update a product (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, colors, sizes } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const updatedFields = { name, price, description, category, colors: colors.split(","), sizes: sizes.split(",") };
    if (imageUrl) updatedFields.image = imageUrl;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
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
