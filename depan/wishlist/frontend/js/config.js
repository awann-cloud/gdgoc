/**
 * @fileoverview Application Configuration
 * @description Global configuration for the Wishlist App
 */

const CONFIG = {
    // API Configuration
    API: {
        BASE_URL: 'http://localhost:3000/api/v1',
        ENDPOINTS: {
            WISHLIST: '/wishlist',
            STATS: '/wishlist/stats/summary'
        },
        TIMEOUT: 10000
    },
    
    // Storage Configuration
    STORAGE: {
        KEY: 'wishlist-app-items',
        PREFERENCES_KEY: 'wishlist-app-preferences'
    },
    
    // UI Configuration
    UI: {
        ITEMS_PER_PAGE: 12,
        DEBOUNCE_DELAY: 300,
        NOTIFICATION_DURATION: 3000,
        ANIMATION_DURATION: 300
    },
    
    // Categories
    CATEGORIES: {
        elektronik: { label: 'Elektronik', icon: '📱', color: '#3b82f6' },
        fashion: { label: 'Fashion', icon: '👕', color: '#ec4899' },
        buku: { label: 'Buku', icon: '📚', color: '#8b5cf6' },
        hobi: { label: 'Hobi & Olahraga', icon: '🎮', color: '#10b981' },
        rumah: { label: 'Rumah & Dekorasi', icon: '🏠', color: '#f59e0b' },
        travel: { label: 'Travel', icon: '✈️', color: '#06b6d4' },
        lainnya: { label: 'Lainnya', icon: '📦', color: '#6b7280' }
    },
    
    // Priorities
    PRIORITIES: {
        high: { label: 'Tinggi', icon: '🔴', color: '#ef4444' },
        medium: { label: 'Medium', icon: '🟡', color: '#f59e0b' },
        low: { label: 'Rendah', icon: '🟢', color: '#10b981' }
    },
    
    // Use API or localStorage (set to false for offline mode)
    USE_API: true // Backend is running at localhost:3000
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
