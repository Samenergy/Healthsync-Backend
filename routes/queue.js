// routes/queueRoutes.js
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getQueueForHospital,
  addToQueue,
  deleteFromQueue,
  doctorsPatients,
  getAssurance,
  editQueueEntry,
  getQueueEntryById,
  getQueueByPatientId,
  getInProgressQueue,
  completedQueue,
  getCompletedQueueForHospital,
} from "../controllers/queueController.js";

const router = express.Router();

router.get("/", authMiddleware, getQueueForHospital);
router.get("/inprogress", authMiddleware, getInProgressQueue);
router.post("/add", authMiddleware, addToQueue);
router.delete("/:id", authMiddleware, deleteFromQueue);
router.get("/doctor/:doctorId", authMiddleware, doctorsPatients);
router.get("/assurance/:patientId", authMiddleware, getAssurance);
router.put("/edit/:id", authMiddleware, editQueueEntry);
router.get("/:id", authMiddleware, getQueueEntryById);
router.get("/patient/:patientId", authMiddleware, getQueueByPatientId);
router.patch("/:id/done", authMiddleware, completedQueue);
router.get('/completed', getCompletedQueueForHospital);
export default router;
