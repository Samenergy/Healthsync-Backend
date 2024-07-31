import express from "express";
import upload from "../config/multer.js";
import {
  getUserData,
  updateUserProfile,
  changeUserPassword,
  getAllPatients,
  getPatientById,
  addPatient,
  addMedicalRecord,
  getPatientMedicalRecords,
  updateMedicalRecord,
  updateHospitalInfo,
  allUsers,
  getMedicalRecordById,
  getInProgressRecords,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// User-related routes
router.get("/data", authMiddleware, getUserData);
router.put(
  "/:userType/:userId",
  authMiddleware,
  upload.fields([
    { name: "picture", maxCount: 1 },
    { name: "hospital_logo", maxCount: 1 },
  ]),
  updateUserProfile
);
router.put("/change-password", authMiddleware, changeUserPassword);

// Patient-related routes
router.get("/patients", authMiddleware, getAllPatients);
router.post("/patients", authMiddleware, addPatient);
router.get("/patients/:id", authMiddleware, getPatientById);

// Medical record-related routes
router.post("/records", authMiddleware, addMedicalRecord);
router.put("/records/:recordId", authMiddleware, getMedicalRecordById);
router.put("/records/:recordId", authMiddleware, updateMedicalRecord);
router.get("/records/:patientId", authMiddleware, getPatientMedicalRecords);
router.get('/in-progress',authMiddleware ,getInProgressRecords);
router.put(
  "/hospital/:hospitalId",
  authMiddleware,
  upload.fields([{ name: "logo", maxCount: 1 }]),
  updateHospitalInfo
);
router.get("/hospital/:hospitalId/users", authMiddleware, allUsers);
export default router;
