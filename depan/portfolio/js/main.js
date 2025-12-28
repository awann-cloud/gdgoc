/**
 * Portfolio Main JavaScript
 * Handles navigation, form validation, and interactive features
 */

// ===========================
// Utility Functions
// ===========================

/**
 * Debounce function to optimize performance
 */
function debounce(func, wait) {
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

/**
 * Smooth scroll to element
 */
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===========================
// Navbar Functionality
// ===========================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar');

/**
 * Toggle mobile menu
 */
function toggleMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

/**
 * Close mobile menu when clicking on a link
 */
function closeMenu() {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
}

hamburger?.addEventListener('click', toggleMenu);

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMenu();
        const targetId = link.getAttribute('href').substring(1);
        setTimeout(() => {
            scrollToElement(targetId);
        }, 100);
    });
});

/**
 * Add scroll effect to navbar
 */
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }
});

// ===========================
// Scroll to Top Button
// ===========================

const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn?.classList.add('visible');
    } else {
        scrollToTopBtn?.classList.remove('visible');
    }
});

scrollToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===========================
// Scroll Progress Indicator
// ===========================

const scrollIndicator = document.getElementById('scrollIndicator');

window.addEventListener('scroll', debounce(() => {
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (window.scrollY / scrollHeight) * 100;
    if (scrollIndicator) {
        scrollIndicator.style.width = scrollPercentage + '%';
    }
}, 10));

// ===========================
// Form Validation & Submission
// ===========================

const contactForm = document.getElementById('contactForm');

/**
 * Validate email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Clear error messages
 */
function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.textContent = '';
    });
}

/**
 * Show error message for a field
 */
function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

/**
 * Validate form fields
 */
function validateForm() {
    clearErrors();
    let isValid = true;

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name) {
        showError('name', 'Nama tidak boleh kosong');
        isValid = false;
    } else if (name.length < 3) {
        showError('name', 'Nama minimal 3 karakter');
        isValid = false;
    }

    if (!email) {
        showError('email', 'Email tidak boleh kosong');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'Format email tidak valid');
        isValid = false;
    }

    if (!subject) {
        showError('subject', 'Subjek tidak boleh kosong');
        isValid = false;
    }

    if (!message) {
        showError('message', 'Pesan tidak boleh kosong');
        isValid = false;
    } else if (message.length < 10) {
        showError('message', 'Pesan minimal 10 karakter');
        isValid = false;
    }

    return isValid;
}

/**
 * Handle form submission
 */
contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Mengirim...';
    submitBtn.disabled = true;

    try {
        // Simulate form submission (in production, this would send to a backend)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Log form data (in production, this would be sent to a server)
        console.log('Form submitted:', {
            name,
            email,
            subject,
            message,
            timestamp: new Date().toISOString()
        });

        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.style.display = 'block';
        successMsg.innerHTML = '✓ Pesan Anda berhasil dikirim! Terima kasih telah menghubungi saya.';
        contactForm.appendChild(successMsg);

        // Reset form
        contactForm.reset();
        clearErrors();

        // Remove success message after 5 seconds
        setTimeout(() => {
            successMsg.remove();
        }, 5000);

    } catch (error) {
        console.error('Error submitting form:', error);
        const errorMsg = document.createElement('div');
        errorMsg.className = 'success-message';
        errorMsg.style.color = 'var(--error-color)';
        errorMsg.style.background = 'rgba(239, 68, 68, 0.1)';
        errorMsg.style.display = 'block';
        errorMsg.innerHTML = '✗ Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.';
        contactForm.appendChild(errorMsg);

        setTimeout(() => {
            errorMsg.remove();
        }, 5000);

    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// ===========================
// Intersection Observer for Animations
// ===========================

/**
 * Animate elements when they come into view
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

/**
 * Observe elements for animation
 */
document.addEventListener('DOMContentLoaded', () => {
    const elementsToObserve = document.querySelectorAll(
        '.project-card, .skill-category, .stat-item'
    );

    elementsToObserve.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});

// ===========================
// Keyboard Navigation
// ===========================

document.addEventListener('keydown', (e) => {
    // Close menu with Escape key
    if (e.key === 'Escape') {
        closeMenu();
    }

    // Scroll to top with Ctrl+Home
    if (e.ctrlKey && e.key === 'Home') {
        scrollToElement('home');
    }
});

// ===========================
// Accessibility Enhancements
// ===========================

/**
 * Handle focus on interactive elements
 */
const interactiveElements = document.querySelectorAll(
    'a, button, input, textarea, [tabindex]'
);

interactiveElements.forEach(element => {
    element.addEventListener('focus', () => {
        element.style.outline = '2px solid var(--primary-color)';
        element.style.outlineOffset = '2px';
    });

    element.addEventListener('blur', () => {
        element.style.outline = 'none';
    });
});

// ===========================
// Performance Optimization
// ===========================

/**
 * Lazy load images
 */
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

/**
 * Log page performance metrics
 */
window.addEventListener('load', () => {
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page load time:', pageLoadTime, 'ms');
    }
});

