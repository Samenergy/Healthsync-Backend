import express from 'express';
import { login, logout } from '../controllers/authController.js'; // Adjust the path as necessary

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);

export default router;
