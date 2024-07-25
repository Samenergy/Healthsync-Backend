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
  addMedicalRecord,
  getPatientMedicalRecords,
  updateMedicalRecord,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/data", authMiddleware, getUserData);
router.put(
  "/update",
  authMiddleware,
  upload.fields([
    { name: "user_picture", maxCount: 1 },
    { name: "hospital_logo", maxCount: 1 },
  ]),
  updateUserData
); 
router.put("/change-password", authMiddleware, changeUserPassword);
router.post("/patients", authMiddleware, addPatient);
router.get("/patients", authMiddleware, getAllPatients);
router.get("/patients/:id", authMiddleware, getPatientById);
router.post("/records", authMiddleware, addMedicalRecord);
router.put("/records/:recordId", authMiddleware, updateMedicalRecord);
router.get("/records/:patientId", authMiddleware, getPatientMedicalRecords);

export default router;