/**
 * Initialize on DOM Content Loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio loaded successfully!');
    
    // Initialize project modal functionality
    initProjectModal();
});

// ===========================
// Project Detail Modal
// ===========================

/**
 * Project data with detailed information
 */
const projectsData = {
    'kedai-kiry': {
        title: 'Kedai Kiry Project',
        category: 'Restaurant Management System',
        heroImage: null,
        description: 'A fullstack restaurant management system built to handle menu management, order processing, staff workflows, and transaction records through a centralized backend service.',
        story: 'The system was developed to replace manual order handling by centralizing menus, kitchen orders, receipts, and staff management into a single operational platform.',
        impact: 'Improved order traceability, reduced manual input errors, and enabled faster coordination between kitchen, cashier, and service staff.',
        quote: '"Order tracking and reporting are now structured and easy to monitor in real time."',
        role: 'Backend Engineer',
        period: 'Sep 2025 – Present',
        tags: ['Node.js', 'Express', 'MySQL', 'REST API'],
        badges: [
            'Structured relational database design',
            'Role-based access control',
            'Order-to-receipt data integrity'
        ],
        metrics: [
            { label: 'Core modules built', value: '6' },
            { label: 'API endpoints', value: '40+' },
            { label: 'Average API response', value: '<100ms' }
        ],
        timeline: [
            {
                label: 'Analysis',
                detail: 'Requirement gathering based on real restaurant operational workflows.'
            },
            {
                label: 'Development',
                detail: 'Backend-focused implementation covering orders, menus, staff, and receipts.'
            },
            {
                label: 'Deployment',
                detail: 'Local and staging environment testing with iterative schema refinement.'
            }
        ],
        highlights: [
            'Designed normalized relational database schema for restaurant operations.',
            'Implemented RESTful APIs for orders, receipts, menus, and staff modules.',
            'Handled data consistency between orders, order items, and receipts.',
            'Built role-based access control system for staff management.'
        ]
    },
    'mathc': {
        title: 'MathC',
        category: 'Frontend Learning Platform',
        heroImage: null,
        description: 'A responsive and interactive mathematics learning platform designed to help students practice questions, simulate exams, and receive instant visual feedback.',
        story: 'MathC was created to make math practice feel structured and engaging through clean UI, clear question flows, and interactive components that guide users step by step.',
        impact: 'Improved user focus and practice consistency by presenting questions in a distraction-free interface with real-time feedback.',
        quote: '"The interface makes practicing math feel simpler and more approachable."',
        role: 'Frontend Developer',
        period: '2025',
        tags: ['React', 'TypeScript', 'CSS Modules', 'REST API'],
        badges: [
            'Responsive exam interface',
            'Real-time UI feedback',
            'Reusable component system'
        ],
        metrics: [
            { label: 'Question types supported', value: '6' },
            { label: 'Responsive breakpoints', value: '4' },
            { label: 'Average interaction delay', value: '<50ms' }
        ],
        timeline: [
            {
                label: 'UX Design',
                detail: 'Designed question flow, navigation logic, and visual hierarchy for focus-driven practice.'
            },
            {
                label: 'Implementation',
                detail: 'Built reusable components for questions, timers, and progress indicators.'
            },
            {
                label: 'Polish',
                detail: 'Refined animations, transitions, and responsiveness across devices.'
            }
        ],
        highlights: [
            'Designed a clean question layout that minimizes cognitive load.',
            'Implemented real-time visual feedback for answers and progress.',
            'Ensured full responsiveness for desktop, tablet, and mobile screens.',
            'Built interactive exam interface with timer and progress indicators.'
        ]
    },
    'wishlist': {
        title: 'Wishlist App',
        category: 'Full-Stack CRUD Application',
        heroImage: null,
        description: 'A modern wishlist application with complete CRUD features, advanced filtering, search capabilities, and backend API. Built for GDGoC Frontend Task with emphasis on clean code and best practices.',
        story: 'This application demonstrates fullstack development skills by implementing a complete wishlist management system from scratch, including both frontend and backend components.',
        impact: 'Showcases ability to build production-ready applications with proper architecture, error handling, and user experience design.',
        quote: '"A complete demonstration of modern web development practices and CRUD implementation."',
        role: 'Fullstack Developer',
        period: 'Dec 2025',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'Express'],
        badges: [
            'Complete CRUD operations',
            'Backend API integration',
            'Responsive design'
        ],
        metrics: [
            { label: 'CRUD features', value: 'Full' },
            { label: 'API endpoints', value: '6+' },
            { label: 'Responsive', value: '100%' }
        ],
        timeline: [
            {
                label: 'Planning',
                detail: 'Requirement analysis and architecture design for both frontend and backend.'
            },
            {
                label: 'Development',
                detail: 'Implemented complete CRUD functionality with API integration.'
            },
            {
                label: 'Testing',
                detail: 'Thorough testing of all features including edge cases and error handling.'
            }
        ],
        highlights: [
            'Implemented complete CRUD operations with backend API integration.',
            'Built advanced filtering, sorting, and search functionality.',
            'Created responsive design with dark theme support.',
            'Developed clean, modular, and maintainable code architecture.'
        ]
    }
};

