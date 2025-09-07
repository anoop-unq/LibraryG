// // context/AuthContext.js
// import React, { createContext, useContext, useReducer, useEffect } from 'react';
// import { api } from '../Lib/axios';

// const AuthContext = createContext();

// const authReducer = (state, action) => {
//   switch (action.type) {
//     case 'LOGIN_START':
//       return { ...state, loading: true, error: null };
//     case 'LOGIN_SUCCESS':
//       return { 
//         ...state, 
//         loading: false, 
//         user: action.payload, 
//         isAuthenticated: true, 
//         error: null 
//       };
//     case 'LOGIN_FAILURE':
//       return { 
//         ...state, 
//         loading: false, 
//         error: action.payload, 
//         isAuthenticated: false, 
//         user: null 
//       };
//     case 'LOGOUT':
//       return { 
//         ...state, 
//         user: null, 
//         isAuthenticated: false, 
//         error: null,
//         users: [] 
//       };
//     case 'CLEAR_ERROR':
//       return { ...state, error: null };
//     case 'UPDATE_USER':
//       return { ...state, user: { ...state.user, ...action.payload } };
//     case 'SET_USERS':
//       return { 
//         ...state, 
//         users: action.payload, 
//         usersLoading: false,
//         usersError: null 
//       };
//     case 'USERS_LOADING':
//       return { ...state, usersLoading: true, usersError: null };
//     case 'USERS_ERROR':
//       return { 
//         ...state, 
//         usersError: action.payload, 
//         usersLoading: false 
//       };
//     default:
//       return state;
//   }
// };

// const initialState = {
//   user: null,
//   users: [],
//   isAuthenticated: false,
//   loading: false,
//   usersLoading: false,
//   error: null,
//   usersError: null
// };

// export const AuthProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, initialState);

//   useEffect(() => {
//     // Check if user is logged in by making a request to a protected endpoint
//     const checkAuthStatus = async () => {
//       try {
//         // Try to get current user info
//               dispatch({ type: 'AUTH_CHECKING' });

//         const userResponse = await api.get('/users/me');
        
//         dispatch({ type: 'LOGIN_SUCCESS', payload: userResponse.data.data.user });
//       } catch (error) {
//         // If the request fails, we're not authenticated
//         console.log('Auth check failed, user not logged in');
//         dispatch({ type: 'LOGOUT' });
//       }
//     };

//     checkAuthStatus();
//   }, []);

//   const login = async (email, password) => {
//     try {
//       dispatch({ type: 'LOGIN_START' });
      
//       const response = await api.post('/auth/login', {
//         email,
//         password
//       });
      
//       dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.data.user });
      
//       return { success: true };
//     } catch (error) {
//       const message = error.response?.data?.message || 'Login failed';
//       dispatch({ type: 'LOGIN_FAILURE', payload: message });
      
//       return { success: false, error: message };
//     }
//   };

//   const register = async (name, email, password, role) => {
//     try {
//       dispatch({ type: 'LOGIN_START' });
      
//       const response = await api.post('/auth/register', {
//         name,
//         email,
//         password,
//         role
//       });
      
//       dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.data.user });
      
//       return { success: true };
//     } catch (error) {
//       const message = error.response?.data?.message || 'Registration failed';
//       dispatch({ type: 'LOGIN_FAILURE', payload: message });
      
//       return { success: false, error: message };
//     }
//   };

//   const logout = async () => {
//     try {
//       await api.post('/auth/logout');
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       dispatch({ type: 'LOGOUT' });
//     }
//   };

//   const clearError = () => {
//     dispatch({ type: 'CLEAR_ERROR' });
//   };

//   // Get all users (admin only)
//   const getAllUsers = async () => {
//     try {
//       dispatch({ type: 'USERS_LOADING' });
      
//       const response = await api.get('/users');
      
//       dispatch({ type: 'SET_USERS', payload: response.data.data.users });
      
//       return { success: true };
//     } catch (error) {
//       const message = error.response?.data?.message || 'Failed to fetch users';
//       dispatch({ type: 'USERS_ERROR', payload: message });
      
//       return { success: false, error: message };
//     }
//   };

//   // Get user by ID (admin only)
//   const getUserById = async (userId) => {
//     try {
//       const response = await api.get(`/users/${userId}`);
      
//       return { success: true, user: response.data.data.user };
//     } catch (error) {
//       const message = error.response?.data?.message || 'Failed to fetch user';
//       return { success: false, error: message };
//     }
//   };

