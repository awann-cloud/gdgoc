/**
 * @fileoverview Local Storage Service
 * @description Handles localStorage operations for offline mode
 */

class StorageService {
    constructor() {
        this.storageKey = CONFIG.STORAGE.KEY;
        this.preferencesKey = CONFIG.STORAGE.PREFERENCES_KEY;
    }

    // ==========================================
    // Item Operations
    // ==========================================

    /**
     * Get all items from localStorage
     * @returns {Array} Items array
     */
    getItems() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    }

    /**
     * Save items to localStorage
     * @param {Array} items - Items to save
     */
    saveItems(items) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(items));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            throw new Error('Failed to save data');
        }
    }

    /**
     * Get single item by ID
     * @param {string} id - Item ID
     * @returns {Object|null} Item or null
     */
    getItem(id) {
        const items = this.getItems();
        return items.find(item => item.id === id) || null;
    }

    /**
     * Create new item
     * @param {Object} itemData - Item data
     * @returns {Object} Created item
     */
    createItem(itemData) {
        const items = this.getItems();
        
        const newItem = {
            id: this.generateId(),
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

        items.unshift(newItem);
        this.saveItems(items);

        return newItem;
    }

    /**
     * Update item
     * @param {string} id - Item ID
     * @param {Object} updates - Update data
     * @returns {Object|null} Updated item or null
     */
    updateItem(id, updates) {
        const items = this.getItems();
        const index = items.findIndex(item => item.id === id);

        if (index === -1) return null;

        items[index] = {
            ...items[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.saveItems(items);
        return items[index];
    }

    /**
     * Toggle purchased status
     * @param {string} id - Item ID
     * @returns {Object|null} Updated item or null
     */
    togglePurchased(id) {
        const items = this.getItems();
        const index = items.findIndex(item => item.id === id);

        if (index === -1) return null;

        items[index].purchased = !items[index].purchased;
        items[index].updatedAt = new Date().toISOString();

        if (items[index].purchased) {
            items[index].purchasedAt = new Date().toISOString();
        } else {
            delete items[index].purchasedAt;
        }

        this.saveItems(items);
        return items[index];
    }

    /**
     * Delete item
     * @param {string} id - Item ID
     * @returns {boolean} Success status
     */
    deleteItem(id) {
        const items = this.getItems();
        const filtered = items.filter(item => item.id !== id);

        if (filtered.length === items.length) return false;

        this.saveItems(filtered);
        return true;
    }

    /**
     * Delete all purchased items
     * @returns {number} Number of deleted items
     */
    deletePurchased() {
        const items = this.getItems();
        const filtered = items.filter(item => !item.purchased);
        const deletedCount = items.length - filtered.length;

        this.saveItems(filtered);
        return deletedCount;
    }

    /**
     * Get filtered and sorted items
     * @param {Object} options - Filter options
     * @returns {Object} Paginated result
     */
    getFilteredItems({ filters = {}, sort = 'newest', page = 1, limit = 12 } = {}) {
        let items = this.getItems();

        // Apply filters
        if (filters.category) {
            items = items.filter(item => item.category === filters.category);
        }
        if (filters.priority) {
            items = items.filter(item => item.priority === filters.priority);
        }
        if (filters.purchased !== undefined) {
            items = items.filter(item => item.purchased === filters.purchased);
        }
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            items = items.filter(item =>
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
                const order = { high: 0, medium: 1, low: 2 };
                return order[a.priority] - order[b.priority];
            }
        };

        if (sortFunctions[sort]) {
            items.sort(sortFunctions[sort]);
        }

        // Pagination
        const total = items.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const paginatedItems = items.slice(startIndex, startIndex + limit);

        return {
            items: paginatedItems,
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        };
    }

    /**
     * Get statistics
     * @returns {Object} Statistics
     */
    getStats() {
        const items = this.getItems();
        const total = items.length;
        const purchased = items.filter(item => item.purchased).length;
        const pending = total - purchased;
        const totalValue = items.reduce((sum, item) => sum + (item.price || 0), 0);
        const purchasedValue = items
            .filter(item => item.purchased)
            .reduce((sum, item) => sum + (item.price || 0), 0);

        // Category breakdown
        const byCategory = items.reduce((acc, item) => {
            const cat = item.category || 'lainnya';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {});

        // Priority breakdown
        const byPriority = items.reduce((acc, item) => {
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

    // ==========================================
    // Preferences
    // ==========================================

    /**
     * Get user preferences
     * @returns {Object} Preferences
     */
    getPreferences() {
        try {
            const data = localStorage.getItem(this.preferencesKey);
            return data ? JSON.parse(data) : {
                theme: 'light',
                viewMode: 'grid',
                showPurchased: false
            };
        } catch {
            return { theme: 'light', viewMode: 'grid', showPurchased: false };
        }
    }

    /**
     * Save user preferences
     * @param {Object} preferences - Preferences to save
     */
    savePreferences(preferences) {
        try {
            localStorage.setItem(this.preferencesKey, JSON.stringify(preferences));
        } catch (error) {
            console.error('Error saving preferences:', error);
        }
    }

    // ==========================================
    // Utility
    // ==========================================

    /**
     * Generate unique ID
     * @returns {string} UUID
     */
    generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

// Create singleton instance
const storage = new StorageService();
