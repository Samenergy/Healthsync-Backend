import bcrypt from "bcrypt";
import Hospital from "../models/hospital.js";
import Administrator from "../models/administrator.js";
import Doctor from "../models/Doctor.js";
import Nurse from "../models/Nurse.js";
import Receptionist from "../models/Receptionist.js";
import Cashier from "../models/Cashier.js";
import { Patient } from "../models/Patient.js";

export const signupAdminAndHospital = async (req, res) => {
  const {
    name = "",
    email = "",
    password = "",
    hospitalName = "",
    address = "",
    facilityType = "",
    phoneNumber = "",
    taxIdNumber = "",
    businessRegistrationNumber = "",
    country = "",
    province = "",
    district = "",
    sector = "",
  } = req.body;

  const { logo } = req.files || {};

  try {
    // Check if hospital already exists
    const existingHospital = await Hospital.findOne({
      where: {
        email,
        address,
        businessRegistrationNumber,
        taxIdNumber,
        hospitalName,
      },
    });

    if (existingHospital) {
      throw new Error("Hospital with the same details already exists");
    }

    if (!password) {
      throw new Error("Password is required");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const hospital = await Hospital.create({
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
      logo: logo ? logo.path : null,
    });

    const admin = await Administrator.create({
      name,
      email,
      password: hashedPassword,
      hospitalId: hospital.hospitalId,
    });

    res.status(201).json({
      message: "Admin and hospital signed up successfully",
      admin: {
        id: admin.adminId,
        name: admin.name,
        email: admin.email,
      },
      hospital: {
        id: hospital.hospitalId,
        name: hospital.hospitalName,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred during signup",
      error: error.message,
    });
  }
};

export const addUser = async (req, res) => {
  const {
    role,
    password,
    responsibilities,
    field,
    specialization,
    ...userData
  } = req.body;
  const { hospitalId } = req.user; // Fetch the hospital ID from the request context

  try {
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // Check if the email already exists
    const existingUser = await Promise.any([
      Administrator.findOne({ where: { email: userData.email } }),
      Doctor.findOne({ where: { email: userData.email } }),
      Nurse.findOne({ where: { email: userData.email } }),
      Receptionist.findOne({ where: { email: userData.email } }),
      Cashier.findOne({ where: { email: userData.email } }),
      Patient.findOne({ where: { email: userData.email } }),
    ]);

    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    switch (role) {
      case "Administrator":
        newUser = await Administrator.create({
          ...userData,
          password: hashedPassword,
          hospitalId,
        });
        break;
      case "Doctor":
        newUser = await Doctor.create({
          ...userData,
          password: hashedPassword,
          hospitalId,
          specialization,
        });
        break;
      case "Nurse":
        newUser = await Nurse.create({
          ...userData,
          password: hashedPassword,
          hospitalId,
          field,
        });
        break;
      case "Receptionist":
        newUser = await Receptionist.create({
          ...userData,
          password: hashedPassword,
          hospitalId,
          responsibilities,
        });
        break;
      case "Cashier":
        newUser = await Cashier.create({
          ...userData,
          password: hashedPassword,
          hospitalId,
          responsibilities,
        });
        break;
      case "Patient":
        newUser = await Patient.create({
          ...userData,
          password: hashedPassword,
          hospitalId,
        });
        break;
      default:
        return res.status(400).json({ error: "Invalid role" });
    }

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Failed to add user:", error);
    res.status(500).json({ error: "Failed to add user" });
  }
};

export const Checkuser = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email exists in any user role
    const userExists = await Promise.any([
      Administrator.findOne({ where: { email } }),
      Doctor.findOne({ where: { email } }),
      Nurse.findOne({ where: { email } }),
      Receptionist.findOne({ where: { email } }),
      Cashier.findOne({ where: { email } }),
      Patient.findOne({ where: { email } }),
    ]);

    if (userExists) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
