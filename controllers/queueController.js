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
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const doctorSpecialization = doctor.specialization;

    // Fetch queues where the doctor specialization matches the queue's doctor field
    const queues = await Queue.findAll({
      where: { doctor: doctorSpecialization },
      include: [
        {
          model: Patient,
          attributes: ['id', 'name', 'gender', 'dob', 'contact'], // Adjust attributes if necessary
        },
        {
          model: Doctor,
          attributes: [], // Exclude doctor attributes if not needed
        }
      ],
      order: [['createdAt', 'ASC']],
    });

    if (queues.length === 0) {
      return res.status(404).json({ message: 'No patients found for this doctor.' });
    }

    res.status(200).json(queues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
