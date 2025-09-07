// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// export const protect = async (req, res, next) => {
//   try {
//     // ;
    
//     // 1) Check if token exists in cookies
//     // if (req.cookies && req.cookies.jwt) {
//      const token = req.cookies.jwt;

//       console.log('Token found in cookies:', token ? 'Yes' : 'No');
//     // }
//     console.log(token,"7285")
    
//     if (!token) {
//       return res.status(401).json({ message: 'You are not logged in. Please log in to get access.' });
//     }
    
//     // 2) Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // 3) Check if user still exists
//     const currentUser = await User.findById(decoded.id);
//     if (!currentUser) {
//       return res.status(401).json({ message: 'The user belonging to this token no longer exists.' });
//     }
    
//     // 4) Grant access to protected route
//     req.user = currentUser;
//     console.log(currentUser)
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// export const restrictTo = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         status: 'fail',
//         message: 'You do not have permission to perform this action'
//       });
//     }
//     next();
//   };
// };


import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    console.log('Cookies received:', req.cookies); // Debug: log all cookies
    
    // 1) Check if token exists in cookies
    const token = req.cookies?.jwt; // Using optional chaining

    console.log('Token found in cookies:', token ? 'Yes' : 'No');
    console.log('Token value:', token);
    
    if (!token) {
      return res.status(401).json({ 
        message: 'You are not logged in. Please log in to get access.',
        error: 'NO_TOKEN'
      });
    }
    
    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ 
        message: 'The user belonging to this token no longer exists.',
        error: 'USER_NOT_FOUND'
      });
    }
    
    // 4) Grant access to protected route
    req.user = currentUser;
    console.log('Authenticated user:', currentUser.email);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    // Specific error handling
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token',
        error: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired. Please log in again.',
        error: 'TOKEN_EXPIRED'
      });
    }
    
    res.status(401).json({ 
      message: 'Authentication failed',
      error: 'AUTH_FAILED'
    });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if user exists and has a role
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        status: 'fail',
        message: 'Authentication required'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};