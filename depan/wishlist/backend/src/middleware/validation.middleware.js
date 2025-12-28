/**
 * @fileoverview Validation Middleware
 * @description Request validation using express-validator
 */

const { validationResult } = require('express-validator');

/**
 * Validate request and return errors if any
 */
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
            field: err.path,
            message: err.msg,
            value: err.value
        }));

        return res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid request data',
                details: formattedErrors,
                timestamp: new Date().toISOString()
            }
        });
    }

    next();
};

module.exports = {
    validateRequest
};
