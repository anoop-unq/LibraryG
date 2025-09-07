// src/components/SearchBar.js
import React, { useState } from 'react';
import { useBook } from '../context/BookContext';
import { FiSearch, FiX, FiFilter } from 'react-icons/fi';

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState('');
  const { fetchBooks } = useBook();

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(searchInput);
  };

  const handleClear = () => {
    setSearchInput('');
    fetchBooks('');
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-6 px-4 shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center">
            <FiSearch className="mr-2 text-indigo-600" />
            Discover Books
          </h2>
          <p className="text-gray-600 mt-1">Search our library collection by title or author</p>
        </div>
        
        <form onSubmit={handleSearch} className="relative">
          <div className="flex flex-col sm:flex-row items-stretch rounded-lg overflow-hidden shadow-lg">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-4 py-4 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <FiX className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                </button>
              )}
            </div>
            
            <div className="flex mt-2 sm:mt-0 sm:flex-col sm:flex-row">
              <button
                type="submit"
                disabled={!searchInput.trim()}
                className={`px-6 py-4 font-medium rounded-none transition-all flex items-center justify-center ${
                  searchInput.trim() 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FiSearch className="mr-2" />
                Search
              </button>
              
              <button
                type="button"
                onClick={handleClear}
                className="px-6 py-4 bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-all flex items-center justify-center"
              >
                <FiX className="mr-2" />
                Clear
              </button>
            </div>
          </div>
        </form>
        
        <div className="mt-4 flex justify-center">
          <div className="inline-flex items-center text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
            <FiFilter className="mr-1 text-indigo-500" />
            <span>Pro tip: Try searching for your favorite author</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;