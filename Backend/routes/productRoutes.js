import express from "express";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { upload } from "../middleware/uploadMiddleware.js"; // ✅ Fix import

const router = express.Router();

router.post("/add", upload.single("image"), addProduct); // Admin: Add product with image
router.get("/", getProducts); // Users: Get all products
router.get("/:id", getProductById); // Users: Get single product
router.put("/:id", upload.single("image"), updateProduct); // Admin: Update product
router.delete("/:id", deleteProduct); // Admin: Delete product

export default router;
