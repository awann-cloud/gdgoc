/**
 * Wishlist App - Main JavaScript
 * Mengelola CRUD operations untuk wishlist items
 */

// ===========================
// Storage & State Management
// ===========================

class WishlistManager {
    constructor() {
        this.storageKey = 'wishlist-app-items';
        this.items = this.loadFromStorage();
        this.showPurchased = false;
        this.currentFilter = '';
        this.currentSort = 'newest';
    }

    /**
     * Load items from localStorage
     */
    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading from storage:', error);
            return [];
        }
    }

    /**
     * Save items to localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.items));
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    /**
     * Add new item
     */
    addItem(item) {
        const newItem = {
            id: Date.now(),
            name: item.name,
            price: item.price || 0,
            category: item.category || '',
            description: item.description || '',
            purchased: false,
            createdAt: new Date().toISOString()
        };
        this.items.unshift(newItem);
        this.saveToStorage();
        return newItem;
    }

    /**
     * Update item
     */
    updateItem(id, updates) {
        const item = this.items.find(i => i.id === id);
        if (item) {
            Object.assign(item, updates);
            this.saveToStorage();
        }
        return item;
    }

    /**
     * Delete item
     */
    deleteItem(id) {
        this.items = this.items.filter(i => i.id !== id);
        this.saveToStorage();
    }

    /**
     * Get filtered and sorted items
     */
    getFilteredItems() {
        let filtered = this.items;

        // Filter by category
        if (this.currentFilter) {
            filtered = filtered.filter(item => item.category === this.currentFilter);
        }

        // Filter purchased items
        if (!this.showPurchased) {
            filtered = filtered.filter(item => !item.purchased);
        }

        // Sort
        const sorted = [...filtered];
        switch (this.currentSort) {
            case 'oldest':
                sorted.reverse();
                break;
            case 'price-low':
                sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case 'price-high':
                sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            // 'newest' is default (already reverse sorted)
        }

        return sorted;
    }

    /**
     * Get stats
     */
    getStats() {
        const unpurchased = this.items.filter(i => !i.purchased);
        const purchased = this.items.filter(i => i.purchased);
        const totalPrice = unpurchased.reduce((sum, item) => sum + (item.price || 0), 0);

        return {
            total: this.items.length,
            unpurchased: unpurchased.length,
            purchased: purchased.length,
            totalPrice: totalPrice
        };
    }
}

// ===========================
// Initialize App
// ===========================

const manager = new WishlistManager();

// Get DOM elements
const addItemForm = document.getElementById('addItemForm');
const itemNameInput = document.getElementById('itemName');
const itemPriceInput = document.getElementById('itemPrice');
const itemCategoryInput = document.getElementById('itemCategory');
const itemDescriptionInput = document.getElementById('itemDescription');
const wishlistContainer = document.getElementById('wishlistContainer');
const categoryFilter = document.getElementById('categoryFilter');
const sortBy = document.getElementById('sortBy');
const togglePurchasedBtn = document.getElementById('togglePurchased');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const scrollToTopBtn = document.getElementById('scrollToTop');

// Modal elements
const editModal = document.getElementById('editModal');
const modalClose = document.getElementById('modalClose');
const modalCancel = document.getElementById('modalCancel');
const editItemForm = document.getElementById('editItemForm');

// ===========================
// Form Validation
// ===========================

/**
 * Validate item name
 */
function validateItemName(name) {
    const trimmed = name.trim();
    if (!trimmed) {
        return { valid: false, message: 'Nama barang tidak boleh kosong' };
    }
    if (trimmed.length < 3) {
        return { valid: false, message: 'Nama barang minimal 3 karakter' };
    }
    return { valid: true };
}

/**
 * Clear form errors
 */
function clearFormErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.classList.remove('show');
        error.textContent = '';
    });
}

/**
 * Show form error
 */
function showFormError(fieldId, message) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

// ===========================
// Item Management
// ===========================

/**
 * Add new item
 */
addItemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFormErrors();

    const validation = validateItemName(itemNameInput.value);
    if (!validation.valid) {
        showFormError('nameError', validation.message);
        return;
    }

    const item = manager.addItem({
        name: itemNameInput.value.trim(),
        price: itemPriceInput.value ? parseFloat(itemPriceInput.value) : 0,
        category: itemCategoryInput.value,
        description: itemDescriptionInput.value.trim()
    });

    // Reset form
    addItemForm.reset();
    
    // Show success feedback
    showSuccessMessage('Barang berhasil ditambahkan!');
    
    // Re-render
    render();
});

/**
 * Show success message
 */
function showSuccessMessage(message) {
    const msg = document.createElement('div');
    msg.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    msg.textContent = message;
    document.body.appendChild(msg);

    setTimeout(() => {
        msg.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => msg.remove(), 300);
    }, 3000);
}

/**
 * Delete item
 */
function deleteItem(id) {
    if (confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
        manager.deleteItem(id);
        showSuccessMessage('Barang berhasil dihapus!');
        render();
    }
}

/**
 * Toggle purchased status
 */
function togglePurchased(id) {
    const item = manager.items.find(i => i.id === id);
    if (item) {
        manager.updateItem(id, { purchased: !item.purchased });
        render();
    }
}

/**
 * Open edit modal
 */
function openEditModal(id) {
    const item = manager.items.find(i => i.id === id);
    if (!item) return;

    document.getElementById('editItemId').value = id;
    document.getElementById('editItemName').value = item.name;
    document.getElementById('editItemPrice').value = item.price || '';
    document.getElementById('editItemCategory').value = item.category;
    document.getElementById('editItemDescription').value = item.description;

    editModal.classList.add('active');
}

