import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    sizes: { type: [String], required: true },
    colors: { type: [String], required: true },
    image: { type: String }, // ✅ Made optional
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
