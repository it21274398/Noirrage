import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  cancelOrder,
  payOrder,
  markAsDelivered,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";


const router = express.Router();


router.post("/add", createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.delete("/:id/cancel", cancelOrder);
router.put("/:id/pay", protect, admin, payOrder);
router.put("/:id/deliver", markAsDelivered);

export default router;
