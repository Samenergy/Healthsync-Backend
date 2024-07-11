import jwt from 'jsonwebtoken';
import { models } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await models.Administrator.findOne({
      where: { email },
      include: {
        model: models.Hospital,
        attributes: ['hospitalId', 'hospitalName']
      }
    });

    if (!admin || !admin.validPassword(password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: admin.adminId, email: admin.email, role: 'administrator' },
      process.env.JWT_SECRET,  
      { expiresIn: '1h' }
    );
    res.json({
      token,
      user: {
        id: admin.adminId,
        email: admin.email,
        role: 'administrator',
        hospitalId: admin.Hospital.hospitalId,
        hospitalName: admin.Hospital.hospitalName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { login };