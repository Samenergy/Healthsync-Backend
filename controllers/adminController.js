import bcrypt from "bcryptjs";
import Hospital from "../models/hospital.js";
import Administrator from "../models/administrator.js";
import Doctor from "../models/Doctor.js";
import Nurse from "../models/Nurse.js";
import Receptionist from "../models/Receptionist.js";
import Cashier from "../models/Cashier.js";

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

  // Log the request body to debug
  console.log("Request body:", req.body);
  console.log("Request files:", req.files);

  try {
    // Check if email or address already exists
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
  } = req.body; // Extract password and responsibilities from req.body
  const { hospitalId } = req; // Fetch the hospital ID from the request context

  try {
    let newUser;
    switch (role) {
      case "Administrator":
        newUser = await Administrator.create({
          ...userData,
          password,
          hospitalId,
        });
        break;
      case "Doctor":
        newUser = await Doctor.create({
          ...userData,
          password,
          hospitalId,
          specialization,
        });
        break;
      case "Nurse":
        newUser = await Nurse.create({
          ...userData,
          password,
          hospitalId,
          field,
        });
        break;
      case "Receptionist":
        newUser = await Receptionist.create({
          ...userData,
          password,
          hospitalId,
          responsibilities,
        }); // Include responsibilities for Receptionist
        break;
      case "Cashier":
        newUser = await Cashier.create({
          ...userData,
          password,
          hospitalId,
          responsibilities,
        }); // Include responsibilities for Cashier
        break;
      case "Patient":
        newUser = await Patient.create({ ...userData, password, hospitalId });
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

    // Check in all models for the existence of the email
    const userExists = await Promise.any([
      Administrator.findOne({ where: { email } }),
      Doctor.findOne({ where: { email } }),
      Nurse.findOne({ where: { email } }),
      Receptionist.findOne({ where: { email } }),
      Cashier.findOne({ where: { email } }),
      Hospital.findOne({ where: { email } }) // If you want to include Hospital as well
    ]);

    if (userExists) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const getAdminAndHospitalData = async (req, res) => {
  try {
    const admin = req.admin; // Retrieved from authMiddleware
    if (!admin) {
      return res.status(401).json({ error: "Admin not found" });  // Handle missing admin
    }

    const hospital = await Hospital.findByPk(admin.hospitalId);
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });  // Handle missing hospital
    }

    res.status(200).json({
      admin: {
        id: admin.adminId,
        name: admin.name,
        email: admin.email,
        picture: admin.picture,
      },
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
  } catch (error) {
    console.error("Failed to get admin and hospital data:", error);
    res.status(500).json({ error: "Failed to get admin and hospital data" });
  }
};

export const updateAdminAndHospitalData = async (req, res) => {
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
    const admin = req.admin; // Retrieved from authMiddleware
    const adminPicture = req.file && req.file.fieldname === 'admin_picture' ? req.file : null;
    const hospitalLogo = req.files && req.files['hospital_logo'] ? req.files['hospital_logo'][0] : null;

    // Update admin details
    if (email) {
      await Administrator.update(
        { email },
        { where: { adminId: admin.adminId } }
      );
    }
    if (name) {
      await Administrator.update(
        { name },
        { where: { adminId: admin.adminId } }
      );
    }
    if (adminPicture) {
      // Assuming you save the file to a specific path and store that path in the database
      await Administrator.update(
        { picture: `/uploads/admin/${adminPicture.filename}` },
        { where: { adminId: admin.adminId } }
      );
    }

    // Update hospital details
    const hospital = await Hospital.findByPk(admin.hospitalId);

    if (hospitalName) hospital.hospitalName = hospitalName;
    if (address) hospital.address = address;
    if (facilityType) hospital.facilityType = facilityType;
    if (phoneNumber) hospital.phoneNumber = phoneNumber;
    if (taxIdNumber) hospital.taxIdNumber = taxIdNumber;
    if (businessRegistrationNumber) hospital.businessRegistrationNumber = businessRegistrationNumber;
    if (country) hospital.country = country;
    if (province) hospital.province = province;
    if (district) hospital.district = district;
    if (sector) hospital.sector = sector;
    if (hospitalLogo) {
      // Assuming you save the file to a specific path and store that path in the database
      hospital.logo = `/uploads/hospital/${hospitalLogo.filename}`;
    }

    await hospital.save();

    res
      .status(200)
      .json({ message: "Admin and hospital data updated successfully" });
  } catch (error) {
    console.error("Failed to update admin and hospital data:", error);
    res.status(500).json({ error: "Failed to update admin and hospital data" });
  }
};


export const changeAdminPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const admin = req.admin; // Retrieved from authMiddleware

    // Check if the old password is correct
    const isMatch = await bcrypt.compare(oldPassword, admin.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    // Hash the new password and update it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Administrator.update(
      { password: hashedPassword },
      { where: { adminId: admin.adminId } }
    );

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Failed to change admin password:", error);
    res.status(500).json({ error: "Failed to change admin password" });
  }
};
