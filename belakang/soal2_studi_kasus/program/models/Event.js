// ============================================
// EVENT MODEL
// File: models/Event.js
// ============================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  organizer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Event name is required'
      }
    }
  },
  description: {
    type: DataTypes.TEXT
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Location is required'
      }
    }
  },
  event_date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'Invalid date format'
      }
    }
  },
  ticket_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Ticket price must be positive'
      }
    }
  },
  total_tickets: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [1],
        msg: 'Total tickets must be at least 1'
      }
    }
  },
  available_tickets: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Available tickets cannot be negative'
      }
    }
  }
}, {
  tableName: 'events',
  timestamps: true
});

module.exports = Event;
