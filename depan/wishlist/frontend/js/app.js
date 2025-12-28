/**
 * @fileoverview Main Application
 * @description Wishlist App main controller
 * @author GDGoC Member
 * @version 1.0.0
 */

console.log('app.js loaded DEBUG2', {
    useApi: CONFIG.USE_API,
    baseUrl: CONFIG.API.BASE_URL
});

class WishlistApp {
    constructor() {
        // State
        this.currentPage = 1;
        this.itemsPerPage = CONFIG.UI.ITEMS_PER_PAGE;
        this.filters = {
            category: '',
            priority: '',
            search: '',
            purchased: false
        };
        this.sortBy = 'newest';
        this.viewMode = 'grid';
        this.editingItemId = null;
        this.deleteItemId = null;

        // Initialize
        this.init();
    }

    /**
     * Initialize application
     */
    async init() {
        try {
            console.log('CONFIG.USE_API', CONFIG.USE_API, 'BASE_URL', CONFIG.API.BASE_URL);
            // Load preferences
            this.loadPreferences();

            // Setup event listeners
            this.setupEventListeners();

            // Load initial data
            await this.loadItems();
            await this.loadStats();

            // Hide loading overlay
            UI.hideLoading();

            console.log('✅ Wishlist App initialized successfully!');
        } catch (error) {
            console.error('Error initializing app:', error);
            UI.hideLoading();
            UI.notify('Gagal memuat aplikasi. Silakan refresh halaman.', 'error');
        }
    }

