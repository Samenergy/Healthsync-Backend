import { Op } from "sequelize";
import Queue from "../models/queue.js";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import sequelize from "../config/database.js";
import Doctor from "../models/Doctor.js";
import { Patient } from "../models/Patient.js";
const generateReports = async (req, res) => {
  try {
    const today = new Date();

    // Common include and where clause to avoid repetition
    const include = ["Patient", "Doctor", "Hospital"];
    const whereClause = (startDate, endDate) => ({
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
      doctorId: {
        [Op.ne]: null,
      },
    });

    // Daily Report
    const dailyReport = await Queue.findAll({
      where: whereClause(startOfDay(today), endOfDay(today)),
      include,
    });

    // Weekly Report
    const weeklyReport = await Queue.findAll({
      where: whereClause(startOfWeek(today), endOfWeek(today)),
      include,
    });

    // Monthly Report
    const monthlyReport = await Queue.findAll({
      where: whereClause(startOfMonth(today), endOfMonth(today)),
      include,
    });

    res.status(200).json({ dailyReport, weeklyReport, monthlyReport });
  } catch (error) {
    console.error("Failed to generate reports:", error);
    res.status(500).json({ error: "Failed to generate reports" });
  }
};

const doctorPerformanceReport = async (req, res) => {
  try {
    const doctorReports = await Queue.findAll({
      attributes: [
        "doctorId",
        [
          sequelize.fn("COUNT", sequelize.col("Queue.doctorId")),
          "patientCount",
        ],
      ],
      include: [
        {
          model: Doctor,
          attributes: [
            "doctorId",
            "name",
            "specialization",
            "email",
            "phoneNumber",
          ],
        },
      ],
      group: ["Queue.doctorId", "Doctor.doctorId"],
      having: sequelize.where(
        sequelize.fn("COUNT", sequelize.col("Queue.doctorId")),
        ">",
        0
      ),
    });

    const formattedReports = doctorReports.map((report) => {
      const doctor = report.Doctor || {};
      return {
        doctorId: doctor.doctorId || "N/A",
        name: doctor.name || "N/A",
        specialization: doctor.specialization || "N/A",
        email: doctor.email || "N/A",
        phoneNumber: doctor.phoneNumber || "N/A",
        patientCount: report.getDataValue("patientCount"),
      };
    });

    res.status(200).json(formattedReports);
  } catch (error) {
    console.error("Failed to generate doctor performance report:", error);
    res
      .status(500)
      .json({ error: "Failed to generate doctor performance report" });
  }
};

const serviceUtilizationReport = async (req, res) => {
  try {
    // Fetch all records from Queue
    const queues = await Queue.findAll({
      attributes: ["services"],
    });

    // Initialize an object to keep track of service counts
    const serviceCounts = {};

    // Process each queue record
    queues.forEach((queue) => {
      const services = queue.services || [];
      services.forEach((service) => {
        if (service) {
          if (!serviceCounts[service]) {
            serviceCounts[service] = 0;
          }
          serviceCounts[service]++;
        }
      });
    });

    // Convert the serviceCounts object into an array of objects
    const formattedReport = Object.entries(serviceCounts)
      .map(([service, count]) => ({
        service,
        serviceCount: count,
      }))
      .filter(({ serviceCount }) => serviceCount > 0); // Filter out services with count 0

    res.status(200).json(formattedReport);
  } catch (error) {
    console.error("Failed to generate service utilization report:", error);
    res
      .status(500)
      .json({ error: "Failed to generate service utilization report" });
  }
};

const financialReport = async (req, res) => {
  try {
    const revenueReport = await Queue.findAll({
      attributes: [
        [
          sequelize.fn("SUM", sequelize.json("amounts.Patient")),
          "totalPatientAmount",
        ],
        [
          sequelize.fn("SUM", sequelize.json("amounts.Assurance")),
          "totalAssuranceAmount",
        ],
      ],
    });

    res.status(200).json(revenueReport);
  } catch (error) {
    console.error("Failed to generate financial report:", error);
    res.status(500).json({ error: "Failed to generate financial report" });
  }
};

const queueManagementReport = async (req, res) => {
  try {
    const avgWaitTimeReport = await Queue.findAll({
      attributes: [
        [
          sequelize.fn(
            "AVG",
            sequelize.fn(
              "TIMESTAMPDIFF",
              sequelize.literal("SECOND"),
              sequelize.col("createdAt"),
              sequelize.col("updatedAt")
            )
          ),
          "avgWaitTime",
        ],
      ],
    });

    res.status(200).json(avgWaitTimeReport);
  } catch (error) {
    console.error("Failed to generate queue management report:", error);
    res
      .status(500)
      .json({ error: "Failed to generate queue management report" });
  }
};

const patientDemographicsReport = async (req, res) => {
  try {
    const genderReport = await Queue.findAll({
      attributes: [
        [sequelize.col("Patient.gender"), "gender"],
        [sequelize.fn("COUNT", sequelize.col("Patient.gender")), "genderCount"],
      ],
      group: ["Patient.gender"],
      include: [
        {
          model: Patient,
          attributes: [], // Exclude other attributes from Patient model
        },
      ],
    });

    res.status(200).json(genderReport);
  } catch (error) {
    console.error("Failed to generate patient demographics report:", error);
    res
      .status(500)
      .json({ error: "Failed to generate patient demographics report" });
  }
};

export {
  generateReports,
  doctorPerformanceReport,
  serviceUtilizationReport,
  financialReport,
  queueManagementReport,
  patientDemographicsReport,
};
