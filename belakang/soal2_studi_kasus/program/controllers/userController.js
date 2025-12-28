// ============================================
// USER CONTROLLER
// File: controllers/userController.js
// ============================================

const { User } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    return successResponse(res, 200, 'Successfully retrieved users', users);
  } catch (error) {
    return errorResponse(res, 500, 'Failed to retrieve users', error.message);
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }
    
    return successResponse(res, 200, 'Successfully retrieved user', user);
  } catch (error) {
    return errorResponse(res, 500, 'Failed to retrieve user', error.message);
  }
};

// Create user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return errorResponse(res, 400, 'Email already registered');
    }
    
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });
    
    return successResponse(res, 201, 'User created successfully', {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    return errorResponse(res, 400, 'Failed to create user', error.message);
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }
    
    const { name, email, role } = req.body;
    await user.update({ name, email, role });
    
    return successResponse(res, 200, 'User updated successfully', {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    return errorResponse(res, 400, 'Failed to update user', error.message);
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }
    
    await user.destroy();
    return successResponse(res, 200, 'User deleted successfully');
  } catch (error) {
    return errorResponse(res, 500, 'Failed to delete user', error.message);
  }
};