//   // Update user (admin only)
//   const updateUser = async (userId, userData) => {
//     try {
//       const response = await api.put(`/users/${userId}`, userData);
      
//       // If updating current user, update in state
//       if (state.user && state.user.id === userId) {
//         dispatch({ type: 'UPDATE_USER', payload: response.data.data.user });
//       }
      
//       // Refresh users list if we're admin
//       if (state.user && state.user.role === 'admin') {
//         getAllUsers();
//       }
      
//       return { success: true, user: response.data.data.user };
//     } catch (error) {
//       const message = error.response?.data?.message || 'Failed to update user';
//       return { success: false, error: message };
//     }
//   };

//   // Delete user (admin only)
//   const deleteUser = async (userId) => {
//     try {
//       await api.delete(`/users/${userId}`);
      
//       // Refresh users list
//       getAllUsers();
      
//       return { success: true };
//     } catch (error) {
//       const message = error.response?.data?.message || 'Failed to delete user';
//       return { success: false, error: message };
//     }
//   };

//   return (
//     <AuthContext.Provider value={{
//       ...state,
//       login,
//       register,
//       logout,
//       clearError,
//       getAllUsers,
//       getUserById,
//       updateUser,
//       deleteUser
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        user: action.payload, 
        isAuthenticated: true, 
        error: null 
      };
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        loading: false, 
        error: action.payload, 
        isAuthenticated: false, 
        user: null 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false, 
        error: null,
        users: [] 
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'SET_USERS':
      return { 
        ...state, 
        users: action.payload, 
        usersLoading: false,
        usersError: null 
      };
    case 'USERS_LOADING':
      return { ...state, usersLoading: true, usersError: null };
    case 'USERS_ERROR':
      return { 
        ...state, 
        usersError: action.payload, 
        usersLoading: false 
      };
    case 'AUTH_CHECKING':
      return { ...state, authChecking: true };
    case 'AUTH_CHECK_COMPLETE':
      return { ...state, authChecking: false };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  users: [],
  isAuthenticated: false,
  loading: false,
  usersLoading: false,
  error: null,
  usersError: null,
  authChecking: true
};

// Configure axios defaults
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = backendUrl + '/api';

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check if user is logged in by making a request to a protected endpoint
    const checkAuthStatus = async () => {
      try {
        dispatch({ type: 'AUTH_CHECKING' });
        const userResponse = await axios.get('/users/me');
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: userResponse.data.data.user });
      } catch (error) {
        // If the request fails, we're not authenticated
        console.log('Auth check failed, user not logged in:', error.response?.data?.message);
        dispatch({ type: 'LOGOUT' });
      } finally {
        dispatch({ type: 'AUTH_CHECK_COMPLETE' });
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const response = await axios.post('/auth/login', {
        email,
        password
      });
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.data.user });
      toast.success('Login successful!');
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      toast.error(message);
      
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const response = await axios.post('/auth/register', {
        name,
        email,
        password,
        role
      });
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.data.user });
      toast.success('Registration successful!');
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      toast.error(message);
      
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Get all users (admin only)
  const getAllUsers = async () => {
    try {
      dispatch({ type: 'USERS_LOADING' });
      
      const response = await axios.get('/users');
      
      dispatch({ type: 'SET_USERS', payload: response.data.data.users });
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch users';
      dispatch({ type: 'USERS_ERROR', payload: message });
      toast.error(message);
      
      return { success: false, error: message };
    }
  };

  // Get user by ID (admin only)
  const getUserById = async (userId) => {
    try {
      const response = await axios.get(`/users/${userId}`);
      
      return { success: true, user: response.data.data.user };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch user';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update user (admin only)
  const updateUser = async (userId, userData) => {
    try {
      const response = await axios.put(`/users/${userId}`, userData);
      
      // If updating current user, update in state
      if (state.user && state.user.id === userId) {
        dispatch({ type: 'UPDATE_USER', payload: response.data.data.user });
      }
      
      // Refresh users list if we're admin
      if (state.user && state.user.role === 'admin') {
        getAllUsers();
      }
      
      toast.success('User updated successfully!');
      return { success: true, user: response.data.data.user };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update user';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Delete user (admin only)
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`/users/${userId}`);
      
      // Refresh users list
      getAllUsers();
      toast.success('User deleted successfully!');
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete user';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      clearError,
      getAllUsers,
      getUserById,
      updateUser,
      deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};