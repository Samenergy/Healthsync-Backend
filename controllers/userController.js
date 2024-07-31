import bcrypt from "bcrypt";
import { models } from "../models/index.js";
import { Patient } from "../models/Patient.js";
import { MedicalRecord } from "../models/MedicalRecord.js";
import { ValidationError as SequelizeValidationError } from "sequelize";
import { Medication } from "../models/Medication.js";
import { MedicalRecordImage } from "../models/MedicalRecordImage.js";
import multer from "multer";
import path from "path";

const { Administrator, Doctor, Nurse, Receptionist, Cashier } = models;

export const allUsers = async (req, res) => {
  const { hospitalId } = req.params;

  try {
    // Fetch all users related to the hospital
    const [administrators, doctors, nurses, receptionists, cashiers] =
      await Promise.all([
        Administrator.findAll({ where: { hospitalId } }),
        Doctor.findAll({ where: { hospitalId } }),
        Nurse.findAll({ where: { hospitalId } }),
        Receptionist.findAll({ where: { hospitalId } }),
        Cashier.findAll({ where: { hospitalId } }),
      ]);

    // Combine all users into one array
    const allUsers = {
      administrators,
      doctors,
      nurses,
      receptionists,
      cashiers,
    };

    res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserData = async (req, res) => {
  try {
    const user = req.user; // Retrieved from authMiddleware

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Prepare user data
    let userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      role: user.role,
    };

    // Fetch hospital details based on user role
    const hospital = await models.Hospital.findByPk(user.hospitalId, {
      attributes: [
        "hospitalId",
        "hospitalName",
        "address",
        "facilityType",
        "email",
        "phoneNumber",
        "taxIdNumber",
        "businessRegistrationNumber",
        "country",
        "province",
        "district",
        "sector",
        "logo",
      ],
    });

    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    // Return different responses based on user role
    if (user.role === "administrator") {
      res.status(200).json({
        user: { ...userData, id: user.adminId }, // Assuming adminId is the field for Administrator
        hospital: {
          id: hospital.hospitalId,
          name: hospital.hospitalName,
          address: hospital.address,
          facilityType: hospital.facilityType,
          email: hospital.email,
          phoneNumber: hospital.phoneNumber,
          taxIdNumber: hospital.taxIdNumber,
          businessRegistrationNumber: hospital.businessRegistrationNumber,
          country: hospital.country,
          province: hospital.province,
          district: hospital.district,
          sector: hospital.sector,
          logo: hospital.logo,
        },
      });
    } else if (user.role === "cashier") {
      res.status(200).json({
        user: { ...userData, id: user.cashierId }, // Assuming cashierId is the field for Cashier
        hospital: {
          id: hospital.hospitalId,
          name: hospital.hospitalName,
          logo: hospital.logo,
          facilityType: hospital.facilityType,
        },
      });
    } else if (user.role === "doctor") {
      res.status(200).json({
        user: { ...userData, id: user.doctorId }, // Assuming doctorId is the field for Doctor
        hospital: {
          id: hospital.hospitalId,
          name: hospital.hospitalName,
          logo: hospital.logo,
          facilityType: hospital.facilityType,
        },
      });
    } else if (user.role === "nurse") {
      res.status(200).json({
        user: { ...userData, id: user.nurseId }, // Assuming nurseId is the field for Nurse
        hospital: {
          id: hospital.hospitalId,
          name: hospital.hospitalName,
          logo: hospital.logo,
          facilityType: hospital.facilityType,
        },
      });
    } else if (user.role === "receptionist") {
      res.status(200).json({
        user: { ...userData, id: user.receptionistId }, // Assuming receptionistId is the field for Receptionist
        hospital: {
          id: hospital.hospitalId,
          name: hospital.hospitalName,
          logo: hospital.logo,
          facilityType: hospital.facilityType,
        },
      });
    } else {
      res.status(200).json({
        user: userData,
        hospital: {
          id: hospital.hospitalId,
          name: hospital.hospitalName,
          logo: hospital.logo,
          facilityType: hospital.facilityType,
        },
      });
    }
  } catch (error) {
    console.error("Failed to get user data:", error);
    res.status(500).json({ error: "Failed to get user data" });
  }
};

export const updateUserProfile = async (req, res) => {
  const { userType, userId } = req.params;
  const {
    name,
    email,
    phoneNumber,
    password,
    specialization,
    field,
    responsibilities,
  } = req.body;

  // Get the model based on userType
  const model = models[userType.charAt(0).toUpperCase() + userType.slice(1)];

  if (!model) return res.status(400).json({ message: "Invalid user type" });

  try {
    const user = await model.findByPk(userId);
    if (!user)
      return res.status(404).json({ message: `${userType} not found` });

    // Update user fields dynamically
    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (password) user.password = await bcrypt.hash(password, 10);

    // Handle file uploads
    if (req.files) {
      if (req.files.picture) {
        const picturePath = path.join("uploads", req.files.picture[0].filename);
        user.picture = picturePath; // Save the path to the profile picture
      }
      if (req.files.hospital_logo) {
        const logoPath = path.join(
          "uploads",
          req.files.hospital_logo[0].filename
        );
        user.hospitalLogo = logoPath; // Save the path to the hospital logo
      }
    }

    if (specialization && user.specialization !== undefined)
      user.specialization = specialization;
    if (field && user.field !== undefined) user.field = field;
    if (responsibilities && user.responsibilities !== undefined)
      user.responsibilities = responsibilities;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user profile", error });
  }
};

export const updateHospitalInfo = async (req, res) => {
  const { hospitalId } = req.params;
  const {
    hospitalName,
    address,
    facilityType,
    email,
    phoneNumber,
    taxIdNumber,
    businessRegistrationNumber,
    country,
    province,
    district,
    sector,
  } = req.body;

  try {
    // Check if the user is an administrator
    const admin = await models.Administrator.findByPk(req.user.id);
    if (!admin) {
      return res.status(403).json({
        message:
          "Access denied. Only administrators can update hospital information.",
      });
    }

    // Find the hospital by ID
    const hospital = await models.Hospital.findByPk(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Update hospital fields dynamically
    if (hospitalName) hospital.hospitalName = hospitalName;
    if (address) hospital.address = address;
    if (facilityType) hospital.facilityType = facilityType;
    if (email) hospital.email = email;
    if (phoneNumber) hospital.phoneNumber = phoneNumber;
    if (taxIdNumber) hospital.taxIdNumber = taxIdNumber;
    if (businessRegistrationNumber)
      hospital.businessRegistrationNumber = businessRegistrationNumber;
    if (country) hospital.country = country;
    if (province) hospital.province = province;
    if (district) hospital.district = district;
    if (sector) hospital.sector = sector;

    // Handle file uploads for hospital logo
    if (req.files && req.files.logo) {
      const logoPath = path.join("uploads", req.files.logo[0].filename);
      hospital.logo = logoPath; // Save the path to the hospital logo
    }

    await hospital.save();
    res.json(hospital);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating hospital information", error });
  }
};

// Change User Password
export const changeUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = req.user; // Retrieved from authMiddleware

    // Check if the old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    // Hash the new password and update it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await models[user.role.charAt(0).toUpperCase() + user.role.slice(1)].update(
      { password: hashedPassword },
      { where: { id: user.id } }
    );

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Failed to change user password:", error);
    res.status(500).json({ error: "Failed to change user password" });
  }
};

