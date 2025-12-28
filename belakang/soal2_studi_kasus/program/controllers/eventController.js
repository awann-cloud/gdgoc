// ============================================
// EVENT CONTROLLER
// File: controllers/eventController.js
// ============================================

const { Event, User } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [{
        model: User,
        as: 'organizer',
        attributes: ['id', 'name', 'email']
      }]
    });
    return successResponse(res, 200, 'Successfully retrieved events', events);
  } catch (error) {
    return errorResponse(res, 500, 'Failed to retrieve events', error.message);
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'organizer',
        attributes: ['id', 'name', 'email']
      }]
    });
    
    if (!event) {
      return errorResponse(res, 404, 'Event not found');
    }
    
    return successResponse(res, 200, 'Successfully retrieved event', event);
  } catch (error) {
    return errorResponse(res, 500, 'Failed to retrieve event', error.message);
  }
};

// Create event
exports.createEvent = async (req, res) => {
  try {
    const {
      organizer_id,
      name,
      description,
      location,
      event_date,
      ticket_price,
      total_tickets
    } = req.body;
    
    const event = await Event.create({
      organizer_id,
      name,
      description,
      location,
      event_date,
      ticket_price,
      total_tickets,
      available_tickets: total_tickets
    });
    
    return successResponse(res, 201, 'Event created successfully', event);
  } catch (error) {
    return errorResponse(res, 400, 'Failed to create event', error.message);
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    
    if (!event) {
      return errorResponse(res, 404, 'Event not found');
    }
    
    const updateData = req.body;
    // Don't allow manual update of available_tickets
    delete updateData.available_tickets;
    
    await event.update(updateData);
    
    return successResponse(res, 200, 'Event updated successfully', event);
  } catch (error) {
    return errorResponse(res, 400, 'Failed to update event', error.message);
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    
    if (!event) {
      return errorResponse(res, 404, 'Event not found');
    }
    
    await event.destroy();
    return successResponse(res, 200, 'Event deleted successfully');
  } catch (error) {
    return errorResponse(res, 500, 'Failed to delete event', error.message);
  }
};
