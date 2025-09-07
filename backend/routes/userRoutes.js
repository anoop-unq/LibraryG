// routes/userRoutes.js
import express from 'express';

import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { deleteUser, getAllUsers, getMe, getUser, updateUser } from '../controllers/userContoller.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.get('/me',getMe);
router.get('/', restrictTo('admin'), getAllUsers);
router.get('/:id', restrictTo('admin'),getUser );
router.put('/:id', restrictTo('admin'),updateUser );
router.delete('/:id', restrictTo('admin'),deleteUser );

export default router;