import Order from "../models/order.js";
import Product from "../models/Product.js";

// @desc   Create a new order
export const createOrder = async (req, res) => {
  try {
    const { products, totalPrice, shippingDetails } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products selected" });
    }

    if (!shippingDetails || !shippingDetails.email || !shippingDetails.address || !shippingDetails.contactNumber) {
      return res.status(400).json({ message: "Shipping details are required" });
    }
    const newOrder = new Order({
      user: req.user._id, // Assuming authentication middleware sets req.user
      products,
      totalPrice,
      shippingDetails,
      status: "Pending"
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get all orders (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").populate("products.product", "name price");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("products.product", "name price");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// @desc   Mark order as "Shipped" (Admin only)
export const markOrderShipped = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "Shipped";
    await order.save();

    res.status(200).json({ message: "Order marked as shipped", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
