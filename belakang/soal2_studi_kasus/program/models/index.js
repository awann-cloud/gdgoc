// ============================================
// MODEL RELATIONSHIPS
// File: models/index.js
// ============================================

const User = require('./User');
const Event = require('./Event');
const Booking = require('./Booking');

// Define relationships
Event.belongsTo(User, { foreignKey: 'organizer_id', as: 'organizer' });
User.hasMany(Event, { foreignKey: 'organizer_id', as: 'organized_events' });

Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Booking.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });

User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
Event.hasMany(Booking, { foreignKey: 'event_id', as: 'bookings' });

module.exports = {
  User,
  Event,
  Booking
};
