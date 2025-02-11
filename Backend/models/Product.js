import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    sizes: { type: [String], required: true }, // Array to store multiple sizes
    colors: { type: [String], required: true }, // Array to store multiple colors
    image: { type: String }, // Optional image for the product
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
