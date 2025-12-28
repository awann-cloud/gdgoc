/**
 * @fileoverview API Service
 * @description Handles all API calls to the backend
 */

class ApiService {
    constructor() {
        this.baseUrl = CONFIG.API.BASE_URL;
        this.timeout = CONFIG.API.TIMEOUT;
    }

    /**
     * Make HTTP request with timeout and error handling
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Fetch options
     * @returns {Promise<Object>} Response data
     */
    async request(endpoint, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const data = await response.json();

            if (!response.ok) {
                throw new ApiError(
                    data.error?.message || 'Request failed',
                    response.status,
                    data.error?.code
                );
            }

            return data;
        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new ApiError('Request timeout', 408, 'TIMEOUT');
            }

            if (error instanceof ApiError) {
                throw error;
            }

            console.error('API request error', { endpoint, options, error });
            throw new ApiError(
                'Network error. Please check your connection.',
                0,
                'NETWORK_ERROR'
            );
        }
    }

    // ==========================================
    // Wishlist API Methods
    // ==========================================

    /**
     * Get all wishlist items
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} Items and metadata
     */
    async getItems(params = {}) {
        // Filter out undefined/null/empty values
        const cleanParams = {};
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== null && value !== '') {
                cleanParams[key] = value;
            }
        }
        const queryString = new URLSearchParams(cleanParams).toString();
        const endpoint = `${CONFIG.API.ENDPOINTS.WISHLIST}${queryString ? `?${queryString}` : ''}`;
        return this.request(endpoint);
    }

    /**
     * Get single item by ID
     * @param {string} id - Item ID
     * @returns {Promise<Object>} Item data
     */
    async getItem(id) {
        return this.request(`${CONFIG.API.ENDPOINTS.WISHLIST}/${id}`);
    }

    /**
     * Create new item
     * @param {Object} itemData - Item data
     * @returns {Promise<Object>} Created item
     */
    async createItem(itemData) {
        return this.request(CONFIG.API.ENDPOINTS.WISHLIST, {
            method: 'POST',
            body: JSON.stringify(itemData)
        });
    }

    /**
     * Update item
     * @param {string} id - Item ID
     * @param {Object} updates - Update data
     * @returns {Promise<Object>} Updated item
     */
    async updateItem(id, updates) {
        return this.request(`${CONFIG.API.ENDPOINTS.WISHLIST}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    }

    /**
     * Toggle purchased status
     * @param {string} id - Item ID
     * @returns {Promise<Object>} Updated item
     */
    async togglePurchased(id) {
        return this.request(`${CONFIG.API.ENDPOINTS.WISHLIST}/${id}/toggle`, {
            method: 'PATCH'
        });
    }

    /**
     * Delete item
     * @param {string} id - Item ID
     * @returns {Promise<Object>} Response
     */
    async deleteItem(id) {
        return this.request(`${CONFIG.API.ENDPOINTS.WISHLIST}/${id}`, {
            method: 'DELETE'
        });
    }

    /**
     * Delete all purchased items
     * @returns {Promise<Object>} Response with deleted count
     */
    async deletePurchased() {
        return this.request(CONFIG.API.ENDPOINTS.WISHLIST, {
            method: 'DELETE'
        });
    }

    /**
     * Get statistics
     * @returns {Promise<Object>} Statistics data
     */
    async getStats() {
        return this.request(CONFIG.API.ENDPOINTS.STATS);
    }
}

/**
 * Custom API Error class
 */
class ApiError extends Error {
    constructor(message, status, code) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
    }
}

// Create singleton instance
const api = new ApiService();
