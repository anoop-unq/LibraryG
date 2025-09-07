import React, { useState } from 'react';
import { useBook } from '../context/BookContext';
import { useAuth } from '../context/AuthContext';
import EditBookForm from './EditBookForm';
import { 
  FiBook, FiUser, FiEdit, FiTrash2, FiClock, FiCheckCircle, 
  FiXCircle, FiAlertCircle, FiSearch, FiPlus, FiInfo
} from 'react-icons/fi';
import { FaBookOpen, FaUserAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const BookList = () => {
  const { books, loading, error, borrowBook, returnBook, updateBook, deleteBook } = useBook();
  const { isAuthenticated, user } = useAuth();
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleBorrow = async (bookId) => {
    const result = await borrowBook(bookId);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.error);
    }
  };

  const handleReturn = async (bookId) => {
    const result = await returnBook(bookId);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.error);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
  };

  const handleEditCancel = () => {
    setEditingBook(null);
  };

  const handleEditSuccess = () => {
    setEditingBook(null);
  };

  const handleDelete = async (bookId) => {
    const result = await deleteBook(bookId);
    if (result.success) {
      toast.success(result.message);
      setDeletingBook(null);
    } else {
      toast.error(result.error);
    }
  };

  const confirmDelete = (book) => {
    setDeletingBook(book);
  };

  const cancelDelete = () => {
    setDeletingBook(null);
  };

  // Function to display who borrowed the book
  const getBorrowedByText = (book) => {
    if (!book.borrowedBy) return null;
    
    // If borrowedBy is populated (object with name)
    if (typeof book.borrowedBy === 'object' && book.borrowedBy.name) {
      // Check if the current user is the one who borrowed it
      if (user && book.borrowedBy._id === user.id) {
        return 'Borrowed by: You';
      }
      return `Borrowed by: ${book.borrowedBy.name}`;
    }
    
    // If borrowedBy is just an ID (not populated)
    if (user && book.borrowedBy === user.id) {
      return 'Borrowed by: You';
    }
    
    return 'Borrowed by: Another user';
  };

  // Filter books based on search term and reverse the order to show newest first
  const filteredBooks = books
    .filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .reverse(); // Reverse the array to show most recent books first

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
            <p className="mt-6 text-lg text-gray-600 font-medium">Loading books...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md mb-6">
            <div className="flex items-center">
              <FiAlertCircle className="h-6 w-6 text-red-500 mr-3" />
              <div>
                <h3 className="text-red-800 font-medium">Error loading books</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {editingBook && (
          <EditBookForm 
            book={editingBook} 
            onCancel={handleEditCancel}
            onSuccess={handleEditSuccess}
          />
        )}
        
        {deletingBook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
              <div className="flex items-center mb-4">
                <FiAlertCircle className="h-6 w-6 text-red-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Confirm Delete</h2>
              </div>
              <p className="mb-6 text-gray-600">Are you sure you want to delete <span className="font-medium">"{deletingBook.title}"</span> by {deletingBook.author}? This action cannot be undone.</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleDelete(deletingBook._id)}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center"
                >
                  <FiTrash2 className="mr-2" />
                  Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Search bar */}
        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search books by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        {filteredBooks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-4">
              <FiBook className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No books found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? `No results for "${searchTerm}"` : 'The library catalog is empty'}
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map(book => (
              <div key={book._id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <FaBookOpen className="h-6 w-6 text-indigo-600" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {book.available ? 'Available' : 'Borrowed'}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{book.title}</h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <FiUser className="mr-2" />
                    <span className="text-sm">{book.author}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <span className="text-sm">ISBN: {book.isbn}</span>
                  </div>
                  
                  {!book.available && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaUserAlt className="mr-2 text-blue-500" />
                        <span>{getBorrowedByText(book)}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-col space-y-3 mt-6">
                    {isAuthenticated && user.role === 'member' && (
                      <>
                        {book.available ? (
                          <button
                            onClick={() => handleBorrow(book._id)}
                            className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center"
                          >
                            <FiPlus className="mr-2" />
                            Borrow Book
                          </button>
                        ) : (
                          // Show return button only if the current user borrowed this book
                          (user && 
                            ((typeof book.borrowedBy === 'object' && book.borrowedBy._id === user.id) || 
                            (typeof book.borrowedBy === 'string' && book.borrowedBy === user.id))) ? (
                            <button
                              onClick={() => handleReturn(book._id)}
                              className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                            >
                              <FiCheckCircle className="mr-2" />
                              Return Book
                            </button>
                          ) : (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                              <p className="text-amber-700 text-sm flex items-center justify-center">
                                <FiClock className="mr-1" />
                                Currently borrowed by another user
                              </p>
                            </div>
                          )
                        )}
                      </>
                    )}
                    
                    {isAuthenticated && user.role === 'admin' && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(book)}
                          className="flex-1 bg-blue-100 text-blue-700 px-2 py-2 rounded-lg hover:bg-blue-200 transition flex items-center justify-center"
                        >
                          <FiEdit className="mr-2 " />
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(book)}
                          className="flex-1 bg-red-100 text-red-700 px-2 py-2 rounded-lg hover:bg-red-200 transition flex items-center justify-center"
                        >
                          <FiTrash2 className="mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookList;