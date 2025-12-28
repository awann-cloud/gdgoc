// ============================================
// EVENT ROUTES (with JWT)
// File: routes/eventRoutes.js
// ============================================

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// Protected routes (Admin only)
router.post('/', authenticateToken, requireAdmin, eventController.createEvent);
router.put('/:id', authenticateToken, requireAdmin, eventController.updateEvent);
router.delete('/:id', authenticateToken, requireAdmin, eventController.deleteEvent);

module.exports = router;
