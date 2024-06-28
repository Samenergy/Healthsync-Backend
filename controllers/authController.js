import jwt from 'jsonwebtoken';
import Administrator from '../models/administrator.js';

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the administrator exists
    const admin = await Administrator.findOne({ where: { email } });

    // If administrator not found or password is invalid
    if (!admin || !admin.validPassword(password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token with administrator's id, email, and role
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'administrator' }, // Adjust 'role' based on your application logic
      'your_secret_key',
      {
        expiresIn: '1h', // Example expiration time
      }
    );

    // Respond with the generated token and administrator's role
    res.json({ token, user: { id: admin.id, email: admin.email, role: 'administrator' } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { login };
