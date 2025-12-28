// ============================================
// EVENT CONTROLLER (with JWT)
// File: controllers/eventController.js
// ============================================

const { Event, User } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Get all events
 * GET /api/events
 * Public access
 */
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [{
        model: User,
        as: 'organizer',
        attributes: ['id', 'name', 'email']
      }],
      order: [['event_date', 'ASC']]
    });
    
    return successResponse(res, 200, 'Events retrieved successfully', events);
  } catch (error) {
    console.error('Get all events error:', error);
    return errorResponse(res, 500, 'Failed to retrieve events', error.message);
  }
};

/**
 * Get event by ID
 * GET /api/events/:id
 * Public access
 */
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findByPk(id, {
      include: [{
        model: User,
        as: 'organizer',
        attributes: ['id', 'name', 'email']
      }]
    });
    
    if (!event) {
      return errorResponse(res, 404, 'Event not found');
    }
    
    return successResponse(res, 200, 'Event retrieved successfully', event);
  } catch (error) {
    console.error('Get event error:', error);
    return errorResponse(res, 500, 'Failed to retrieve event', error.message);
  }
};

/**
 * Create event
 * POST /api/events
 * Admin only
 */
const createEvent = async (req, res) => {
  try {
    const { name, description, location, event_date, ticket_price, total_tickets } = req.body;
    const organizer_id = req.user.id; // Get from authenticated user
    
    // Validate required fields
    if (!name || !location || !event_date || !ticket_price || !total_tickets) {
      return errorResponse(res, 400, 'Missing required fields');
    }
    
    // Create event
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
    console.error('Create event error:', error);
    return errorResponse(res, 500, 'Failed to create event', error.message);
  }
};

/**
 * Update event
 * PUT /api/events/:id
 * Admin only (owner or any admin)
 */
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, location, event_date, ticket_price, total_tickets } = req.body;
    
    const event = await Event.findByPk(id);
    
    if (!event) {
      return errorResponse(res, 404, 'Event not found');
    }
    
    // Only admin can update
    if (req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Only admins can update events');
    }
    
    // Prevent updating available_tickets directly
    const updateData = {
      name: name || event.name,
      description: description !== undefined ? description : event.description,
      location: location || event.location,
      event_date: event_date || event.event_date,
      ticket_price: ticket_price || event.ticket_price
    };
    
    // If total_tickets is updated, adjust available_tickets proportionally
    if (total_tickets) {
      const soldTickets = event.total_tickets - event.available_tickets;
      updateData.total_tickets = total_tickets;
      updateData.available_tickets = Math.max(0, total_tickets - soldTickets);
    }
    
    await event.update(updateData);
    
    return successResponse(res, 200, 'Event updated successfully', event);
  } catch (error) {
    console.error('Update event error:', error);
    return errorResponse(res, 500, 'Failed to update event', error.message);
  }
};

/**
 * Delete event
 * DELETE /api/events/:id
 * Admin only
 */
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findByPk(id);
    
    if (!event) {
      return errorResponse(res, 404, 'Event not found');
    }
    
    // Only admin can delete
    if (req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Only admins can delete events');
    }
    
    await event.destroy();
    
    return successResponse(res, 200, 'Event deleted successfully');
  } catch (error) {
    console.error('Delete event error:', error);
    return errorResponse(res, 500, 'Failed to delete event', error.message);
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
