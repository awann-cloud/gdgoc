/**
 * @fileoverview Response Utilities
 * @description Standardized API response format helpers
 */

/**
 * API Response Helper Class
 */
class ApiResponse {
    /**
     * Success response (200)
     */
    static success(res, { message, data, meta }) {
        return res.status(200).json({
            success: true,
            message,
            data,
            ...(meta && { meta }),
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Created response (201)
     */
    static created(res, { message, data }) {
        return res.status(201).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * No content response (204)
     */
    static noContent(res) {
        return res.status(204).send();
    }
}

/**
 * API Error Class
 */
class ApiError extends Error {
    constructor(statusCode, message, code = 'ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {
    ApiResponse,
    ApiError
};
