import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        size: { type: String, required: true }, // Store the selected size
        color: { type: String, required: true }, // Store the selected color
        //image: { type: String }, // Optional image for the product
      },
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Shipped"], default: "Pending" },
    shippingDetails: {
      email: { type: String, required: true },
      address: { type: String, required: true },
      contactNumber: { type: String, required: true },
    },
    shippedAt: { type: Date }, // Date when the order was shipped
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
