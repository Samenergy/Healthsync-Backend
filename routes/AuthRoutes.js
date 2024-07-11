import express from 'express';
import { login } from '../controllers/authController.js'; // Adjust import path as necessary

const router = express.Router();

// Define the login route
router.post('/login', login);

export default router;
