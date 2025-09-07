import express from 'express';
import { body } from 'express-validator';
import { register, login, logout } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { getMe } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], register);

router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], login);

router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;