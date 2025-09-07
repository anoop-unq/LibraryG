import Book from '../models/Book.js';
import { validationResult } from 'express-validator';
export const borrowBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bookId } = req.body;
    const userId = req.user.id;
    
    const book = await Book.findById(bookId);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    if (!book.available) {
      return res.status(400).json({ message: 'Book is not available' });
    }
    
    book.available = false;
    book.borrowedBy = userId;
    book.borrowDate = new Date();
    
    await book.save();
    
    // Populate the borrowedBy field before sending response
    const populatedBook = await Book.findById(book._id).populate('borrowedBy', 'name email');
    
    res.status(200).json({
      status: 'success',
      message: 'Book borrowed successfully',
      data: { book: populatedBook }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const returnBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bookId } = req.body;
    const userId = req.user.id;
    
    const book = await Book.findById(bookId);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    if (book.available) {
      return res.status(400).json({ message: 'Book is not borrowed' });
    }
    
    if (book.borrowedBy.toString() !== userId) {
      return res.status(403).json({ message: 'You did not borrow this book' });
    }
    
    book.available = true;
    book.borrowedBy = null;
    book.borrowDate = null;
    
    await book.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Book returned successfully',
      data: { book }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};