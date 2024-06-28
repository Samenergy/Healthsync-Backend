import express from 'express';
import { signupAdminAndHospital } from '../controllers/adminController.js';
import { addUser } from '../controllers/adminController.js';
const router = express.Router();

router.post('/signup', signupAdminAndHospital);
router.post('/users', addUser);
export default router;
