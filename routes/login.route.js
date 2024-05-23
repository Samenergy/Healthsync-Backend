import express from 'express';
import signupController from '../controllers/signup.controller.js';
import login from '../controllers/login.controller.js';
import adminMiddleware from '../middlewares/authorization.js';

import userController from '../controllers/administrative.controller.js';

const router = express.Router();



router.post('/signup', signupController.signup);
router.post('/login',login);
router.post('/user',userController.createUser)
router.get('/all',userController.allUsers)
router.delete('/delete/:id',userController.deleteUsers)




export default router