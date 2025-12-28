// ============================================
// BOOKING CONTROLLER (ANTI-OVERSELLING)
// File: controllers/bookingController.js
// ============================================

const { Booking, Event, User } = require('../models');
const { sequelize } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Event,
          as: 'event',
          attributes: ['id', 'name', 'location', 'event_date']
        }
      ]
    });
    
    return successResponse(res, 200, 'Successfully retrieved bookings', bookings);
  } catch (error) {
    return errorResponse(res, 500, 'Failed to retrieve bookings', error.message);
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
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
    
    return successResponse(res, 200, 'Successfully retrieved booking', booking);
  } catch (error) {
    return errorResponse(res, 500, 'Failed to retrieve booking', error.message);
  }
};

// Create booking with anti-overselling
exports.createBooking = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { user_id, event_id, quantity } = req.body;
    
    // Lock event row to prevent race condition (ANTI-OVERSELLING!)
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
      return errorResponse(
        res,
        400,
        'Insufficient ticket stock',
        {
          available: event.available_tickets,
          requested: quantity
        }
      );
    }
    
    // Calculate total price
    const total_price = parseFloat(event.ticket_price) * quantity;
    
    // Update available tickets
    await event.update(
      { available_tickets: event.available_tickets - quantity },
      { transaction }
    );
    
    // Create booking
    const booking = await Booking.create(
      {
        user_id,
        event_id,
        quantity,
        total_price,
        status: 'confirmed',
        booking_date: new Date()
      },
      { transaction }
    );
    
    await transaction.commit();
    
    return successResponse(res, 201, 'Booking created successfully', booking);
  } catch (error) {
    await transaction.rollback();
    return errorResponse(res, 400, 'Failed to create booking', error.message);
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { status } = req.body;
    const booking = await Booking.findByPk(req.params.id, { transaction });
    
    if (!booking) {
      await transaction.rollback();
      return errorResponse(res, 404, 'Booking not found');
    }
    
    // If cancelling, restore tickets
    if (status === 'cancelled' && booking.status !== 'cancelled') {
      const event = await Event.findByPk(booking.event_id, {
        lock: transaction.LOCK.UPDATE,
        transaction
      });
      
      await event.update(
        { available_tickets: event.available_tickets + booking.quantity },
        { transaction }
      );
    }
    
    await booking.update({ status }, { transaction });
    await transaction.commit();
    
    return successResponse(res, 200, 'Booking status updated successfully', booking);
  } catch (error) {
    await transaction.rollback();
    return errorResponse(res, 400, 'Failed to update booking status', error.message);
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const booking = await Booking.findByPk(req.params.id, { transaction });
    
    if (!booking) {
      await transaction.rollback();
      return errorResponse(res, 404, 'Booking not found');
    }
    
    // Restore tickets if not cancelled
    if (booking.status !== 'cancelled') {
      const event = await Event.findByPk(booking.event_id, {
        lock: transaction.LOCK.UPDATE,
        transaction
      });
      
      await event.update(
        { available_tickets: event.available_tickets + booking.quantity },
        { transaction }
      );
    }
    
    await booking.destroy({ transaction });
    await transaction.commit();
    
    return successResponse(res, 200, 'Booking deleted successfully');
  } catch (error) {
    await transaction.rollback();
    return errorResponse(res, 500, 'Failed to delete booking', error.message);
  }
};
