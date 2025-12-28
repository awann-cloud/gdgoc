/**
 * @fileoverview Wishlist Routes
 * @description Express router for wishlist CRUD operations
 */

const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const wishlistController = require('../controllers/wishlist.controller');
const { validateRequest } = require('../middleware/validation.middleware');

// ===========================================
// Validation Schemas
// ===========================================

const createItemValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('price')
        .optional()
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category')
        .optional()
        .isIn(['elektronik', 'fashion', 'buku', 'hobi', 'rumah', 'travel', 'lainnya'])
        .withMessage('Invalid category'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high']).withMessage('Invalid priority level'),
    body('imageUrl')
        .optional()
        .isURL().withMessage('Invalid image URL')
];

const updateItemValidation = [
    param('id').isUUID().withMessage('Invalid item ID'),
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('price')
        .optional()
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category')
        .optional()
        .isIn(['elektronik', 'fashion', 'buku', 'hobi', 'rumah', 'travel', 'lainnya'])
        .withMessage('Invalid category'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high']).withMessage('Invalid priority level'),
    body('purchased')
        .optional()
        .isBoolean().withMessage('Purchased must be a boolean')
];

const idParamValidation = [
    param('id').isUUID().withMessage('Invalid item ID')
];

const queryValidation = [
    query('category').optional().isString(),
    query('purchased').optional().isBoolean(),
    query('priority').optional().isIn(['low', 'medium', 'high']),
    query('sort').optional().isIn(['newest', 'oldest', 'price-asc', 'price-desc', 'name', 'priority']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
];

// ===========================================
// Routes
// ===========================================

/**
 * @route   GET /api/v1/wishlist
 * @desc    Get all wishlist items with filtering and pagination
 * @access  Public
 */
router.get('/', queryValidation, validateRequest, wishlistController.getAllItems);

/**
 * @route   GET /api/v1/wishlist/stats/summary
 * @desc    Get wishlist statistics summary
 * @access  Public
 */
router.get('/stats/summary', wishlistController.getStats);

/**
 * @route   GET /api/v1/wishlist/:id
 * @desc    Get single wishlist item by ID
 * @access  Public
 */
router.get('/:id', idParamValidation, validateRequest, wishlistController.getItemById);

/**
 * @route   POST /api/v1/wishlist
 * @desc    Create new wishlist item
 * @access  Public
 */
router.post('/', createItemValidation, validateRequest, wishlistController.createItem);

/**
 * @route   PUT /api/v1/wishlist/:id
 * @desc    Update wishlist item
 * @access  Public
 */
router.put('/:id', updateItemValidation, validateRequest, wishlistController.updateItem);

/**
 * @route   PATCH /api/v1/wishlist/:id/toggle
 * @desc    Toggle purchased status
 * @access  Public
 */
router.patch('/:id/toggle', idParamValidation, validateRequest, wishlistController.togglePurchased);

/**
 * @route   DELETE /api/v1/wishlist/:id
 * @desc    Delete wishlist item
 * @access  Public
 */
router.delete('/:id', idParamValidation, validateRequest, wishlistController.deleteItem);

/**
 * @route   DELETE /api/v1/wishlist
 * @desc    Delete all purchased items (bulk delete)
 * @access  Public
 */
router.delete('/', wishlistController.deletePurchasedItems);

module.exports = router;
