

import React, { useEffect, useState } from 'react';
import { useBook } from '../context/BookContext';
import AddBookForm from '../components/AddBookForm';
import BookList from '../components/BookList';
import UserManagement from '../components/UserManagement';
import { 
  FiBook, FiUsers, FiSettings, FiPlus, 
  FiGrid, FiBookOpen, FiUser, FiMenu, FiX
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

const Admin = () => {
  const { fetchBooks } = useBook();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('books');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Set active tab based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('add-book')) {
      setActiveTab('add-book');
    } else if (path.includes('users')) {
      setActiveTab('users');
    } else if (path.includes('settings')) {
      setActiveTab('settings');
    } else {
      setActiveTab('books');
    }
  }, [location]);

  useEffect(() => {
    if (activeTab === 'books') {
      fetchBooks();
    }
  }, [activeTab, fetchBooks]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/admin/${tab === 'books' ? '' : tab}`);
    setMobileMenuOpen(false);
  };

  const tabs = [
    { id: 'books', name: 'Manage Books', icon: FiBookOpen },
    { id: 'add-book', name: 'Add Book', icon: FiPlus },
    { id: 'users', name: 'Users', icon: FiUsers },
    { id: 'settings', name: 'Settings', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-3 sm:py-6 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
              <FiSettings className="mr-2 sm:mr-3 text-indigo-600 h-5 w-5 sm:h-6 sm:w-6" />
              Admin Panel
            </h1>
           
          </div>
          <p className="text-gray-600 text-sm sm:text-base">Manage your library system and users</p>
        </div>

        {/* Mobile Menu (shown only on small screens) */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white rounded-lg shadow-sm p-3 mb-4 border border-gray-200">
            <nav className="grid grid-cols-2 gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex flex-col items-center p-2 rounded-md text-xs font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="mb-1 h-4 w-4" />
                    <span className="text-center">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Tab Navigation (hidden on mobile when menu is open) */}
        <div className={`bg-white rounded-xl shadow-sm p-2 mb-4 sm:mb-6 border border-gray-200 ${mobileMenuOpen ? 'hidden sm:block' : ''}`}>
          <nav className="flex flex-wrap sm:flex-nowrap sm:space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all mb-1 sm:mb-0 mr-1 sm:mr-0 ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">{tab.name}</span>
                  <span className="xs:hidden">{tab.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden border border-gray-200">
          {activeTab === 'books' && (
            <div className="p-4 sm:p-6">
              <div className="flex items-center mb-4 sm:mb-6">
                <FiBookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 mr-2" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Manage Books</h2>
              </div>
              <BookList />
            </div>
          )}

          {activeTab === 'add-book' && (
            <div className="p-4 sm:p-6">
              <div className="flex items-center mb-4 sm:mb-6">
                <FiPlus className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 mr-2" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Add New Book</h2>
              </div>
              <AddBookForm />
            </div>
          )}

          {activeTab === 'users' && (
            <div className="p-4 sm:p-6">
              <div className="flex items-center mb-4 sm:mb-6">
                <FiUsers className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 mr-2" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">User Management</h2>
              </div>
              <UserManagement />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-4 sm:p-6">
              <div className="flex items-center mb-4 sm:mb-6">
                <FiSettings className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 mr-2" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">System Settings</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200">
                  <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4">Library Information</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Configure your library settings and preferences.</p>
                </div>
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200">
                  <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4">System Status</h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center text-xs sm:text-sm">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>Database: Connected</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>API: Running</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>Authentication: Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;