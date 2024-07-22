import bcrypt from "bcrypt";
import { models } from "../models/index.js";
import path from "path";
import { Patient } from "../models/Patient.js";
import { ValidationError as SequelizeValidationError } from "sequelize";
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

export const updateUserData = async (req, res) => {
  const {
    name,
    email,
    hospitalName,
    address,
    facilityType,
    phoneNumber,
    taxIdNumber,
    businessRegistrationNumber,
    country,
    province,
    district,
    sector,
  } = req.body;

  try {
    const user = req.user; // Retrieved from authMiddleware
    const userPicture =
      req.file && req.file.fieldname === "user_picture" ? req.file : null;
    const hospitalLogo =
      req.files && req.files["hospital_logo"]
        ? req.files["hospital_logo"][0]
        : null;

    // Update user details
    if (email) {
      await models[
        user.role.charAt(0).toUpperCase() + user.role.slice(1)
      ].update({ email }, { where: { id: user.id } });
    }
    if (name) {
      await models[
        user.role.charAt(0).toUpperCase() + user.role.slice(1)
      ].update({ name }, { where: { id: user.id } });
    }
    if (userPicture) {
      await models[
        user.role.charAt(0).toUpperCase() + user.role.slice(1)
      ].update(
        { picture: `/uploads/user/${userPicture.filename}` },
        { where: { id: user.id } }
      );
    }

    if (user.role === "administrator") {
      // Update hospital details
      const hospital = await models.Hospital.findByPk(user.hospitalId);

      if (!hospital) {
        return res.status(404).json({ error: "Hospital not found" });
      }

      if (hospitalName) hospital.hospitalName = hospitalName;
      if (address) hospital.address = address;
      if (facilityType) hospital.facilityType = facilityType;
      if (phoneNumber) hospital.phoneNumber = phoneNumber;
      if (taxIdNumber) hospital.taxIdNumber = taxIdNumber;
      if (businessRegistrationNumber)
        hospital.businessRegistrationNumber = businessRegistrationNumber;
      if (country) hospital.country = country;
      if (province) hospital.province = province;
      if (district) hospital.district = district;
      if (sector) hospital.sector = sector;
      if (hospitalLogo) {
        hospital.logo = `/uploads/hospital/${hospitalLogo.filename}`;
      }

      await hospital.save();
    }

    res
      .status(200)
      .json({ message: "User and hospital data updated successfully" });
  } catch (error) {
    console.error("Failed to update user and hospital data:", error);
    res.status(500).json({ error: "Failed to update user and hospital data" });
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