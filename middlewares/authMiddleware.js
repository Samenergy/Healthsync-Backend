
import jwt from 'jsonwebtoken';
import { models } from '../models/index.js';

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await models[decoded.role.charAt(0).toUpperCase() + decoded.role.slice(1)].findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = { ...user.toJSON(), role: decoded.role }; // Include role in the user object
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default authMiddleware;
