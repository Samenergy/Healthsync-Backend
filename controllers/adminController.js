import bcrypt from 'bcryptjs';
import Hospital from '../models/hospital.js';
import Administrator from '../models/administrator.js';
import Doctor from '../models/Doctor.js';
import Nurse from '../models/Nurse.js';
import Receptionist from '../models/Receptionist.js';
import Cashier from '../models/Cashier.js';


export const signupAdminAndHospital = async (req, res) => {
  const {
    name = '', email = '', password = '', hospitalName = '', address = '', facilityType = '',
    phoneNumber = '', taxIdNumber = '', businessRegistrationNumber = '',
    country = '', province = '', district = '', sector = ''
  } = req.body;

  const { logo } = req.files || {};

  // Log the request body to debug
  console.log('Request body:', req.body);
  console.log('Request files:', req.files);

  try {
    // Check if email or address already exists
    const existingHospital = await Hospital.findOne({
      where: {
        email,
        address,
        businessRegistrationNumber,
        taxIdNumber,
        hospitalName,
      }
    });

    if (existingHospital) {
      throw new Error('Hospital with the same details already exists');
    }

    if (!password) {
      throw new Error('Password is required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const hospital = await Hospital.create({
      hospitalName, address, facilityType, email, phoneNumber,
      taxIdNumber, businessRegistrationNumber, country, province,
      district, sector, logo: logo ? logo.path : null
    });

    const admin = await Administrator.create({
      name, email, password: hashedPassword, hospitalId: hospital.hospitalId
    });

    res.status(201).json({
      message: 'Admin and hospital signed up successfully',
      admin: {
        id: admin.adminId,
        name: admin.name,
        email: admin.email
      },
      hospital: {
        id: hospital.hospitalId,
        name: hospital.hospitalName
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during signup', error: error.message });
  }
};

export const addUser = async (req, res) => {
  const { role, ...userData } = req.body;
  const { hospitalId } = req; // Fetch the hospital ID from the request context

  try {
    // Validate role and add user to the corresponding model
    let newUser;
    switch (role) {
      case 'Administrator':
        newUser = await Administrator.create({ ...userData, hospitalId });
        break;
      case 'Doctor':
        newUser = await Doctor.create({ ...userData, hospitalId });
        break;
      case 'Nurse':
        newUser = await Nurse.create({ ...userData, hospitalId });
        break;
      case 'Receptionist':
        newUser = await Receptionist.create({ ...userData, hospitalId });
        break;
      case 'Cashier':
        newUser = await Cashier.create({ ...userData, hospitalId });
        break;
      case 'Patient':
        newUser = await Patient.create({ ...userData, hospitalId });
        break;
      default:
        return res.status(400).json({ error: 'Invalid role' });
    }

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Failed to add user:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
};