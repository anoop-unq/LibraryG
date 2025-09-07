// // src/services/api.js
// import axios from 'axios';

// // Create axios instance with default config
// const api = axios.create({
//   // baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
//   baseURL:  'https://library-management-system-g66t.onrender.com/api',

//   withCredentials: true, // Important for cookies
// });

// // Request interceptor to add auth token if available
// api.interceptors.request.use(
//   (config) => {
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor to handle auth errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from 'axios';

const BASE_URL = 'https://library-management-system-g66t.onrender.com/api';
// const BASE_URL = 'http://localhost:/5000/api';


const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Essential for cookies
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { api };