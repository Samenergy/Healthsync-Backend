import express from "express";
import { signupAdminAndHospital } from "../controllers/adminController.js";
import { addUser, Checkuser } from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getAdminAndHospitalData,
  updateAdminAndHospitalData,
  changeAdminPassword,
} from "../controllers/adminController.js";

const router = express.Router();
router.get("/admin-data", authMiddleware, getAdminAndHospitalData);
router.put("/admin-data", authMiddleware, updateAdminAndHospitalData);
router.post("/change-password", authMiddleware, changeAdminPassword);

router.post("/signup", signupAdminAndHospital);
router.post("/add-user", authMiddleware, addUser);
router.post("/check-user", authMiddleware, Checkuser);
export default router;
