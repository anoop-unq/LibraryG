import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold transition hover:opacity-90"
          >
            <i className="fas fa-book-open text-2xl"></i>
            <span className="hidden sm:inline">Library Management System</span>
            <span className="sm:hidden">LMS</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-4 mr-4 py-2 px-4 bg-white/10 rounded-full">
                  <i className="fas fa-user-circle"></i>
                  <span>Welcome, {user?.name} ({user?.role})</span>
                </div>
                
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`nav-item px-4 py-2 rounded-lg flex items-center space-x-1 transition ${
                      location.pathname === '/admin' 
                        ? 'bg-indigo-800 shadow-inner' 
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <i className="fas fa-cog"></i>
                    <span>Admin Panel</span>
                  </Link>
                )}
                
                <Link
                  to="/books"
                  className={`nav-item px-4 py-2 rounded-lg flex items-center space-x-1 transition ${
                    location.pathname === '/books' 
                      ? 'bg-indigo-800 shadow-inner' 
                      : 'hover:bg-white/10'
                  }`}
                >
                  <i className="fas fa-book"></i>
                  <span>Books</span>
                </Link>
                
                <Link
                  to="/dashboard"
                  className={`nav-item px-4 py-2 rounded-lg flex items-center space-x-1 transition ${
                    location.pathname === '/dashboard' 
                      ? 'bg-indigo-800 shadow-inner' 
                      : 'hover:bg-white/10'
                  }`}
                >
                  <i className="fas fa-chart-bar"></i>
                  <span>Dashboard</span>
                </Link>
                
                <button
                  onClick={logout}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition flex items-center space-x-1"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition flex items-center space-x-1"
              >
                <i className="fas fa-sign-in-alt"></i>
                <span>Login</span>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <button 
            id="mobile-menu-button"
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 px-2 pt-2 pb-4 space-y-2 bg-blue-700 rounded-lg">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 p-2 bg-white/10 rounded-lg">
                  <i className="fas fa-user-circle"></i>
                  <span>Welcome, {user?.name} ({user?.role})</span>
                </div>
                
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`block nav-item p-2 rounded-lg flex items-center space-x-2 transition ${
                      location.pathname === '/admin' 
                        ? 'bg-indigo-800 shadow-inner' 
                        : 'hover:bg-white/10'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="fas fa-cog w-6"></i>
                    <span>Admin Panel</span>
                  </Link>
                )}
                
                <Link
                  to="/books"
                  className={`block nav-item p-2 rounded-lg flex items-center space-x-2 transition ${
                    location.pathname === '/books' 
                      ? 'bg-indigo-800 shadow-inner' 
                      : 'hover:bg-white/10'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-book w-6"></i>
                  <span>Books</span>
                </Link>
                
                <Link
                  to="/dashboard"
                  className={`block nav-item p-2 rounded-lg flex items-center space-x-2 transition ${
                    location.pathname === '/dashboard' 
                      ? 'bg-indigo-800 shadow-inner' 
                      : 'hover:bg-white/10'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-chart-bar w-6"></i>
                  <span>Dashboard</span>
                </Link>
                
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-white text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition flex items-center space-x-2 justify-center"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="w-full bg-white text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition flex items-center space-x-2 justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-sign-in-alt"></i>
                <span>Login</span>
              </Link>
            )}
          </div>
        )}
      </div>
      
      {/* Add Font Awesome for icons */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
      />
      
      {/* Add custom styles for hover effects */}
      <style jsx='true'>{`
        .nav-item {
          position: relative;
          transition: all 0.3s ease;
        }
        
        .nav-item::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 50%;
          background-color: white;
          transition: all 0.3s ease;
        }
        
        .nav-item:hover::after {
          width: 80%;
          left: 10%;
        }
        
        .active-nav::after {
          content: '';
          position: absolute;
          width: 80%;
          height: 2px;
          bottom: 0;
          left: 10%;
          background-color: white;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;