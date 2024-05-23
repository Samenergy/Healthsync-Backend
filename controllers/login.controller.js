import signupModel from "../models/signup.model.js";
import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';

const login = async (req, res) => {
  try {
    // Check if userModel import is valid
    if (!userModel) {
      throw new Error('User model import failed');
    }

    const { email, password, role } = req.body;

    // Validation: Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find the user in the database
    const user = await signupModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare passwords (if needed)
    // const passwordMatch = await bcrypt.compare(password, user.password);
    // if (!passwordMatch) {
    //   return res.status(401).json({ message: 'Invalid email or password.' });
    // }

    console.log('User role:', user.role);

    // Generate JWT token
    console.log('JWT_SECRET:', process.env.SECRET);
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET, { expiresIn: '1h' });

    // Send token and user data in response
    res.json({ message: 'Login successful!', token, user });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export default login;
