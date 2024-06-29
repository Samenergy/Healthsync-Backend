import express from "express";
import { signupAdminAndHospital } from "../controllers/adminController.js";
import { addUser } from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/signup", signupAdminAndHospital);
router.post("/add-user", authMiddleware, addUser);
export default router;
