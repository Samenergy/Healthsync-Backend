// controllers/queueController.js
import Queue from "../models/queue.js";
import { Patient } from "../models/Patient.js";

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
