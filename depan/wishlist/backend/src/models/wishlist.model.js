/**
 * @fileoverview Wishlist Model
 * @description Data model for wishlist items with JSON file storage
 */

const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class WishlistModel {
    constructor() {
        this.dataDir = path.join(__dirname, '../../data');
        this.dataFile = path.join(this.dataDir, 'wishlist.json');
        this.items = [];
        this.initialized = false;
    }

    /**
     * Initialize data directory and load existing data
     */
    async init() {
        if (this.initialized) return;

        try {
            // Ensure data directory exists
            await fs.mkdir(this.dataDir, { recursive: true });

            // Try to load existing data
            try {
                const data = await fs.readFile(this.dataFile, 'utf-8');
                this.items = JSON.parse(data);
            } catch (err) {
                // File doesn't exist, start with empty array
                this.items = [];
                await this.save();
            }

            this.initialized = true;
        } catch (error) {
            console.error('Error initializing WishlistModel:', error);
            throw error;
        }
    }

    /**
     * Save data to JSON file
     */
    async save() {
        try {
            await fs.writeFile(
                this.dataFile,
                JSON.stringify(this.items, null, 2),
                'utf-8'
            );
        } catch (error) {
            console.error('Error saving data:', error);
            throw error;
        }
    }

    /**
     * Get all items with filtering, sorting, and pagination
     * @param {Object} options - Query options
     * @returns {Object} Paginated result
     */
    async getAll({ filters = {}, sort = 'newest', page = 1, limit = 10 } = {}) {
        await this.init();

        let filtered = [...this.items];

        // Apply filters
        if (filters.category) {
            filtered = filtered.filter(item => item.category === filters.category);
        }
        if (filters.purchased !== undefined) {
            filtered = filtered.filter(item => item.purchased === filters.purchased);
        }
        if (filters.priority) {
            filtered = filtered.filter(item => item.priority === filters.priority);
        }
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchTerm) ||
                item.description?.toLowerCase().includes(searchTerm)
            );
        }

        // Apply sorting
        const sortFunctions = {
            'newest': (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
            'oldest': (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            'price-asc': (a, b) => (a.price || 0) - (b.price || 0),
            'price-desc': (a, b) => (b.price || 0) - (a.price || 0),
            'name': (a, b) => a.name.localeCompare(b.name),
            'priority': (a, b) => {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
        };

        if (sortFunctions[sort]) {
            filtered.sort(sortFunctions[sort]);
        }

        // Apply pagination
        const total = filtered.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const items = filtered.slice(startIndex, startIndex + limit);

        return {
            items,
            total,
            page,
            limit,
            totalPages
        };
    }

    /**
     * Get single item by ID
     * @param {string} id - Item ID
     * @returns {Object|null} Item or null
     */
    async getById(id) {
        await this.init();
        return this.items.find(item => item.id === id) || null;
    }

    /**
     * Create new item
     * @param {Object} itemData - Item data
     * @returns {Object} Created item
     */
    async create(itemData) {
        await this.init();

        const newItem = {
            id: uuidv4(),
            name: itemData.name,
            price: itemData.price || 0,
            category: itemData.category || 'lainnya',
            description: itemData.description || '',
            priority: itemData.priority || 'medium',
            imageUrl: itemData.imageUrl || null,
            purchased: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.items.unshift(newItem);
        await this.save();

        return newItem;
    }

    /**
     * Update item
     * @param {string} id - Item ID
     * @param {Object} updates - Update data
     * @returns {Object} Updated item
     */
    async update(id, updates) {
        await this.init();

        const index = this.items.findIndex(item => item.id === id);
        if (index === -1) return null;

        this.items[index] = {
            ...this.items[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        await this.save();
        return this.items[index];
    }

    /**
     * Toggle purchased status
     * @param {string} id - Item ID
     * @returns {Object} Updated item
     */
    async togglePurchased(id) {
        await this.init();

        const index = this.items.findIndex(item => item.id === id);
        if (index === -1) return null;

        this.items[index].purchased = !this.items[index].purchased;
        this.items[index].updatedAt = new Date().toISOString();

        if (this.items[index].purchased) {
            this.items[index].purchasedAt = new Date().toISOString();
        } else {
            delete this.items[index].purchasedAt;
        }

        await this.save();
        return this.items[index];
    }

    /**
     * Delete item
     * @param {string} id - Item ID
     * @returns {boolean} Success status
     */
    async delete(id) {
        await this.init();

        const index = this.items.findIndex(item => item.id === id);
        if (index === -1) return false;

        this.items.splice(index, 1);
        await this.save();

        return true;
    }

    /**
     * Delete all purchased items
     * @returns {number} Number of deleted items
     */
    async deletePurchased() {
        await this.init();

        const originalLength = this.items.length;
        this.items = this.items.filter(item => !item.purchased);
        const deletedCount = originalLength - this.items.length;

        await this.save();
        return deletedCount;
    }

    /**
     * Get statistics
     * @returns {Object} Statistics object
     */
    async getStats() {
        await this.init();

        const total = this.items.length;
        const purchased = this.items.filter(item => item.purchased).length;
        const pending = total - purchased;
        const totalValue = this.items.reduce((sum, item) => sum + (item.price || 0), 0);
        const purchasedValue = this.items
            .filter(item => item.purchased)
            .reduce((sum, item) => sum + (item.price || 0), 0);

        // Category breakdown
        const byCategory = this.items.reduce((acc, item) => {
            const cat = item.category || 'lainnya';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {});

        // Priority breakdown
        const byPriority = this.items.reduce((acc, item) => {
            const pri = item.priority || 'medium';
            acc[pri] = (acc[pri] || 0) + 1;
            return acc;
        }, {});

        return {
            total,
            purchased,
            pending,
            totalValue,
            purchasedValue,
            pendingValue: totalValue - purchasedValue,
            completionRate: total > 0 ? Math.round((purchased / total) * 100) : 0,
            byCategory,
            byPriority
        };
    }
}

module.exports = WishlistModel;
