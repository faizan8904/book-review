import express from 'express';
import { validateLogin, validateSignup } from '../middlewares/validators.js';
import { login, signup } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

export default router;