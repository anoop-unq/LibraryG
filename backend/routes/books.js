import express from 'express';
import { body } from 'express-validator';
import { 
  getAllBooks, 
  getBookById, 
  getAvailableBooks, 
  addBook, 
  updateBook, 
  deleteBook 
} from '../controllers/bookController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllBooks);
router.get('/available', getAvailableBooks);
router.get('/:id', getBookById);

// Admin only routes
router.post('/', [
  protect,
  restrictTo('admin'),
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('isbn').notEmpty().withMessage('ISBN is required')
], addBook);

router.put('/:id', [
  protect,
  restrictTo('admin'),
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('isbn').notEmpty().withMessage('ISBN is required')
], updateBook);

router.delete('/:id', [
  protect,
  restrictTo('admin')
], deleteBook);

export default router;