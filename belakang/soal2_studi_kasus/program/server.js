// ============================================
// TICKET PLATFORM API - SOAL 2 (NATIVE)
// Author: [Nama Anda]
// Tech: Node.js + Express + Sequelize
// Architecture: MVC (Models, Controllers, Routes)
// ============================================

require('dotenv').config();
const express = require('express');
const { sequelize, testConnection } = require('./config/database');

// Import Routes
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware (optional)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// ============================================
// ROUTES
// ============================================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'GDGoC UNSRI - Ticket Platform API (Soal 2 - Native)',
    version: '1.0.0',
    endpoints: {
      users: {
        list: 'GET /api/users',
        detail: 'GET /api/users/:id',
        create: 'POST /api/users',
        update: 'PUT /api/users/:id',
        delete: 'DELETE /api/users/:id'
      },
      events: {
        list: 'GET /api/events',
        detail: 'GET /api/events/:id',
        create: 'POST /api/events',
        update: 'PUT /api/events/:id',
        delete: 'DELETE /api/events/:id'
      },
      bookings: {
        list: 'GET /api/bookings',
        detail: 'GET /api/bookings/:id',
        create: 'POST /api/bookings (Anti-Overselling)',
        updateStatus: 'PATCH /api/bookings/:id/status',
        delete: 'DELETE /api/bookings/:id'
      }
    },
    features: [
      'Native CRUD Implementation',
      'Anti-Overselling with Transactions',
      'Password Hashing with bcrypt',
      'Clean MVC Architecture'
    ]
  });
});

// Mount Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============================================
// DATABASE SYNC & SERVER START
// ============================================
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Sync models (alter: true will update tables without dropping)
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synced successfully');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/`);
      console.log(`📁 Architecture: MVC (Models, Controllers, Routes)`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
