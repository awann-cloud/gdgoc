// ============================================
// TICKET PLATFORM API - SOAL 3 (with JWT)
// Author: Nuredy Rahma Gunawan
// Tech: Node.js + Express + Sequelize + JWT
// Architecture: MVC with Authentication
// ============================================

require('dotenv').config();
const express = require('express');
const { sequelize, testConnection, syncModels } = require('./config/database');
const { User, Event, Booking } = require('./models');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Request logger (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// ROUTES
// ============================================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'GDGoC UNSRI - Ticket Platform API (Soal 3 - with JWT)',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/me (protected)'
      },
      events: {
        list: 'GET /api/events (public)',
        detail: 'GET /api/events/:id (public)',
        create: 'POST /api/events (admin only)',
        update: 'PUT /api/events/:id (admin only)',
        delete: 'DELETE /api/events/:id (admin only)'
      },
      bookings: {
        list: 'GET /api/bookings (protected)',
        detail: 'GET /api/bookings/:id (protected)',
        create: 'POST /api/bookings (protected)',
        updateStatus: 'PATCH /api/bookings/:id/status (protected)',
        delete: 'DELETE /api/bookings/:id (protected)'
      }
    },
    notes: {
      authentication: 'Use Bearer token in Authorization header',
      roles: 'admin | user',
      anti_overselling: 'Implemented with Sequelize transactions and row locking'
    }
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
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
  console.error('Error:', err.stack);
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
    console.log('Initializing Soal 3 - JWT Ticket Platform...');
    
    // Test database connection
    console.log('1️⃣  Connecting to database...');
    await testConnection();
    
    // Sync models
    console.log('2️⃣  Syncing database models...');
    await syncModels();
    
    // Start server
    console.log('3️⃣  Starting HTTP server...');
    const server = app.listen(PORT, '127.0.0.1', () => {
      console.log('\n' + '='.repeat(50));
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/`);
      console.log(`🔐 JWT Authentication enabled`);
      console.log(`🛡️  Anti-Overselling protection active`);
      console.log('='.repeat(50) + '\n');
    });
    
    // Handle server errors
    server.on('error', (err) => {
      console.error('\n❌ SERVER ERROR:');
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      } else {
        console.error(err.message);
      }
      process.exit(1);
    });
    
  } catch (error) {
    console.error('\n❌ STARTUP FAILED:');
    console.error('Error:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
};

startServer();
