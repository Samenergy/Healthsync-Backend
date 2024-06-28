import express from 'express';
import { signupAdminAndHospital } from '../controllers/adminController.js';
const router = express.Router();

router.post('/signup', signupAdminAndHospital);

export default router;
