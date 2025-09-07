import express from 'express';
import { body } from 'express-validator';
import { borrowBook, returnBook } from '../controllers/borrowController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/borrow', [
  protect,
  restrictTo('member'),
  body('bookId').notEmpty().withMessage('Book ID is required')
], borrowBook);

router.post('/return', [
  protect,
  restrictTo('member'),
  body('bookId').notEmpty().withMessage('Book ID is required')
], returnBook);

export default router;