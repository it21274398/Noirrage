import Order from "../models/order.js"
import Product from "../models/Product.js";
import User from '../models/user.js';
import jwt from 'jsonwebtoken';


// ✅ Create a new order
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Reduce stock for each product
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        if (product.stock < item.qty) {
          return res.status(400).json({ message: `Not enough stock for ${product.name}` });
        }
        product.stock -= item.qty; // Reduce stock
        await product.save();
      }
    }

    const order = new Order({
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid: false,
      isDelivered: false,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

// ✅ Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

// ✅ Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("orderItems.product", "name price stock image");

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error: error.message });
  }
};

// ✅ Cancel Order & Restore Stock
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Restore stock for each product in the order
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.qty; // Restore stock
        await product.save();
      }
    }

    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order cancelled and stock restored" });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling order", error: error.message });
  }
};

// ✅ Mark order as Paid
export const markAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating payment status", error: error.message });
  }
};

// ✅ Mark order as Delivered
export const markAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = new Date();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating delivery status", error: error.message });
  }
};


export const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header contains a Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract the token from the header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);

      // Find the user from the token payload
      req.user = await User.findById(decoded.id).select("-password");
      console.log("Authenticated User:", req.user);

      // If no user is found, return an error
      if (!req.user) {
        return res.status(401).json({ message: "User not found. Token is invalid or expired." });
      }

      // Proceed to the next middleware
      next();
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      return res.status(401).json({ message: "Unauthorized access. Invalid token." });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized access. Token missing." });
  }
};


// Admin middleware to check if the user is an admin
export const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized, admin privileges required' });
    }
};
