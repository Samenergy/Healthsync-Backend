// routes/queueRoutes.js
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getQueueForHospital, addToQueue, deleteFromQueue, doctorsPatients } from '../controllers/queueController.js';

const router = express.Router();

router.get('/', authMiddleware, getQueueForHospital); 
router.post('/add', authMiddleware, addToQueue); 
router.delete('/:id', authMiddleware, deleteFromQueue); 
router.get('/doctor/:doctorId', authMiddleware, doctorsPatients);
export default router;
