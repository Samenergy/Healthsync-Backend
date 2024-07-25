// controllers/queueController.js
import Queue from "../models/queue.js";
import { Patient } from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
export const getQueueForHospital = async (req, res) => {
  try {
    const queue = await Queue.findAll({
      include: {
        model: Patient,
        attributes: ["name", "gender", "dob", "contact"],
      },
    });

    res.status(200).json(queue);
  } catch (error) {
    console.error("Failed to fetch the queue data:", error);
    res.status(500).json({ message: "Failed to fetch the queue data" });
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
    // Fetch the doctor's specialty
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const doctorSpecialization = doctor.specialization;

    // Fetch queues where the doctor specialization matches the queue's doctor field
    const queues = await Queue.findAll({
      where: { doctor: doctorSpecialization },
      include: [
        {
          model: Patient,
          attributes: ["id", "name", "gender", "dob", "contact"], // Adjust attributes if necessary
        },
        {
          model: Doctor,
          attributes: [], // Exclude doctor attributes if not needed
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    if (queues.length === 0) {
      return res
        .status(404)
        .json({ message: "No patients found for this doctor." });
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
    const { services, status } = req.body;

    // Validate that services or status are provided
    if (!services && !status) {
      return res
        .status(400)
        .json({ message: "Please provide either services or status fields." });
    }

    // Find the queue entry by id
    const queueEntry = await Queue.findByPk(id);
    if (!queueEntry) {
      return res.status(404).json({ message: "Queue entry not found." });
    }

    // Update the queue entry
    if (services) {
      queueEntry.services = services;
      queueEntry.status = "in progress"; // Change status to 'in progress' if services is not null
    } else if (status) {
      queueEntry.status = status;
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
      return res.status(404).json({ message: "Queue entry not found for this patient." });
    }

    res.status(200).json(queueEntry);
  } catch (error) {
    console.error("Failed to fetch queue entry:", error);
    res.status(500).json({ message: "Failed to fetch queue entry" });
  }
};
