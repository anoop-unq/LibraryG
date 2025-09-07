// src/pages/Books.js
import React, { useEffect } from 'react';
import { useBook } from '../context/BookContext';
import SearchBar from '../components/SearchBar';
import BookList from '../components/BookList';

const Books = () => {
  const { fetchBooks } = useBook();

  useEffect(() => {
    fetchBooks();
    // Empty dependency array means this runs only once on mount
  }, []); // Remove fetchBooks from dependencies to prevent infinite loop

  return (
    <div>
      <SearchBar />
      <BookList />
    </div>
  );
};

export default Books;