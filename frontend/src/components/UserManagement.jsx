// src/components/UserManagement.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FiUsers, FiUser, FiMail, FiCalendar, FiShield, 
  FiSearch, FiEye, FiEdit, FiTrash2, FiArrowLeft,
  FiChevronLeft, FiChevronRight, FiFilter, FiX
} from 'react-icons/fi';

const UserManagement = () => {
  const { user: currentUser, users, usersLoading, usersError, getAllUsers } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      getAllUsers();
    }
  }, []);

  // Filter users based on search term and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleViewUser = (user) => {
    setSelectedUser(user);
  };

  const handleBackToList = () => {
    setSelectedUser(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-3 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 text-center">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <FiShield className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Access Denied</h2>
          <p className="text-gray-600 mb-5 text-sm">You need administrator privileges to access this page.</p>
          <button
            onClick={() => window.history.back()}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (selectedUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-3">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBackToList}
            className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4 font-medium transition-colors bg-white rounded-lg px-3 py-1.5 shadow-sm hover:shadow-md text-sm"
          >
            <FiArrowLeft className="mr-1.5" />
            Back to Users
          </button>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center">
                  <FiUser className="h-10 w-10 text-white" />
                </div>
                
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-1.5">{selectedUser.name}</h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      selectedUser.role === 'admin' 
                        ? 'bg-purple-500/20 text-white' 
                        : 'bg-blue-500/20 text-white'
                    }`}>
                      <FiShield className="mr-1.5" />
                      {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                    </div>
                    <p className="text-indigo-100 flex items-center text-sm">
                      <FiMail className="mr-1.5" />
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                    <FiUser className="mr-2 text-indigo-600" />
                    Personal Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Full Name</p>
                      <p className="text-gray-800 font-medium text-sm">{selectedUser.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email Address</p>
                      <p className="text-gray-800 font-medium text-sm">{selectedUser.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                    <FiShield className="mr-2 text-indigo-600" />
                    Account Details
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Role</p>
                      <p className="text-gray-800 font-medium text-sm capitalize">{selectedUser.role}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Member Since</p>
                      <p className="text-gray-800 font-medium text-sm">{formatDate(selectedUser.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-3">
      <div className="max-w-7xl mx-auto">
        <div className="mb-5">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-sm mr-3">
              <FiUsers className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
              <p className="text-gray-600 mt-0.5 text-sm">Manage all library users and their permissions</p>
            </div>
          </div>
          
          <div className="h-1 w-16 bg-indigo-600 rounded-full"></div>
        </div>
        
        {usersError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md mb-4 shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FiShield className="h-4 w-4 text-red-400 mt-0.5" />
              </div>
              <div className="ml-2">
                <p className="text-xs text-red-700 font-medium">Error loading users</p>
                <p className="text-xs text-red-600 mt-0.5">{usersError}</p>
              </div>
              <button className="ml-auto text-red-500 hover:text-red-700">
                <FiX className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-5">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="relative flex-grow max-w-2xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-9 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FiX className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-white px-2.5 py-2 border border-gray-300 rounded-lg shadow-sm">
                  <FiFilter className="text-gray-400 mr-1.5 text-sm" />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="border-none bg-transparent focus:ring-0 focus:outline-none text-sm"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {usersLoading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-3 text-gray-600 font-medium text-sm">Loading users...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <FiUsers className="h-12 w-12 text-gray-300 mb-3" />
                            <p className="text-gray-500 text-base font-medium mb-1.5">No users found</p>
                            <p className="text-gray-400 max-w-md text-center text-xs">
                              {searchTerm || roleFilter !== 'all' 
                                ? "Try adjusting your search or filter to find what you're looking for."
                                : "There are no users in the system yet."}
                            </p>
                            {(searchTerm || roleFilter !== 'all') && (
                              <button 
                                onClick={() => {
                                  setSearchTerm('');
                                  setRoleFilter('all');
                                }}
                                className="mt-3 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs"
                              >
                                Clear all filters
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                <FiUser className="h-5 w-5 text-indigo-600" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                                <div className="text-xs text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-xs font-medium">
                            <button
                              onClick={() => handleViewUser(user)}
                              className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
                            >
                              <FiEye className="inline mr-1" /> View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div>
                      <p className="text-xs text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(indexOfLastUser, filteredUsers.length)}
                        </span> of{' '}
                        <span className="font-medium">{filteredUsers.length}</span> users
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2.5 py-1.5 rounded-l-md border border-gray-300 text-xs ${
                            currentPage === 1 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : 'bg-white text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <span className="sr-only">Previous</span>
                          <FiChevronLeft className="h-4 w-4" />
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-3 py-1.5 border text-xs ${
                              currentPage === page
                                ? 'z-10 bg-indigo-600 border-indigo-500 text-white'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-2.5 py-1.5 rounded-r-md border border-gray-300 text-xs ${
                            currentPage === totalPages
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <span className="sr-only">Next</span>
                          <FiChevronRight className="h-4 w-4" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3">User Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="flex items-center">
                <div className="p-1.5 bg-blue-100 rounded-lg mr-3">
                  <FiUsers className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-blue-800">{users.length}</p>
                  <p className="text-xs text-blue-600">Total Users</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
              <div className="flex items-center">
                <div className="p-1.5 bg-purple-100 rounded-lg mr-3">
                  <FiShield className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-purple-800">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                  <p className="text-xs text-purple-600">Administrators</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
              <div className="flex items-center">
                <div className="p-1.5 bg-green-100 rounded-lg mr-3">
                  <FiUser className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-green-800">
                    {users.filter(u => u.role === 'member').length}
                  </p>
                  <p className="text-xs text-green-600">Members</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;