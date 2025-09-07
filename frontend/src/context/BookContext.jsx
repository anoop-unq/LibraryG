// import React, { createContext, useContext, useReducer, useCallback } from 'react';
// import { api } from '../Lib/axios';

// const BookContext = createContext();

// const bookReducer = (state, action) => {
//   switch (action.type) {
//     case 'SET_LOADING':
//       return { ...state, loading: action.payload };
//     case 'SET_BOOKS':
//       return { ...state, books: action.payload, loading: false };
//     case 'SET_ERROR':
//       return { ...state, error: action.payload, loading: false };
//     case 'ADD_BOOK':
//       return { ...state, books: [...state.books, action.payload] };
//     case 'UPDATE_BOOK':
//       return {
//         ...state,
//         books: state.books.map(book =>
//           book._id === action.payload._id ? action.payload : book
//         )
//       };
//     case 'SET_SEARCH_TERM':
//       return { ...state, searchTerm: action.payload };
//     case 'CLEAR_ERROR':
//       return { ...state, error: null };
//     default:
//       return state;
//   }
// };

// const initialState = {
//   books: [],
//   loading: false,
//   error: null,
//   searchTerm: ''
// };
// console.log(api)
// export const BookProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(bookReducer, initialState);

//   // Use useCallback to memoize functions and prevent infinite loops
//   const fetchBooks = useCallback(async (search = '') => {
//     try {
//       dispatch({ type: 'SET_LOADING', payload: true });
      
//       const response = await api.get(`/books?search=${search}`);
//       console.log(response)
//       dispatch({ type: 'SET_BOOKS', payload: response.data.data.books });
//     } catch (error) {
//       dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch books' });
//     }
//   }, []);

//   const fetchAvailableBooks = useCallback(async () => {
//     try {
//       dispatch({ type: 'SET_LOADING', payload: true });
      
//       const response = await api.get('/books/available');
//       console.log(response)
//       dispatch({ type: 'SET_BOOKS', payload: response.data.data.books });
//     } catch (error) {
//       dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch available books' });
//     }
//   }, []);

//   const addBook = useCallback(async (bookData) => {
//     try {
//       const response = await api.post('/books', bookData);
      
//       dispatch({ type: 'ADD_BOOK', payload: response.data.data.book });
      
//       return { success: true };
//     } catch (error) {
//       return { 
//         success: false, 
//         error: error.response?.data?.message || 'Failed to add book' 
//       };
//     }
//   }, []);

//   const borrowBook = useCallback(async (bookId) => {
//     try {
//       const response = await api.post('/borrow/borrow', { bookId });
      
