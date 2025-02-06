import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, default: 1 },
        size: { type: String, required: true },
        color: { type: String, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Shipped"], default: "Pending" },
    shippingDetails: {
      email: { type: String, required: true },
      address: { type: String, required: true },
      contactNumber: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
