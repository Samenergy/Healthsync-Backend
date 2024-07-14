// routes/queueRoutes.js
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getQueueForHospital, addToQueue, deleteFromQueue } from '../controllers/queueController.js';

const router = express.Router();

router.get('/', authMiddleware, getQueueForHospital); // Auth middleware applied here
router.post('/add', authMiddleware, addToQueue); // Auth middleware applied here
router.delete('/:id', authMiddleware, deleteFromQueue); // Auth middleware applied here

export default router;