//       // This should now contain the populated book data
//       dispatch({ type: 'UPDATE_BOOK', payload: response.data.data.book });
      
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       return { 
//         success: false, 
//         error: error.response?.data?.message || 'Failed to borrow book' 
//       };
//     }
//   }, []);

//   const returnBook = useCallback(async (bookId) => {
//     try {
//       const response = await api.post('/borrow/return', { bookId });
      
//       // This should now contain the updated book data
//       dispatch({ type: 'UPDATE_BOOK', payload: response.data.data.book });
      
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       return { 
//         success: false, 
//         error: error.response?.data?.message || 'Failed to return book' 
//       };
//     }
//   }, []);
  
//   const updateBook = useCallback(async (bookId, bookData) => {
//     try {
//       const response = await api.put(`/books/${bookId}`, bookData);
      
//       dispatch({ type: 'UPDATE_BOOK', payload: response.data.data.book });
      
//       return { success: true, message: 'Book updated successfully' };
//     } catch (error) {
//       return { 
//         success: false, 
//         error: error.response?.data?.message || 'Failed to update book' 
//       };
//     }
//   }, []);

//   const deleteBook = useCallback(async (bookId) => {
//     try {
//       await api.delete(`/books/${bookId}`);
      
//       // Remove book from state
//       dispatch({ type: 'SET_BOOKS', payload: state.books.filter(book => book._id !== bookId) });
      
//       return { success: true, message: 'Book deleted successfully' };
//     } catch (error) {
//       return { 
//         success: false, 
//         error: error.response?.data?.message || 'Failed to delete book' 
//       };
//     }
//   }, [state.books]);

//   const setSearchTerm = useCallback((term) => {
//     dispatch({ type: 'SET_SEARCH_TERM', payload: term });
//   }, []);

//   const clearError = useCallback(() => {
//     dispatch({ type: 'CLEAR_ERROR' });
//   }, []);

//   return (
//     <BookContext.Provider value={{
//       ...state,
//       fetchBooks,
//       fetchAvailableBooks,
//       addBook,
//       borrowBook,
//       returnBook,
//       setSearchTerm,
//       clearError,
//       updateBook, 
//       deleteBook, 
//     }}>
//       {children}
//     </BookContext.Provider>
//   );
// };

// export const useBook = () => {
//   const context = useContext(BookContext);
//   if (!context) {
//     throw new Error('useBook must be used within a BookProvider');
//   }
//   return context;
// };


import React, { createContext, useContext, useReducer, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BookContext = createContext();

// Configure axios for this context
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = backendUrl + '/api';

const bookReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_BOOKS':
      return { ...state, books: action.payload, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_BOOK':
      return { ...state, books: [...state.books, action.payload] };
    case 'UPDATE_BOOK':
      return {
        ...state,
        books: state.books.map(book =>
          book._id === action.payload._id ? action.payload : book
        )
      };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  books: [],
  loading: false,
  error: null,
  searchTerm: ''
};

export const BookProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookReducer, initialState);

  // Use useCallback to memoize functions and prevent infinite loops
  const fetchBooks = useCallback(async (search = '') => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await axios.get(`/books?search=${search}`);
      console.log(response);
      dispatch({ type: 'SET_BOOKS', payload: response.data.data.books });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch books';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  }, []);

  const fetchAvailableBooks = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await axios.get('/books/available');
      console.log(response);
      dispatch({ type: 'SET_BOOKS', payload: response.data.data.books });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch available books';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  }, []);

  const addBook = useCallback(async (bookData) => {
    try {
      const response = await axios.post('/books', bookData);
      
      dispatch({ type: 'ADD_BOOK', payload: response.data.data.book });
      // toast.success('Book added successfully!');
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add book';
      // toast.error(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }, []);

  const borrowBook = useCallback(async (bookId) => {
    try {
      const response = await axios.post('/borrow/borrow', { bookId });
      
      // This should now contain the populated book data
      dispatch({ type: 'UPDATE_BOOK', payload: response.data.data.book });
      // toast.success(response.data.message || 'Book borrowed successfully!');
      
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to borrow book';
      // toast.error(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }, []);

  const returnBook = useCallback(async (bookId) => {
    try {
      const response = await axios.post('/borrow/return', { bookId });
      
      // This should now contain the updated book data
      dispatch({ type: 'UPDATE_BOOK', payload: response.data.data.book });
      // toast.success(response.data.message || 'Book returned successfully!');
      
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to return book';
      // toast.error(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }, []);
  
  const updateBook = useCallback(async (bookId, bookData) => {
    try {
      const response = await axios.put(`/books/${bookId}`, bookData);
      
      dispatch({ type: 'UPDATE_BOOK', payload: response.data.data.book });
      // toast.success('Book updated successfully!');
      
      return { success: true, message: 'Book updated successfully' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update book';
      // toast.error(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }, []);

  const deleteBook = useCallback(async (bookId) => {
    try {
      await axios.delete(`/books/${bookId}`);
      
      // Remove book from state
      dispatch({ type: 'SET_BOOKS', payload: state.books.filter(book => book._id !== bookId) });
      // toast.success('Book deleted successfully!');
      
      return { success: true, message: 'Book deleted successfully' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete book';
      // toast.error(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }, [state.books]);

  const setSearchTerm = useCallback((term) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  return (
    <BookContext.Provider value={{
      ...state,
      fetchBooks,
      fetchAvailableBooks,
      addBook,
      borrowBook,
      returnBook,
      setSearchTerm,
      clearError,
      updateBook, 
      deleteBook, 
    }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBook = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBook must be used within a BookProvider');
  }
  return context;
};