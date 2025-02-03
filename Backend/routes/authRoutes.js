import express from "express";
import { registerAdmin, loginAdmin } from "../controllers/authController.js";

const router = express.Router();

router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);

export default router;
