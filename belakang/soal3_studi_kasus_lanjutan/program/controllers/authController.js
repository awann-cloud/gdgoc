// ============================================
// AUTHENTICATION CONTROLLER
// File: controllers/authController.js
// ============================================

const { User } = require('../models');
const { generateToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Register new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return errorResponse(res, 400, 'Name, email, and password are required');
    }
    
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return errorResponse(res, 400, 'Email already exists');
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user' // Default to 'user' if not specified
    });
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Return response without password
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
    
    return successResponse(res, 201, 'User registered successfully', {
      user: userData,
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    return errorResponse(res, 500, 'Failed to register user', error.message);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return errorResponse(res, 400, 'Email and password are required');
    }
    
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password');
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return errorResponse(res, 401, 'Invalid email or password');
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Return response without password
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    
    return successResponse(res, 200, 'Login successful', {
      user: userData,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 500, 'Failed to login', error.message);
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }
    
    return successResponse(res, 200, 'Profile retrieved successfully', user);
  } catch (error) {
    console.error('Get profile error:', error);
    return errorResponse(res, 500, 'Failed to get profile', error.message);
  }
};

module.exports = {
  register,
  login,
  getProfile
};
