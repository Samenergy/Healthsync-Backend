import express from 'express';
import { signupAdminAndHospital, addUser, Checkuser } from '../controllers/adminController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/signup', signupAdminAndHospital);
router.post('/add-user', authMiddleware, addUser); 
router.post('/check-user', authMiddleware, Checkuser); 

export default router;