// Get All Patients

export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll();
    res.json(patients);
  } catch (error) {
    console.error("Failed to get all patients:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addPatient = async (req, res) => {
  try {
    const {
      name,
      dob,
      gender,
      bloodtype,
      contact,
      emergencyContact,
      allergies,
      insurance,
      email,
    } = req.body;

    // Validate required fields
    if (!name || !dob || !gender) {
      return res
        .status(400)
        .json({ error: "Name, Date of Birth, and Gender are required." });
    }

    // Check if a patient with the same name, dob, and gender already exists
    const existingPatient = await Patient.findOne({
      where: {
        name,
        dob,
        gender,
      },
    });

    if (existingPatient) {
      return res.status(409).json({
        error:
          "Patient with the same name, Date of Birth, and Gender already exists.",
      });
    }

    // Create a new patient record
    const newPatient = await Patient.create({
      name,
      dob,
      gender,
      bloodtype,
      contact,
      emergencyContact,
      allergies,
      insurance,
      email,
    });

    // Respond with the created patient data
    return res.status(201).json(newPatient);
  } catch (error) {
    // Handle specific Sequelize validation error for unique constraint
    if (error instanceof SequelizeValidationError) {
      const uniqueEmailError = error.errors.find((e) => e.path === "email");
      if (uniqueEmailError) {
        return res.status(409).json({ error: "Email already in use." });
      }
    }

    // Log the error for debugging
    console.error("Error adding patient:", error);

    // Respond with a generic internal server error
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const getPatientById = async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await Patient.findByPk(id);

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error("Failed to get patient by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

export const addMedicalRecord = async (req, res) => {
  try {
    const {
      patientId,
      date,
      description,
      status,
      disease,
      details,
      notes,
      height,
      weight,
      bmi,
      bloodPressure,
      immunizations,
      insurance,
      socialHistory,
      doctorname, // Added field
      Hospitalname, // Added field
      medications, // Array of medication objects
      images, // Array of image objects
    } = req.body;

    // Check if patient exists
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Create a new medical record
    const newRecord = await MedicalRecord.create({
      patientId,
      date,
      description,
      status,
      disease,
      details,
      notes,
      height,
      weight,
      bmi,
      bloodPressure,
      immunizations,
      insurance,
      socialHistory,
      doctorname,
      Hospitalname,
    });

    // Add related medications
    if (medications && medications.length > 0) {
      await Promise.all(
        medications.map((medication) =>
          Medication.create({ ...medication, medicalRecordId: newRecord.id })
        )
      );
    }

    // Add related images
    if (images && images.length > 0) {
      await Promise.all(
        images.map((image) =>
          MedicalRecordImage.create({ ...image, medicalRecordId: newRecord.id })
        )
      );
    }

    res.status(201).json(newRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create medical record" });
  }
};

export const getPatientMedicalRecords = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Fetch all medical records for the patient
    const records = await MedicalRecord.findAll({
      where: { patientId },
      include: [
        {
          model: Medication,
          attributes: ["id", "medication"],
        },
        {
          model: MedicalRecordImage,
          attributes: ["id", "image"], // Include relevant image attributes
        },
      ],
      attributes: [
        "id",
        "date",
        "description",
        "status",
        "disease",
        "details",
        "notes",
        "height",
        "weight",
        "bmi",
        "bloodPressure",
        "immunizations",
        "insurance",
        "socialHistory",
        "doctorname",
        "Hospitalname",
      ],
    });

    if (records.length === 0) {
      return res
        .status(404)
        .json({ message: "No medical records found for this patient" });
    }

    res.status(200).json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve medical records" });
  }
};
export const updateMedicalRecord = async (req, res) => {
  try {
    const { recordId } = req.params; // ID of the record to be updated
    const {
      date,
      description,
      status,
      disease,
      details,
      notes,
      height,
      weight,
      bmi,
      bloodPressure,
      immunizations,
      insurance,
      socialHistory,
      doctorname,
      Hospitalname,
      medications, // Array of medication text strings
      images, // Array of image objects
    } = req.body;

    // Find the medical record by ID
    const medicalRecord = await MedicalRecord.findByPk(recordId);

    if (!medicalRecord) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    // Update the medical record
    await medicalRecord.update({
      date,
      description,
      status,
      disease,
      details,
      notes,
      height,
      weight,
      bmi,
      bloodPressure,
      immunizations,
      insurance,
      socialHistory,
      doctorname,
      Hospitalname,
    });

    // Update related medications
    if (medications && medications.length > 0) {
      // Delete existing medications for this record
      await Medication.destroy({ where: { medicalRecordId: recordId } });

      // Add new medications
      await Promise.all(
        medications.map(async (medication) => {
          await Medication.create({
            medicalRecordId: recordId,
            medication,
          });
        })
      );
    }

    // Update related images
    if (images && images.length > 0) {
      await Promise.all(
        images.map(async (image) => {
          if (image.id) {
            const existingImage = await MedicalRecordImage.findOne({
              where: { medicalRecordId: recordId, id: image.id },
            });

            if (existingImage) {
              await existingImage.update(image);
            } else {
              await MedicalRecordImage.create({
                ...image,
                medicalRecordId: recordId,
              });
            }
          } else {
            await MedicalRecordImage.create({
              ...image,
              medicalRecordId: recordId,
            });
          }
        })
      );
    }

    res.status(200).json({ message: "Medical record updated successfully" });
  } catch (error) {
    console.error("Error updating medical record:", error);
    res.status(500).json({ message: "Failed to update medical record" });
  }
};

export const getMedicalRecordById = async (req, res) => {
  const { id } = req.params;

  try {
    const medicalRecord = await MedicalRecord.findOne({
      where: { id },
      include: [{ model: Medication }, { model: MedicalRecordImage }],
    });

    if (!medicalRecord) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    res.json(medicalRecord);
  } catch (error) {
    console.error("Error fetching medical record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
