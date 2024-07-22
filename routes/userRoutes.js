// routes/userRoutes.js
import express from "express";
import multer from "multer";
import {
  getUserData,
  updateUserData,
  changeUserPassword,
  getAllPatients,
  getPatientById,
  addPatient,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/data", authMiddleware, getUserData); // Auth middleware applied here
router.put(
  "/update",
  authMiddleware,
  upload.fields([
    { name: "user_picture", maxCount: 1 },
    { name: "hospital_logo", maxCount: 1 },
  ]),
  updateUserData
); // Auth middleware applied here
router.put("/change-password", authMiddleware, changeUserPassword);
router.post("/patients", authMiddleware, addPatient); // Auth middleware applied here
router.get("/patients", authMiddleware, getAllPatients); // No auth middleware applied here (public route)
router.get("/patients/:id", authMiddleware, getPatientById); // No auth middleware applied here (public route)

export default router;