    /**
     * Load user preferences from storage
     */
    loadPreferences() {
        const prefs = storage.getPreferences();
        
        // Apply theme
        if (prefs.theme === 'dark') {
            document.body.classList.add('dark-theme');
            const themeIcon = UI.$('themeToggle')?.querySelector('i');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
        }

        // Apply view mode
        this.viewMode = prefs.viewMode || 'grid';
        this.updateViewMode();

        // Apply show purchased
        this.filters.purchased = prefs.showPurchased || false;
        const showPurchasedCheckbox = UI.$('showPurchased');
        if (showPurchasedCheckbox) showPurchasedCheckbox.checked = this.filters.purchased;
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Form submission
        const form = UI.$('wishlistForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Cancel edit button
        const cancelBtn = UI.$('cancelEditBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.cancelEdit());
        }

        // Description character counter
        const descInput = UI.$('itemDescription');
        if (descInput) {
            descInput.addEventListener('input', (e) => {
                const counter = UI.$('descCharCount');
                if (counter) counter.textContent = e.target.value.length;
            });
        }

        // Search input
        const searchInput = UI.$('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', UI.debounce((e) => {
                this.filters.search = e.target.value.trim();
                this.currentPage = 1;
                this.loadItems();

                // Show/hide clear button
                const clearBtn = UI.$('clearSearch');
                if (clearBtn) {
                    clearBtn.style.display = e.target.value ? 'flex' : 'none';
                }
            }, 300));
        }

        // Clear search button
        const clearSearchBtn = UI.$('clearSearch');
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                const searchInput = UI.$('searchInput');
                if (searchInput) {
                    searchInput.value = '';
                    this.filters.search = '';
                    this.currentPage = 1;
                    this.loadItems();
                    clearSearchBtn.style.display = 'none';
                }
            });
        }

        // Filter controls
        UI.$('filterCategory')?.addEventListener('change', (e) => {
            this.filters.category = e.target.value;
            this.currentPage = 1;
            this.loadItems();
        });

        UI.$('filterPriority')?.addEventListener('change', (e) => {
            this.filters.priority = e.target.value;
            this.currentPage = 1;
            this.loadItems();
        });

        UI.$('sortBy')?.addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.currentPage = 1;
            this.loadItems();
        });

        // Show purchased toggle
        UI.$('showPurchased')?.addEventListener('change', (e) => {
            this.filters.purchased = e.target.checked;
            this.currentPage = 1;
            this.loadItems();
            this.savePreferences();
        });

        // View mode buttons
        UI.$('viewGrid')?.addEventListener('click', () => this.setViewMode('grid'));
        UI.$('viewList')?.addEventListener('click', () => this.setViewMode('list'));

        // Theme toggle
        UI.$('themeToggle')?.addEventListener('click', () => this.toggleTheme());

        // Pagination
        UI.$('prevPage')?.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        UI.$('nextPage')?.addEventListener('click', () => this.goToPage(this.currentPage + 1));

        // Delete purchased button
        UI.$('deletePurchasedBtn')?.addEventListener('click', () => this.deletePurchasedItems());

        // Item actions delegation
        const itemsContainer = UI.$('wishlistItems');
        if (itemsContainer) {
            itemsContainer.addEventListener('click', (e) => this.handleItemAction(e));
        }

        // Delete modal
        this.setupDeleteModal();

        // Navigation
        this.setupNavigation();

        // Scroll to top
        this.setupScrollToTop();

        // Hamburger menu
        this.setupMobileMenu();
    }

    /**
     * Handle form submission
     * @param {Event} e - Submit event
     */
    async handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = {
            name: UI.$('itemName').value.trim(),
            price: parseFloat(UI.$('itemPrice').value) || 0,
            category: UI.$('itemCategory').value || 'lainnya',
            priority: UI.$('itemPriority').value || 'medium',
            description: UI.$('itemDescription').value.trim(),
            imageUrl: UI.$('itemImageUrl').value.trim() || null
        };

        // Validation
        if (!formData.name) {
            UI.notify('Nama barang tidak boleh kosong', 'error');
            UI.$('itemName').focus();
            return;
        }

        if (formData.name.length < 2) {
            UI.notify('Nama barang minimal 2 karakter', 'error');
            UI.$('itemName').focus();
            return;
        }

        const submitBtn = UI.$('submitBtn');
        const originalText = UI.$('submitBtnText').textContent;

        try {
            submitBtn.disabled = true;
            UI.$('submitBtnText').textContent = this.editingItemId ? 'Menyimpan...' : 'Menambahkan...';

            if (this.editingItemId) {
                // Update existing item
                if (CONFIG.USE_API) {
                    await api.updateItem(this.editingItemId, formData);
                } else {
                    storage.updateItem(this.editingItemId, formData);
                }
                UI.notify('Barang berhasil diperbarui!', 'success');
            } else {
                // Create new item
                if (CONFIG.USE_API) {
                    await api.createItem(formData);
                } else {
                    storage.createItem(formData);
                }
                UI.notify('Barang berhasil ditambahkan!', 'success');
            }

            // Reset form and reload
            this.resetForm();
            await this.loadItems();
            await this.loadStats();

        } catch (error) {
            console.error('Error saving item:', error);
            UI.notify(error.message || 'Gagal menyimpan barang', 'error');
        } finally {
            submitBtn.disabled = false;
            UI.$('submitBtnText').textContent = originalText;
        }
    }

    /**
     * Handle item action (toggle, edit, delete)
     * @param {Event} e - Click event
     */
    async handleItemAction(e) {
        const button = e.target.closest('[data-action]');
        if (!button) return;

        const action = button.dataset.action;
        const id = button.dataset.id;

        switch (action) {
            case 'toggle':
                await this.toggleItem(id);
                break;
            case 'edit':
                this.editItem(id);
                break;
            case 'delete':
                this.confirmDelete(id);
                break;
        }
    }

    /**
     * Toggle item purchased status
     * @param {string} id - Item ID
     */
    async toggleItem(id) {
        try {
            if (CONFIG.USE_API) {
                await api.togglePurchased(id);
            } else {
                storage.togglePurchased(id);
            }

            await this.loadItems();
            await this.loadStats();
            UI.notify('Status berhasil diperbarui', 'success');
        } catch (error) {
            console.error('Error toggling item:', error);
            UI.notify('Gagal memperbarui status', 'error');
        }
    }

    /**
     * Edit item - populate form
     * @param {string} id - Item ID
     */
    editItem(id) {
        const item = CONFIG.USE_API
            ? (this.currentItems || []).find((itm) => itm.id === id)
            : storage.getItem(id);

        if (!item) {
            UI.notify('Barang tidak ditemukan', 'error');
            return;
        }

        // Set editing state
        this.editingItemId = id;

        // Populate form
        UI.$('editItemId').value = id;
        UI.$('itemName').value = item.name;
        UI.$('itemPrice').value = item.price || '';
        UI.$('itemCategory').value = item.category || '';
        UI.$('itemPriority').value = item.priority || 'medium';
        UI.$('itemDescription').value = item.description || '';
        UI.$('itemImageUrl').value = item.imageUrl || '';

        // Update character counter
        const counter = UI.$('descCharCount');
        if (counter) counter.textContent = (item.description || '').length;

        // Update UI
        UI.$('formTitle').textContent = 'Edit Barang';
        UI.$('submitBtnText').textContent = 'Simpan Perubahan';
        UI.$('cancelEditBtn').style.display = 'inline-flex';

        // Scroll to form
        UI.$('wishlistForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
        UI.$('itemName').focus();
    }

    /**
     * Cancel edit mode
     */
    cancelEdit() {
        this.editingItemId = null;
        this.resetForm();
    }

    /**
     * Reset form to initial state
     */
    resetForm() {
        const form = UI.$('wishlistForm');
        if (form) form.reset();

        UI.$('editItemId').value = '';
        UI.$('formTitle').textContent = 'Tambah Barang Baru';
        UI.$('submitBtnText').textContent = 'Tambah ke Wishlist';
        UI.$('cancelEditBtn').style.display = 'none';
        UI.$('descCharCount').textContent = '0';

        this.editingItemId = null;
    }

    /**
     * Confirm delete item
     * @param {string} id - Item ID
     */
    confirmDelete(id) {
        const item = CONFIG.USE_API
            ? (this.currentItems || []).find((itm) => itm.id === id)
            : storage.getItem(id);
        if (!item) return;

        this.deleteItemId = id;
        UI.$('deleteItemName').textContent = item.name;
        UI.showModal('deleteModal');
    }

    /**
     * Delete item
     */
    async deleteItem() {
        if (!this.deleteItemId) return;

        try {
            if (CONFIG.USE_API) {
                await api.deleteItem(this.deleteItemId);
            } else {
                storage.deleteItem(this.deleteItemId);
            }

            UI.hideModal('deleteModal');
            UI.notify('Barang berhasil dihapus', 'success');

            this.deleteItemId = null;
            await this.loadItems();
            await this.loadStats();
        } catch (error) {
            console.error('Error deleting item:', error);
            UI.notify('Gagal menghapus barang', 'error');
        }
    }

    /**
     * Delete all purchased items
     */
    async deletePurchasedItems() {
        const stats = CONFIG.USE_API ? (await api.getStats()).data : storage.getStats();
        if (stats.purchased === 0) {
            UI.notify('Tidak ada barang yang sudah terbeli', 'warning');
            return;
        }

        if (!confirm(`Hapus ${stats.purchased} barang yang sudah terbeli?`)) {
            return;
        }

        try {
            if (CONFIG.USE_API) {
                await api.deletePurchased();
            } else {
                storage.deletePurchased();
            }

            UI.notify(`${stats.purchased} barang berhasil dihapus`, 'success');
            await this.loadItems();
            await this.loadStats();
        } catch (error) {
            console.error('Error deleting purchased items:', error);
            UI.notify('Gagal menghapus barang', 'error');
        }
    }

    /**
     * Load and render items
     */
    async loadItems() {
        UI.showListLoading();

        try {
            let result;

            if (CONFIG.USE_API) {
                console.log('loadItems → fetch API', {
                    baseUrl: CONFIG.API.BASE_URL,
                    category: this.filters.category,
                    priority: this.filters.priority,
                    purchased: this.filters.purchased,
                    search: this.filters.search,
                    sort: this.sortBy,
                    page: this.currentPage,
                    limit: this.itemsPerPage
                });
                result = await api.getItems({
                    category: this.filters.category,
                    priority: this.filters.priority,
                    purchased: this.filters.purchased || undefined,
                    search: this.filters.search,
                    sort: this.sortBy,
                    page: this.currentPage,
                    limit: this.itemsPerPage
                });
                if (result?.data) {
                    result = { items: result.data, ...result.meta };
                }
            } else {
                result = storage.getFilteredItems({
                    filters: {
                        category: this.filters.category,
                        priority: this.filters.priority,
                        purchased: this.filters.purchased ? undefined : false,
                        search: this.filters.search
                    },
                    sort: this.sortBy,
                    page: this.currentPage,
                    limit: this.itemsPerPage
                });
            }

            this.currentItems = result.items || [];
            console.log('loadItems → result', {
                count: this.currentItems.length,
                meta: {
                    total: result.total,
                    page: result.page,
                    totalPages: result.totalPages
                }
            });
            this.renderItems(this.currentItems);
            this.updatePagination(result);

        } catch (error) {
            console.error('Error loading items:', error);
            UI.notify('Gagal memuat data', 'error');
        } finally {
            UI.hideListLoading();
        }
    }

    /**
     * Render items to DOM
     * @param {Array} items - Items to render
     */
    renderItems(items) {
        const container = UI.$('wishlistItems');
        const emptyState = UI.$('emptyState');
        const bulkActions = UI.$('bulkActions');

        if (!container) return;

        if (items.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.style.display = 'flex';
            if (bulkActions) bulkActions.style.display = 'none';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        // Show bulk actions if there are purchased items
        const stats = storage.getStats();
        if (bulkActions) {
            bulkActions.style.display = stats.purchased > 0 ? 'flex' : 'none';
        }

        // Render cards
        container.innerHTML = items.map(item => UI.createItemCard(item)).join('');

        // Add fade-in animation
        container.querySelectorAll('.item-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 50}ms`;
            card.classList.add('fade-in');
        });
    }

    /**
     * Update pagination UI
     * @param {Object} data - Pagination data
     */
    updatePagination(data) {
        const pagination = UI.$('pagination');
        if (!pagination) return;

        const { total, totalPages, page, hasNextPage, hasPrevPage } = data;

        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }

        pagination.style.display = 'flex';
        UI.$('currentPage').textContent = page;
        UI.$('totalPages').textContent = totalPages;

        const prevBtn = UI.$('prevPage');
        const nextBtn = UI.$('nextPage');

        if (prevBtn) prevBtn.disabled = !hasPrevPage;
        if (nextBtn) nextBtn.disabled = !hasNextPage;
    }

    /**
     * Go to specific page
     * @param {number} page - Page number
     */
    goToPage(page) {
        this.currentPage = page;
        this.loadItems();

        // Scroll to top of list
        UI.$('app')?.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Load and update statistics
     */
    async loadStats() {
        try {
            let stats;

            if (CONFIG.USE_API) {
                const response = await api.getStats();
                stats = response.data;
            } else {
                stats = storage.getStats();
            }

            this.updateStatsUI(stats);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    /**
     * Update statistics UI
     * @param {Object} stats - Statistics data
     */
    updateStatsUI(stats) {
        // Dashboard stats
        const totalEl = UI.$('totalItems');
        const pendingEl = UI.$('pendingItems');
        const purchasedEl = UI.$('purchasedItems');
        const valueEl = UI.$('totalValue');

        if (totalEl) totalEl.textContent = stats.total;
        if (pendingEl) pendingEl.textContent = stats.pending;
        if (purchasedEl) purchasedEl.textContent = stats.purchased;
        if (valueEl) valueEl.textContent = UI.formatCurrency(stats.totalValue);

        // Hero stats
        const heroTotal = UI.$('heroTotalItems');
        const heroPurchased = UI.$('heroPurchasedItems');
        const heroRate = UI.$('heroCompletionRate');

        if (heroTotal) heroTotal.textContent = stats.total;
        if (heroPurchased) heroPurchased.textContent = stats.purchased;
        if (heroRate) heroRate.textContent = `${stats.completionRate}%`;
    }

    /**
     * Set view mode
     * @param {string} mode - 'grid' or 'list'
     */
    setViewMode(mode) {
        this.viewMode = mode;
        this.updateViewMode();
        this.savePreferences();
    }

    /**
     * Update view mode UI
     */
    updateViewMode() {
        const container = UI.$('wishlistItems');
        const gridBtn = UI.$('viewGrid');
        const listBtn = UI.$('viewList');

        if (container) {
            container.className = this.viewMode === 'list' ? 'wishlist-list' : 'wishlist-grid';
        }

        if (gridBtn && listBtn) {
            gridBtn.classList.toggle('active', this.viewMode === 'grid');
            listBtn.classList.toggle('active', this.viewMode === 'list');
        }
    }

    /**
     * Toggle theme
     */
    toggleTheme() {
        const isDark = document.body.classList.toggle('dark-theme');
        const themeIcon = UI.$('themeToggle')?.querySelector('i');
        
        if (themeIcon) {
            themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }

        this.savePreferences();
    }

    /**
     * Save user preferences
     */
    savePreferences() {
        storage.savePreferences({
            theme: document.body.classList.contains('dark-theme') ? 'dark' : 'light',
            viewMode: this.viewMode,
            showPurchased: this.filters.purchased
        });
    }

    /**
     * Setup delete modal
     */
    setupDeleteModal() {
        const modal = UI.$('deleteModal');
        if (!modal) return;

        // Close on backdrop click
        modal.querySelector('.modal-backdrop')?.addEventListener('click', () => {
            UI.hideModal('deleteModal');
        });

        // Close button
        modal.querySelector('.modal-close')?.addEventListener('click', () => {
            UI.hideModal('deleteModal');
        });

        // Cancel button
        modal.querySelector('.modal-cancel')?.addEventListener('click', () => {
            UI.hideModal('deleteModal');
        });

        // Confirm delete
        UI.$('confirmDeleteBtn')?.addEventListener('click', () => {
            this.deleteItem();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                UI.hideModal('deleteModal');
            }
        });
    }

    /**
     * Setup navigation
     */
    setupNavigation() {
        const navLinks = UI.$$$('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const target = UI.$(targetId);
                
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }

                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Close mobile menu
                UI.$('navMenu')?.classList.remove('active');
                UI.$('hamburger')?.classList.remove('active');
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = UI.$('navbar');
            if (navbar) {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
            }
        });
    }

    /**
     * Setup scroll to top button
     */
    setupScrollToTop() {
        const btn = UI.$('scrollToTop');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            btn.classList.toggle('visible', window.scrollY > 300);
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /**
     * Setup mobile menu
     */
    setupMobileMenu() {
        const hamburger = UI.$('hamburger');
        const navMenu = UI.$('navMenu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WishlistApp();
});
