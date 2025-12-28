// ============================================
// AUTHENTICATION ROUTES
// File: routes/authRoutes.js
// ============================================

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

// POST /api/auth/register - Register new user
router.post('/register', authController.register);

// POST /api/auth/login - Login user
router.post('/login', authController.login);

// GET /api/auth/me - Get current user profile (protected)
router.get('/me', authenticateToken, authController.getProfile);

module.exports = router;