/**
 * Close edit modal
 */
function closeEditModal() {
    editModal.classList.remove('active');
    editItemForm.reset();
    clearEditFormErrors();
}

/**
 * Clear edit form errors
 */
function clearEditFormErrors() {
    const errorElement = document.getElementById('editNameError');
    if (errorElement) {
        errorElement.classList.remove('show');
        errorElement.textContent = '';
    }
}

/**
 * Show edit form error
 */
function showEditFormError(fieldId, message) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

/**
 * Handle edit form submission
 */
editItemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearEditFormErrors();

    const id = parseInt(document.getElementById('editItemId').value);
    const name = document.getElementById('editItemName').value.trim();

    const validation = validateItemName(name);
    if (!validation.valid) {
        showEditFormError('editNameError', validation.message);
        return;
    }

    manager.updateItem(id, {
        name: name,
        price: document.getElementById('editItemPrice').value ? 
            parseFloat(document.getElementById('editItemPrice').value) : 0,
        category: document.getElementById('editItemCategory').value,
        description: document.getElementById('editItemDescription').value.trim()
    });

    closeEditModal();
    showSuccessMessage('Barang berhasil diperbarui!');
    render();
});

// ===========================
// Modal Event Listeners
// ===========================

modalClose?.addEventListener('click', closeEditModal);
modalCancel?.addEventListener('click', closeEditModal);

editModal?.addEventListener('click', (e) => {
    if (e.target === editModal) {
        closeEditModal();
    }
});

// ===========================
// Filter & Sort
// ===========================

categoryFilter?.addEventListener('change', (e) => {
    manager.currentFilter = e.target.value;
    render();
});

sortBy?.addEventListener('change', (e) => {
    manager.currentSort = e.target.value;
    render();
});

togglePurchasedBtn?.addEventListener('click', () => {
    manager.showPurchased = !manager.showPurchased;
    togglePurchasedBtn.style.opacity = manager.showPurchased ? '1' : '0.7';
    render();
});

// ===========================
// Render Function
// ===========================

/**
 * Render wishlist items
 */
function render() {
    const items = manager.getFilteredItems();
    const stats = manager.getStats();

    // Update stats
    document.getElementById('totalItems').textContent = stats.total;
    document.getElementById('purchasedItems').textContent = stats.purchased;
    document.getElementById('totalPrice').textContent = formatCurrency(stats.totalPrice);

    // Render items or empty state
    if (items.length === 0) {
        wishlistContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>Tidak Ada Barang</h3>
                <p>${manager.currentFilter ? 'Tidak ada barang dalam kategori ini' : 'Mulai tambahkan barang yang Anda inginkan'}</p>
            </div>
        `;
    } else {
        wishlistContainer.innerHTML = items.map(item => createItemCard(item)).join('');
    }

    // Attach event listeners to new elements
    attachItemEventListeners();
}

/**
 * Create item card HTML
 */
function createItemCard(item) {
    const categoryLabel = getCategoryLabel(item.category);
    
    return `
        <div class="item-card ${item.purchased ? 'purchased' : ''}">
            <div class="item-header">
                <div>
                    <h3 class="item-title">${escapeHtml(item.name)}</h3>
                    ${item.category ? `<span class="item-badge">${categoryLabel}</span>` : ''}
                </div>
            </div>
            <div class="item-body">
                <div class="item-info">
                    ${item.price ? `
                        <div class="item-info-row">
                            <span class="item-label">Harga:</span>
                            <span class="item-value item-price">${formatCurrency(item.price)}</span>
                        </div>
                    ` : ''}
                    ${item.description ? `
                        <div class="item-description">
                            ${escapeHtml(item.description)}
                        </div>
                    ` : ''}
                </div>
                <div class="item-footer">
                    <div class="item-actions">
                        <button class="btn btn-secondary btn-small" onclick="openEditModal(${item.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-small" onclick="deleteItem(${item.id})">
                            <i class="fas fa-trash"></i> Hapus
                        </button>
                    </div>
                    <div class="checkbox-container">
                        <input 
                            type="checkbox" 
                            id="purchased-${item.id}" 
                            ${item.purchased ? 'checked' : ''}
                            onchange="togglePurchased(${item.id})"
                            aria-label="Tandai sebagai dibeli"
                        >
                        <label for="purchased-${item.id}" style="margin: 0; cursor: pointer;">
                            ${item.purchased ? 'Dibeli' : 'Dibeli?'}
                        </label>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Attach event listeners to item cards
 */
function attachItemEventListeners() {
    // Event listeners are attached inline in HTML for simplicity
    // In a production app, you'd use event delegation instead
}

// ===========================
// Utility Functions
// ===========================

/**
 * Format number as currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Get category label
 */
function getCategoryLabel(category) {
    const labels = {
        'elektronik': 'Elektronik',
        'fashion': 'Fashion',
        'buku': 'Buku',
        'hobi': 'Hobi & Olahraga',
        'rumah': 'Rumah & Dekorasi',
        'travel': 'Travel',
        'lainnya': 'Lainnya'
    };
    return labels[category] || category;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ===========================
// Navigation
// ===========================

hamburger?.addEventListener('click', () => {
    navMenu?.classList.toggle('active');
    hamburger.classList.toggle('active');
});

navMenu?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu?.classList.remove('active');
        hamburger?.classList.remove('active');
    });
});

// ===========================
// Scroll to Top
// ===========================

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn?.classList.add('visible');
    } else {
        scrollToTopBtn?.classList.remove('visible');
    }
});

scrollToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Update navbar on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }
});

// ===========================
// Initialize App
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    render();
    console.log('Wishlist App initialized!');
});
