// ============================================
// BOOKING CONTROLLER (with JWT & Anti-Overselling)
// File: controllers/bookingController.js
// ============================================

const { Booking, Event, User, sequelize } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Get all bookings
 * GET /api/bookings
 * Admin: see all bookings, User: see only their bookings
 */
const getAllBookings = async (req, res) => {
  try {
    const whereClause = {};
    
    // If user is not admin, only show their bookings
    if (req.user.role !== 'admin') {
      whereClause.user_id = req.user.id;
    }
    
    const bookings = await Booking.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Event,
          as: 'event',
          attributes: ['id', 'name', 'location', 'event_date', 'ticket_price']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    return successResponse(res, 200, 'Bookings retrieved successfully', bookings);
  } catch (error) {
    console.error('Get all bookings error:', error);
    return errorResponse(res, 500, 'Failed to retrieve bookings', error.message);
  }
};

/**
 * Get booking by ID
 * GET /api/bookings/:id
 * Users can only see their own bookings, Admin can see all
 */
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Event,
          as: 'event',
          attributes: ['id', 'name', 'location', 'event_date', 'ticket_price']
        }
      ]
    });
    
    if (!booking) {
      return errorResponse(res, 404, 'Booking not found');
    }
    
    // Check if user owns this booking or is admin
    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      return errorResponse(res, 403, 'You can only view your own bookings');
    }
    
    return successResponse(res, 200, 'Booking retrieved successfully', booking);
  } catch (error) {
    console.error('Get booking error:', error);
    return errorResponse(res, 500, 'Failed to retrieve booking', error.message);
  }
};

/**
 * Create booking (Anti-Overselling with Transaction)
 * POST /api/bookings
 * Authenticated users only
 */
const createBooking = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { event_id, quantity } = req.body;
    const user_id = req.user.id; // From authenticated user
    
    // Validate required fields
    if (!event_id || !quantity) {
      await transaction.rollback();
      return errorResponse(res, 400, 'Event ID and quantity are required');
    }
    
    if (quantity < 1) {
      await transaction.rollback();
      return errorResponse(res, 400, 'Quantity must be at least 1');
    }
    
    // Lock the event row (ANTI-OVERSELLING)
    const event = await Event.findByPk(event_id, {
      lock: transaction.LOCK.UPDATE,
      transaction
    });
    
    if (!event) {
      await transaction.rollback();
      return errorResponse(res, 404, 'Event not found');
    }
    
    // Check ticket availability
    if (event.available_tickets < quantity) {
      await transaction.rollback();
      return errorResponse(res, 400, 'Insufficient ticket stock');
    }
    
    // Calculate total price
    const total_price = parseFloat(event.ticket_price) * quantity;
    
    // Create booking
    const booking = await Booking.create({
      user_id,
      event_id,
      quantity,
      total_price,
      status: 'pending'
    }, { transaction });
    
    // Update available tickets
    await event.update({
      available_tickets: event.available_tickets - quantity
    }, { transaction });
    
    // Commit transaction
    await transaction.commit();
    
    // Fetch booking with relations
    const createdBooking = await Booking.findByPk(booking.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Event,
          as: 'event',
          attributes: ['id', 'name', 'location', 'event_date', 'ticket_price']
        }
      ]
    });
    
    return successResponse(res, 201, 'Booking created successfully', createdBooking);
  } catch (error) {
    await transaction.rollback();
    console.error('Create booking error:', error);
    return errorResponse(res, 500, 'Failed to create booking', error.message);
  }
};

/**
 * Update booking status
 * PATCH /api/bookings/:id/status
 * Users can update own bookings, Admin can update any
 */
const updateBookingStatus = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      await transaction.rollback();
      return errorResponse(res, 400, 'Invalid status. Must be: pending, confirmed, or cancelled');
    }
    
    const booking = await Booking.findByPk(id, { transaction });
    
    if (!booking) {
      await transaction.rollback();
      return errorResponse(res, 404, 'Booking not found');
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      await transaction.rollback();
      return errorResponse(res, 403, 'You can only update your own bookings');
    }
    
    const previousStatus = booking.status;
    
    // If cancelling, restore tickets
    if (status === 'cancelled' && previousStatus !== 'cancelled') {
      const event = await Event.findByPk(booking.event_id, {
        lock: transaction.LOCK.UPDATE,
        transaction
      });
      
      await event.update({
        available_tickets: event.available_tickets + booking.quantity
      }, { transaction });
    }
    
    // Update booking status
    await booking.update({ status }, { transaction });
    
    await transaction.commit();
    
    return successResponse(res, 200, 'Booking status updated successfully', booking);
  } catch (error) {
    await transaction.rollback();
    console.error('Update booking status error:', error);
    return errorResponse(res, 500, 'Failed to update booking status', error.message);
  }
};

/**
 * Delete booking
 * DELETE /api/bookings/:id
 * Users can delete own bookings, Admin can delete any
 */
const deleteBooking = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    const booking = await Booking.findByPk(id, { transaction });
    
    if (!booking) {
      await transaction.rollback();
      return errorResponse(res, 404, 'Booking not found');
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      await transaction.rollback();
      return errorResponse(res, 403, 'You can only delete your own bookings');
    }
    
    // Restore tickets if booking is not cancelled
    if (booking.status !== 'cancelled') {
      const event = await Event.findByPk(booking.event_id, {
        lock: transaction.LOCK.UPDATE,
        transaction
      });
      
      await event.update({
        available_tickets: event.available_tickets + booking.quantity
      }, { transaction });
    }
    
    // Delete booking
    await booking.destroy({ transaction });
    
    await transaction.commit();
    
    return successResponse(res, 200, 'Booking deleted successfully');
  } catch (error) {
    await transaction.rollback();
    console.error('Delete booking error:', error);
    return errorResponse(res, 500, 'Failed to delete booking', error.message);
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  deleteBooking
};
