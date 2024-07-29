import express from "express";
import {
  generateReports,
  doctorPerformanceReport,
  serviceUtilizationReport,
  financialReport,
  queueManagementReport,
  patientDemographicsReport,
} from "../controllers/reportController.js";

const router = express.Router();

router.get("/generate", generateReports);
router.get("/doctor-performance", doctorPerformanceReport);
router.get("/service-utilization", serviceUtilizationReport);
router.get("/financial", financialReport);
router.get("/queue-management", queueManagementReport);
router.get("/patient-demographics", patientDemographicsReport);

export default router;
