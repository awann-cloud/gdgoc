// ============================================
// ROLE-BASED ACCESS CONTROL MIDDLEWARE
// File: middleware/roleMiddleware.js
// ============================================

const { errorResponse } = require('../utils/response');

/**
 * Check if user has required role
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'Authentication required');
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 403, 'Access forbidden: Insufficient permissions');
    }
    
    next();
  };
};

/**
 * Check if user is admin
 */
const requireAdmin = requireRole('admin');

/**
 * Check if user owns the resource or is admin
 */
const requireOwnerOrAdmin = (getUserIdFromRequest) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'Authentication required');
    }
    
    const resourceUserId = getUserIdFromRequest(req);
    
    // Allow if user is admin or owns the resource
    if (req.user.role === 'admin' || req.user.id === resourceUserId) {
      return next();
    }
    
    return errorResponse(res, 403, 'Access forbidden: You can only access your own resources');
  };
};

module.exports = {
  requireRole,
  requireAdmin,
  requireOwnerOrAdmin
};
