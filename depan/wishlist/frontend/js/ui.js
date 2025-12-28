/**
 * @fileoverview UI Utilities
 * @description Helper functions for UI rendering and interactions
 */

const UI = {
    // ==========================================
    // DOM Utilities
    // ==========================================

    /**
     * Get element by ID
     * @param {string} id - Element ID
     * @returns {HTMLElement|null} Element
     */
    $(id) {
        return document.getElementById(id);
    },

    /**
     * Query selector
     * @param {string} selector - CSS selector
     * @returns {HTMLElement|null} Element
     */
    $$(selector) {
        return document.querySelector(selector);
    },

    /**
     * Query selector all
     * @param {string} selector - CSS selector
     * @returns {NodeList} Elements
     */
    $$$(selector) {
        return document.querySelectorAll(selector);
    },

    // ==========================================
    // Notifications
    // ==========================================

    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, warning, info)
     * @param {number} duration - Duration in ms
     */
    notify(message, type = 'info', duration = CONFIG.UI.NOTIFICATION_DURATION) {
        const container = this.$('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        notification.innerHTML = `
            <i class="${icons[type] || icons.info}"></i>
            <span>${message}</span>
            <button class="notification-close" aria-label="Close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Close button handler
        notification.querySelector('.notification-close').onclick = () => {
            this.removeNotification(notification);
        };

        container.appendChild(notification);

        // Trigger animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Auto remove
        setTimeout(() => {
            this.removeNotification(notification);
        }, duration);
    },

    /**
     * Remove notification with animation
     * @param {HTMLElement} notification - Notification element
     */
    removeNotification(notification) {
        notification.classList.remove('show');
        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
        }, 300);
    },

    // ==========================================
    // Loading States
    // ==========================================

    /**
     * Show loading overlay
     */
    showLoading() {
        const overlay = this.$('loadingOverlay');
        if (overlay) overlay.classList.add('show');
    },

    /**
     * Hide loading overlay
     */
    hideLoading() {
        const overlay = this.$('loadingOverlay');
        if (overlay) overlay.classList.remove('show');
    },

    /**
     * Show list loading
     */
    showListLoading() {
        const loading = this.$('listLoading');
        const items = this.$('wishlistItems');
        if (loading) loading.style.display = 'flex';
        if (items) items.style.display = 'none';
    },

    /**
     * Hide list loading
     */
    hideListLoading() {
        const loading = this.$('listLoading');
        const items = this.$('wishlistItems');
        if (loading) loading.style.display = 'none';
        if (items) items.style.display = '';
    },

    // ==========================================
    // Modal
    // ==========================================

    /**
     * Show modal
     * @param {string} modalId - Modal ID
     */
    showModal(modalId) {
        const modal = this.$(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    },

    /**
     * Hide modal
     * @param {string} modalId - Modal ID
     */
    hideModal(modalId) {
        const modal = this.$(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    },

    // ==========================================
    // Formatting
    // ==========================================

    /**
     * Format currency to IDR
     * @param {number} amount - Amount
     * @returns {string} Formatted currency
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },

    /**
     * Format date to locale string
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date
     */
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    /**
     * Format relative time
     * @param {string} dateString - ISO date string
     * @returns {string} Relative time
     */
    formatRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 7) return this.formatDate(dateString);
        if (days > 0) return `${days} hari lalu`;
        if (hours > 0) return `${hours} jam lalu`;
        if (minutes > 0) return `${minutes} menit lalu`;
        return 'Baru saja';
    },

    // ==========================================
    // Item Card Rendering
    // ==========================================

    /**
     * Create item card HTML
     * @param {Object} item - Item data
     * @returns {string} HTML string
     */
    createItemCard(item) {
        const category = CONFIG.CATEGORIES[item.category] || CONFIG.CATEGORIES.lainnya;
        const priority = CONFIG.PRIORITIES[item.priority] || CONFIG.PRIORITIES.medium;

        return `
            <article class="item-card ${item.purchased ? 'purchased' : ''}" data-id="${item.id}">
                <div class="item-header">
                    <span class="item-category" style="--category-color: ${category.color}">
                        ${category.icon} ${category.label}
                    </span>
                    <span class="item-priority priority-${item.priority}" title="Prioritas: ${priority.label}">
                        ${priority.icon}
                    </span>
                </div>
                
                ${item.imageUrl ? `
                    <div class="item-image">
                        <img src="${item.imageUrl}" alt="${item.name}" loading="lazy" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-image\\'></i>'">
                    </div>
                ` : ''}
                
                <div class="item-content">
                    <h4 class="item-name">${this.escapeHtml(item.name)}</h4>
                    ${item.description ? `
                        <p class="item-description">${this.escapeHtml(item.description)}</p>
                    ` : ''}
                    ${item.price > 0 ? `
                        <p class="item-price">${this.formatCurrency(item.price)}</p>
                    ` : ''}
                </div>
                
                <div class="item-footer">
                    <span class="item-date" title="${new Date(item.createdAt).toLocaleString('id-ID')}">
                        <i class="fas fa-clock"></i>
                        ${this.formatRelativeTime(item.createdAt)}
                    </span>
                    
                    <div class="item-actions">
                        <button class="btn btn-icon btn-toggle ${item.purchased ? 'active' : ''}" 
                                data-action="toggle" 
                                data-id="${item.id}"
                                title="${item.purchased ? 'Tandai belum terbeli' : 'Tandai sudah terbeli'}">
                            <i class="fas ${item.purchased ? 'fa-check-circle' : 'fa-circle'}"></i>
                        </button>
                        <button class="btn btn-icon" 
                                data-action="edit" 
                                data-id="${item.id}"
                                title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-icon btn-danger" 
                                data-action="delete" 
                                data-id="${item.id}"
                                title="Hapus">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                ${item.purchased ? `
                    <div class="purchased-badge">
                        <i class="fas fa-check"></i>
                        Terbeli
                    </div>
                ` : ''}
            </article>
        `;
    },

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // ==========================================
    // Debounce
    // ==========================================

    /**
     * Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    debounce(func, wait = CONFIG.UI.DEBOUNCE_DELAY) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};
