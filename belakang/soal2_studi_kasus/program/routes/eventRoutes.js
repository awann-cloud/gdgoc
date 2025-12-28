// ============================================
// EVENT ROUTES
// File: routes/eventRoutes.js
// ============================================

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// GET /api/events - Get all events
router.get('/', eventController.getAllEvents);

// GET /api/events/:id - Get event by ID
router.get('/:id', eventController.getEventById);

// POST /api/events - Create event
router.post('/', eventController.createEvent);

// PUT /api/events/:id - Update event
router.put('/:id', eventController.updateEvent);

// DELETE /api/events/:id - Delete event
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