/**
 * Initialize project modal functionality
 */
function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalBody = document.getElementById('modalBody');
    const viewDetailsButtons = document.querySelectorAll('.view-details');

    if (!modal || !modalOverlay || !modalClose || !modalBody) return;

    /**
     * Open modal with project details
     */
    function openModal(projectId) {
        const project = projectsData[projectId];
        if (!project) return;

        // Generate modal content
        const modalContent = `
            <div class="project-detail-modal">
                <div class="project-detail-header">
                    <span class="project-label">${project.category}</span>
                    <h2>${project.title}</h2>
                    <p class="project-period">${project.role} • ${project.period}</p>
                </div>

                <div class="project-detail-body">
                    <section class="detail-section">
                        <h3><i class="fas fa-info-circle"></i> Overview</h3>
                        <p>${project.description}</p>
                    </section>

                    <section class="detail-section">
                        <h3><i class="fas fa-lightbulb"></i> Story & Scope</h3>
                        <p>${project.story}</p>
                    </section>

                    <section class="detail-section">
                        <h3><i class="fas fa-chart-line"></i> Metrics</h3>
                        <div class="modal-metrics">
                            ${project.metrics.map(metric => `
                                <div class="metric-item">
                                    <strong>${metric.value}</strong>
                                    <span>${metric.label}</span>
                                </div>
                            `).join('')}
                        </div>
                    </section>

                    <section class="detail-section">
                        <h3><i class="fas fa-tasks"></i> Timeline</h3>
                        <div class="modal-timeline">
                            ${project.timeline.map(item => `
                                <div class="timeline-item">
                                    <strong>${item.label}</strong>
                                    <p>${item.detail}</p>
                                </div>
                            `).join('')}
                        </div>
                    </section>

                    <section class="detail-section">
                        <h3><i class="fas fa-bullseye"></i> Impact</h3>
                        <p>${project.impact}</p>
                        <blockquote>${project.quote}</blockquote>
                    </section>

                    <section class="detail-section">
                        <h3><i class="fas fa-star"></i> Key Highlights</h3>
                        <ul class="highlights-list">
                            ${project.highlights.map(highlight => `
                                <li><i class="fas fa-check-circle"></i> ${highlight}</li>
                            `).join('')}
                        </ul>
                    </section>

                    <section class="detail-section">
                        <h3><i class="fas fa-code"></i> Technologies</h3>
                        <div class="modal-tags">
                            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </section>

                    <section class="detail-section">
                        <h3><i class="fas fa-award"></i> Achievements</h3>
                        <ul class="badges-list">
                            ${project.badges.map(badge => `
                                <li><i class="fas fa-medal"></i> ${badge}</li>
                            `).join('')}
                        </ul>
                    </section>
                </div>
            </div>
        `;

        modalBody.innerHTML = modalContent;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close modal
     */
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners for opening modal
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', () => {
            const projectId = button.getAttribute('data-project');
            openModal(projectId);
        });
    });

    // Event listeners for closing modal
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}
