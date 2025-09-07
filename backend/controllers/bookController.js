


import Book from '../models/Book.js';
import { validationResult } from 'express-validator';

export const getAllBooks = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};
    
    if (search) {
      filter = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const books = await Book.find(filter).populate('borrowedBy', 'name email');
    res.status(200).json({
      status: 'success',
      results: books.length,
      data: { books }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id).populate('borrowedBy', 'name email');
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.status(200).json({
      status: 'success',
      data: { book }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAvailableBooks = async (req, res) => {
  try {
    const books = await Book.find({ available: true });
    res.status(200).json({
      status: 'success',
      results: books.length,
      data: { books }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, author, isbn } = req.body;
    
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ message: 'Book with this ISBN already exists' });
    }
    
    const book = await Book.create({ title, author, isbn });
    
    res.status(201).json({
      status: 'success',
      data: { book }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, author, isbn } = req.body;
    
    // Check if book exists
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check if ISBN is being changed and if it already exists
    if (isbn && isbn !== book.isbn) {
      const existingBook = await Book.findOne({ isbn });
      if (existingBook) {
        return res.status(400).json({ message: 'Book with this ISBN already exists' });
      }
    }
    
    // Update book
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, isbn },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      status: 'success',
      data: { book: updatedBook }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if book exists
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check if book is currently borrowed
    if (!book.available) {
      return res.status(400).json({ message: 'Cannot delete a book that is currently borrowed' });
    }
    
    // Delete book
    await Book.findByIdAndDelete(id);
    
    res.status(200).json({
      status: 'success',
      message: 'Book deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};