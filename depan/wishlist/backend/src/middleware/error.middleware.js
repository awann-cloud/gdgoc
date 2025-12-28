/**
 * @fileoverview Error Handling Middleware
 * @description Centralized error handling for the API
 */

/**
 * 404 Not Found Handler
 */
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `Route ${req.method} ${req.originalUrl} not found`,
            timestamp: new Date().toISOString()
        }
    });
};

/**
 * Global Error Handler
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let code = err.code || 'INTERNAL_ERROR';

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        code = 'VALIDATION_ERROR';
    }

    if (err.name === 'SyntaxError' && err.type === 'entity.parse.failed') {
        statusCode = 400;
        message = 'Invalid JSON in request body';
        code = 'INVALID_JSON';
    }

    // Don't expose internal errors in production
    if (process.env.NODE_ENV === 'production' && statusCode === 500) {
        message = 'An unexpected error occurred';
    }

    res.status(statusCode).json({
        success: false,
        error: {
            code,
            message,
            ...(process.env.NODE_ENV === 'development' && {
                stack: err.stack
            }),
            timestamp: new Date().toISOString()
        }
    });
};

module.exports = {
    notFoundHandler,
    errorHandler
};
