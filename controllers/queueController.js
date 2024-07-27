// controllers/queueController.js
import Queue from "../models/queue.js";
import { Patient } from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
// controllers/queueController.js

export const getQueueForHospital = async (req, res) => {
  const { hospitalId } = req.params;

  try {
    const waitingQueue = await Queue.findAll({
      where: {
        status: "waiting",
        hospitalId: hospitalId,
      },
      include: {
        model: Patient,
        attributes: ["name", "gender", "dob", "contact"],
      },
    });

    res.status(200).json(waitingQueue);
  } catch (error) {
    console.error("Failed to fetch the waiting queue data:", error);
    res.status(500).json({ message: "Failed to fetch the waiting queue data" });
  }
};

// controllers/queueController.js

export const getInProgressQueue = async (req, res) => {
  const { hospitalId } = req.params;

  try {
    if (!hospitalId) {
      return res.status(400).json({ message: "Hospital ID is required" });
    }

    const inProgressQueue = await Queue.findAll({
      where: {
        status: "in progress",
        hospitalId,
      },
      include: {
        model: Patient,
        attributes: ["name", "gender", "dob", "contact"],
      },
    });

    res.status(200).json(inProgressQueue);
  } catch (error) {
    console.error("Failed to fetch the in-progress queue data:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch the in-progress queue data" });
  }
};

export const getCompletedQueueForHospital = async (req, res) => {
  const { hospitalId } = req.params;

  try {
    if (!hospitalId) {
      return res.status(400).json({ message: "Hospital ID is required" });
    }

    const completedQueues = await Queue.findAll({
      where: {
        hospitalId,
        status: "completed",
      },
      include: {
        model: Patient,
        attributes: ["name", "gender", "dob", "contact"],
      },
    });

    return res.status(200).json(completedQueues);
  } catch (error) {
    console.error("Error fetching completed queues:", error);
    return res
      .status(500)
      .json({ message: "Error fetching completed queues", error });
  }
};

export const addToQueue = async (req, res) => {
  try {
    const { patientId, doctor, assurance, hospitalId } = req.body;

    // Validate that required fields are provided
    if (!patientId || !doctor || !assurance || !hospitalId) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    // Create a new queue entry
    const queueEntry = await Queue.create({
      patientId,
      doctor,
      assurance,
      hospitalId, // Make sure this field is included
    });

    res.status(201).json(queueEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add patient to the queue" });
  }
};

export const deleteFromQueue = async (req, res) => {
  const { id } = req.params;

  try {
    await Queue.destroy({ where: { id } });
    res.status(204).send(); // Successfully deleted
  } catch (error) {
    console.error("Failed to delete queue entry:", error);
    res.status(500).json({ message: "Failed to delete queue entry" });
  }
};
export const doctorsPatients = async (req, res) => {
  const doctorId = req.params.doctorId;

  try {
    // Fetch the doctor and its associated hospital ID
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const doctorSpecialization = doctor.specialization;
    const hospitalId = doctor.hospitalId; // Fetch the hospital ID from the doctor record

    // Fetch queues where the doctor's specialization matches and hospitalId matches
    const queues = await Queue.findAll({
      where: {
        doctor: doctorSpecialization,
        status: "waiting",
        hospitalId: hospitalId, // Filter by hospital ID
      },
      include: [
        {
          model: Patient,
          attributes: ["id", "name", "gender", "dob", "contact"],
        },
        {
          model: Doctor,
          attributes: [],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    if (queues.length === 0) {
      return res
        .status(404)
        .json({
          message:
            "No waiting patients found for this doctor in the same hospital.",
        });
    }

    res.status(200).json(queues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAssurance = async (req, res) => {
  try {
    const { patientId } = req.params;
    const queue = await Queue.findOne({
      where: { patientId },
      attributes: ["assurance"],
    });

    if (!queue) {
      return res
        .status(404)
        .json({ message: "Queue entry not found for this patient." });
    }

    res.status(200).json({ assurance: queue.assurance });
  } catch (error) {
    console.error("Error fetching assurance:", error);
    res.status(500).json({ message: "Failed to fetch assurance" });
  }
};
export const editQueueEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { services, status, doctorId } = req.body;

    // Validate that at least one field is provided
    if (!services && !status && !doctorId) {
      return res.status(400).json({
        message:
          "Please provide at least one of services, status, or doctorId fields.",
      });
    }

    // Find the queue entry by id
    const queueEntry = await Queue.findByPk(id);
    if (!queueEntry) {
      return res.status(404).json({ message: "Queue entry not found." });
    }

    // Update the queue entry
    if (services) {
      queueEntry.services = services;
      queueEntry.status = "in progress"; // Change status to 'in progress' if services are provided
    } else if (status) {
      queueEntry.status = status;
    }

    if (doctorId) {
      queueEntry.doctorId = doctorId;
    }

    await queueEntry.save();

    res.status(200).json(queueEntry);
  } catch (error) {
    console.error("Failed to edit queue entry:", error);
    res.status(500).json({ message: "Failed to edit queue entry" });
  }
};

export const getQueueEntryById = async (req, res) => {
  try {
    const { id } = req.params;
    const queueEntry = await Queue.findByPk(id, {
      include: {
        model: Patient,
        attributes: ["name", "gender", "dob", "contact"],
      },
    });

    if (!queueEntry) {
      return res.status(404).json({ message: "Queue entry not found." });
    }

    res.status(200).json(queueEntry);
  } catch (error) {
    console.error("Failed to fetch queue entry:", error);
    res.status(500).json({ message: "Failed to fetch queue entry" });
  }
};

export const getQueueByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const queueEntry = await Queue.findOne({
      where: { patientId },
      include: {
        model: Patient,
        attributes: ["name", "gender", "dob", "contact"],
      },
    });

    if (!queueEntry) {
      return res
        .status(404)
        .json({ message: "Queue entry not found for this patient." });
    }

    res.status(200).json(queueEntry);
  } catch (error) {
    console.error("Failed to fetch queue entry:", error);
    res.status(500).json({ message: "Failed to fetch queue entry" });
  }
};

export const completedQueue = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the queue item
    const queueItem = await Queue.findByPk(id);

    if (!queueItem) {
      return res.status(404).json({ message: "Queue item not found" });
    }

    // Update the status to "completed"
    queueItem.status = "completed";

    // Update amounts field if provided
    if (req.body.amounts) {
      queueItem.amounts = req.body.amounts;
    }

    // Save changes
    await queueItem.save();

    // Return updated queue item including amounts
    res.status(200).json({
      message: "Queue item status updated to completed",
      queueItem: {
        id: queueItem.id,
        status: queueItem.status,
        amounts: queueItem.amounts,
      },
    });
  } catch (error) {
    console.error("Error updating queue status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
