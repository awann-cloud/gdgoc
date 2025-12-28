/**
 * @fileoverview Wishlist Controller
 * @description Handles all wishlist CRUD operations
 */

const WishlistModel = require('../models/wishlist.model');
const { ApiResponse, ApiError } = require('../utils/response.util');

// Initialize model
const wishlistModel = new WishlistModel();

/**
 * @desc    Get all wishlist items with filtering, sorting, and pagination
 * @route   GET /api/v1/wishlist
 */
exports.getAllItems = async (req, res, next) => {
    try {
        const {
            category,
            purchased,
            priority,
            sort = 'newest',
            page = 1,
            limit = 10,
            search
        } = req.query;

        // Build filters
        const filters = {};
        if (category) filters.category = category;
        if (purchased !== undefined) filters.purchased = purchased === 'true';
        if (priority) filters.priority = priority;
        if (search) filters.search = search;

        // Get items with filters
        const result = await wishlistModel.getAll({
            filters,
            sort,
            page: parseInt(page),
            limit: parseInt(limit)
        });

        return ApiResponse.success(res, {
            message: 'Items retrieved successfully',
            data: result.items,
            meta: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
                hasNextPage: result.page < result.totalPages,
                hasPrevPage: result.page > 1
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single wishlist item by ID
 * @route   GET /api/v1/wishlist/:id
 */
exports.getItemById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await wishlistModel.getById(id);

        if (!item) {
            throw new ApiError(404, 'Item not found', 'ITEM_NOT_FOUND');
        }

        return ApiResponse.success(res, {
            message: 'Item retrieved successfully',
            data: item
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create new wishlist item
 * @route   POST /api/v1/wishlist
 */
exports.createItem = async (req, res, next) => {
    try {
        const { name, price, category, description, priority, imageUrl } = req.body;

        const newItem = await wishlistModel.create({
            name: name.trim(),
            price: price ? parseFloat(price) : 0,
            category: category || 'lainnya',
            description: description?.trim() || '',
            priority: priority || 'medium',
            imageUrl: imageUrl || null
        });

        return ApiResponse.created(res, {
            message: 'Item created successfully',
            data: newItem
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update wishlist item
 * @route   PUT /api/v1/wishlist/:id
 */
exports.updateItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Check if item exists
        const existingItem = await wishlistModel.getById(id);
        if (!existingItem) {
            throw new ApiError(404, 'Item not found', 'ITEM_NOT_FOUND');
        }

        // Sanitize updates
        const sanitizedUpdates = {};
        if (updates.name !== undefined) sanitizedUpdates.name = updates.name.trim();
        if (updates.price !== undefined) sanitizedUpdates.price = parseFloat(updates.price);
        if (updates.category !== undefined) sanitizedUpdates.category = updates.category;
        if (updates.description !== undefined) sanitizedUpdates.description = updates.description.trim();
        if (updates.priority !== undefined) sanitizedUpdates.priority = updates.priority;
        if (updates.purchased !== undefined) sanitizedUpdates.purchased = updates.purchased;
        if (updates.imageUrl !== undefined) sanitizedUpdates.imageUrl = updates.imageUrl;

        const updatedItem = await wishlistModel.update(id, sanitizedUpdates);

        return ApiResponse.success(res, {
            message: 'Item updated successfully',
            data: updatedItem
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Toggle purchased status
 * @route   PATCH /api/v1/wishlist/:id/toggle
 */
exports.togglePurchased = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if item exists
        const existingItem = await wishlistModel.getById(id);
        if (!existingItem) {
            throw new ApiError(404, 'Item not found', 'ITEM_NOT_FOUND');
        }

        const updatedItem = await wishlistModel.togglePurchased(id);

        return ApiResponse.success(res, {
            message: `Item marked as ${updatedItem.purchased ? 'purchased' : 'not purchased'}`,
            data: updatedItem
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete wishlist item
 * @route   DELETE /api/v1/wishlist/:id
 */
exports.deleteItem = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if item exists
        const existingItem = await wishlistModel.getById(id);
        if (!existingItem) {
            throw new ApiError(404, 'Item not found', 'ITEM_NOT_FOUND');
        }

        await wishlistModel.delete(id);

        return ApiResponse.success(res, {
            message: 'Item deleted successfully',
            data: { id }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete all purchased items
 * @route   DELETE /api/v1/wishlist
 */
exports.deletePurchasedItems = async (req, res, next) => {
    try {
        const deletedCount = await wishlistModel.deletePurchased();

        return ApiResponse.success(res, {
            message: `${deletedCount} purchased items deleted successfully`,
            data: { deletedCount }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get wishlist statistics
 * @route   GET /api/v1/wishlist/stats/summary
 */
exports.getStats = async (req, res, next) => {
    try {
        const stats = await wishlistModel.getStats();

        return ApiResponse.success(res, {
            message: 'Statistics retrieved successfully',
            data: stats
        });
    } catch (error) {
        next(error);
    }
};
