import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });
    
    // Generate token
    const token = signToken(user._id);
    
    // Determine if we're in production
    // const isProduction = process.env.NODE_ENV === 'production';
    
    // Send cookie with token directly - PRODUCTION SETTINGS
    res.cookie('jwt', token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
       sameSite:  'None' ,
    });
    
    // Remove password from output
    user.password = undefined;
    
    res.status(201).json({
      status: 'success',
      // Always include token in response for easier debugging
      token: token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
    
    // Generate token
    const token = signToken(user._id);
    
    // Determine if we're in production
    // const isProduction = process.env.NODE_ENV === 'production';
    
    // Send cookie with token directly - PRODUCTION SETTINGS
    res.cookie('jwt', token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
       secure:process.env.NODE_ENV === 'production',
       sameSite:"None",
    });
    
    // Remove password from output
    user.password = undefined;
    
    res.status(200).json({
      status: 'success',
      // Always include token in response for easier debugging
      token: token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: isProduction, // Must be true for production with sameSite: 'None'
    sameSite: 'None' 
  });
  
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};