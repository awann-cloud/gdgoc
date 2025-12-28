// ============================================
// AUTHENTICATION MIDDLEWARE
// File: middleware/authMiddleware.js
// ============================================

const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');

/**
 * Verify JWT token from Authorization header
 */
const authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return errorResponse(res, 401, 'Access token required');
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Attach user info to request
    req.user = decoded;
    
    next();
  } catch (error) {
    return errorResponse(res, 403, 'Invalid or expired token');
  }
};

module.exports = {
  authenticateToken
};
