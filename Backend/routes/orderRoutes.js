import express from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  markOrderShipped,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder); // Create an order
router.get("/", protect, getUserOrders); // Get logged-in user's orders
router.get("/all", protect, admin, getAllOrders); // Admin: Get all orders
router.put("/:id/ship", protect, admin, markOrderShipped);// Admin: Mark order as shipped
export default router;
