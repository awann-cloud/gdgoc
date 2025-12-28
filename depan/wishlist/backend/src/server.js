/**
 * @fileoverview Main Express Server Configuration
 * @description Entry point for the Wishlist API server
 * @author GDGoC Member
 * @version 1.0.0
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Import routes
const wishlistRoutes = require('./routes/wishlist.routes');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');

// Initialize Express app
const app = express();

// ===========================================
// Security Middleware
// ===========================================

// Helmet - Security headers
app.use(helmet());

// CORS Configuration
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
    maxAge: 86400 // 24 hours
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Rate Limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests, please try again later.'
        }
    },
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api', limiter);

// ===========================================
// Body Parsing Middleware
// ===========================================

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ===========================================
// Logging Middleware
// ===========================================

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// ===========================================
// Static Files (for frontend)
// ===========================================

app.use(express.static(path.join(__dirname, '../../frontend')));

// ===========================================
// API Routes
// ===========================================

const API_PREFIX = process.env.API_PREFIX || '/api';
const API_VERSION = process.env.API_VERSION || 'v1';

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API Documentation endpoint
app.get(`${API_PREFIX}`, (req, res) => {
    res.json({
        success: true,
        message: 'Wishlist API - GDGoC Frontend Task',
        version: API_VERSION,
        endpoints: {
            wishlist: {
                'GET /api/v1/wishlist': 'Get all wishlist items',
                'GET /api/v1/wishlist/:id': 'Get single wishlist item',
                'POST /api/v1/wishlist': 'Create new wishlist item',
                'PUT /api/v1/wishlist/:id': 'Update wishlist item',
                'PATCH /api/v1/wishlist/:id/toggle': 'Toggle purchased status',
                'DELETE /api/v1/wishlist/:id': 'Delete wishlist item',
                'GET /api/v1/wishlist/stats/summary': 'Get wishlist statistics'
            }
        },
        documentation: 'https://github.com/yourusername/wishlist-app'
    });
});

// Wishlist routes
app.use(`${API_PREFIX}/${API_VERSION}/wishlist`, wishlistRoutes);

// ===========================================
// Error Handling
// ===========================================

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// ===========================================
// Server Initialization
// ===========================================

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`

Backend API berjalan di http://localhost:${PORT}                    
Frontend accessible di http://localhost:${PORT}
API endpoints di http://localhost:${PORT}${API_PREFIX}/${API_VERSION}          
Health check di http://localhost:${PORT}/health
Environment: ${process.env.NODE_ENV || 'development'}
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\nSIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated.');
        process.exit(0);
    });
});

module.exports = app;
