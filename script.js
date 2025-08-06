const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        description: "Premium wireless headphones with active noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
        price: 99.99,
        category: "electronics",
        icon: "fas fa-headphones"
    },
    {
        id: 2,
        name: "Smart Watch",
        description: "Advanced smartwatch with health monitoring, GPS tracking, and smartphone connectivity. Stay connected and healthy.",
        price: 199.99,
        category: "electronics",
        icon: "fas fa-clock"
    },
    {
        id: 3,
        name: "Laptop Backpack",
        description: "Durable and stylish laptop backpack with multiple compartments and water-resistant material. Perfect for work and travel.",
        price: 59.99,
        category: "accessories",
        icon: "fas fa-backpack"
    },
    {
        id: 4,
        name: "Cotton T-Shirt",
        description: "Comfortable 100% organic cotton t-shirt available in various colors and sizes. Soft, breathable, and eco-friendly.",
        price: 24.99,
        category: "clothing",
        icon: "fas fa-tshirt"
    },
    {
        id: 5,
        name: "Smartphone",
        description: "Latest flagship smartphone with advanced camera system, fast processor, and all-day battery life. Capture life in stunning detail.",
        price: 699.99,
        category: "electronics",
        icon: "fas fa-mobile-alt"
    },
    {
        id: 6,
        name: "Sunglasses",
        description: "Stylish polarized sunglasses with UV400 protection and lightweight titanium frame. Perfect for any outdoor activity.",
        price: 79.99,
        category: "accessories",
        icon: "fas fa-glasses"
    },
    {
        id: 7,
        name: "Denim Jacket",
        description: "Classic denim jacket with modern fit and premium quality fabric. A timeless piece for any wardrobe.",
        price: 89.99,
        category: "clothing",
        icon: "fas fa-user-tie"
    },
    {
        id: 8,
        name: "Bluetooth Speaker",
        description: "Portable bluetooth speaker with 360-degree sound, waterproof design, and 12-hour battery life. Music anywhere, anytime.",
        price: 49.99,
        category: "electronics",
        icon: "fas fa-volume-up"
    },
    {
        id: 9,
        name: "Leather Wallet",
        description: "Genuine leather wallet with RFID protection and multiple card slots. Elegant design meets modern security.",
        price: 39.99,
        category: "accessories",
        icon: "fas fa-wallet"
    },
    {
        id: 10,
        name: "Running Shoes",
        description: "High-performance running shoes with advanced cushioning and breathable mesh upper. Designed for comfort and speed.",
        price: 129.99,
        category: "clothing",
        icon: "fas fa-running"
    },
    {
        id: 11,
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse with precision tracking and long battery life. Perfect for work and gaming.",
        price: 29.99,
        category: "electronics",
        icon: "fas fa-mouse"
    },
    {
        id: 12,
        name: "Travel Mug",
        description: "Insulated travel mug that keeps drinks hot for 8 hours or cold for 12 hours. Perfect for commuters and travelers.",
        price: 19.99,
        category: "accessories",
        icon: "fas fa-coffee"
    }
];

// Shopping Cart
let cart = [];
let currentFilter = 'all';

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const productModal = document.getElementById('productModal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const successMessage = document.getElementById('successMessage');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    displayProducts(products);
    updateCartUI();
    setupEventListeners();
    animateOnScroll();
    loadCartFromStorage();
});

// Setup Event Listeners
function setupEventListeners() {
    // Cart modal
    cartIcon.addEventListener('click', openCart);
    document.getElementById('closeCart').addEventListener('click', closeCart);
    
    // Product modal
    document.getElementById('closeProduct').addEventListener('click', closeProductModal);
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            closeCart();
        }
        if (event.target === productModal) {
            closeProductModal();
        }
    });

    // Search functionality
    searchInput.addEventListener('input', debounce(handleSearch, 300));

    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            currentFilter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products with animation
            filterProducts();
        });
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCart();
            closeProductModal();
        }
    });
}

// Display Products
function displayProducts(productsToShow) {
    productsGrid.innerHTML = '';
    
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #6B7280;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>No products found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    productsToShow.forEach((product, index) => {
        const productCard = createProductCard(product, index);
        productsGrid.appendChild(productCard);
    });

    // Animate cards
    animateProductCards();
}

// Create Product Card
function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
        <div class="product-image">
            <i class="${product.icon}"></i>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-actions">
                <button class="btn btn-primary" onclick="addToCart(${product.id}, this)">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button class="btn btn-secondary" onclick="viewProduct(${product.id})">
                    <i class="fas fa-eye"></i> View
                </button>
            </div>
        </div>
    `;

    return card;
}

// Add to Cart with Animation
function addToCart(productId, buttonElement) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartUI();
    saveCartToStorage();
    showSuccessMessage('Product added to cart!');
    
    // Button animation
    if (buttonElement) {
        const originalHTML = buttonElement.innerHTML;
        buttonElement.innerHTML = '<i class="fas fa-check"></i> Added!';
        buttonElement.style.background = 'linear-gradient(45deg, #10B981, #059669)';
        
        setTimeout(() => {
            buttonElement.innerHTML = originalHTML;
            buttonElement.style.background = '';
        }, 1500);
    }
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCartToStorage();
    displayCartItems();
    showSuccessMessage('Product removed from cart!');
}

// Update Cart Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
            saveCartToStorage();
            displayCartItems();
        }
    }
}

// Update Cart UI
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCount.textContent = totalItems;
    cartTotal.textContent = totalPrice.toFixed(2);

    // Animate cart count
    if (totalItems === 0) {
        cartCount.style.display = 'none';
    } else {
        cartCount.style.display = 'flex';
        cartCount.style.animation = 'pulse 0.3s ease';
    }
}

// Open Cart Modal
function openCart() {
    cartModal.style.display = 'block';
    displayCartItems();
    document.body.style.overflow = 'hidden';
    
    // Focus management for accessibility
    setTimeout(() => {
        const closeButton = document.getElementById('closeCart');
        if (closeButton) closeButton.focus();
    }, 100);
}

// Close Cart Modal
function closeCart() {
    cartModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Display Cart Items
function displayCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align: center; color: #6B7280; padding: 3rem;">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
            </div>
        `;
        return;
    }

    cartItems.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
                <div style="color: #6B7280; font-size: 0.9rem;">Total: $${(item.price * item.quantity).toFixed(2)}</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)" title="Decrease quantity">
                    <i class="fas fa-minus"></i>
                </button>
                <span style="min-width: 30px; text-align: center; font-weight: bold;">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)" title="Increase quantity">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <button class="btn btn-secondary" onclick="removeFromCart(${item.id})" style="margin-left: 1rem; padding: 0.5rem;" title="Remove from cart">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });
}

// View Product Details
function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    const productDetail = document.getElementById('productDetail');
    
    productDetail.innerHTML = `
        <div class="product-detail-image">
            <i class="${product.icon}"></i>
        </div>
        <div class="product-detail-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p><strong>Category:</strong> ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
            <div class="product-detail-price">$${product.price.toFixed(2)}</div>
            <div style="display: flex; gap: 1rem;">
                <button class="btn btn-primary" onclick="addToCart(${product.id}); closeProductModal();" style="flex: 1;">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button class="btn btn-secondary" onclick="closeProductModal()">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
        </div>
    `;
    
    productModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close Product Modal
function closeProductModal() {
    productModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Search Functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    let filteredProducts = products;

    if (searchTerm) {
        filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }

    if (currentFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product =>
            product.category === currentFilter
        );
    }

    displayProducts(filteredProducts);
}

// Filter Products
function filterProducts() {
    let filteredProducts = products;

    if (currentFilter !== 'all') {
        filteredProducts = products.filter(product =>
            product.category === currentFilter
        );
    }

    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }

    displayProducts(filteredProducts);
}

// Smooth scroll to products section
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Show Success Message
function showSuccessMessage(message) {
    const messageElement = successMessage;
    messageElement.querySelector('span').textContent = message;
    messageElement.classList.add('show');
    
    setTimeout(() => {
        messageElement.classList.remove('show');
    }, 3000);
}

// Animate Product Cards
function animateProductCards() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Animate on Scroll
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements for animation
    document.querySelectorAll('.section-title, .product-card, .feature, .contact-item').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(59, 130, 246, 0.95)';
        navbar.style.backdropFilter = 'blur(15px)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.background = 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Handle Contact Form
function handleContactForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Simulate form submission
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitButton.style.background = 'linear-gradient(45deg, #10B981, #059669)';
        
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.style.background = '';
            submitButton.disabled = false;
            e.target.reset();
        }, 2000);
        
        showSuccessMessage('Message sent successfully!');
    }, 1500);
}

// Checkout Function
function checkout() {
    if (cart.length === 0) {
        showSuccessMessage('Your cart is empty!');
        return;
    }
    
    const checkoutBtn = document.querySelector('.checkout-btn');
    const originalText = checkoutBtn.innerHTML;
    
    checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    checkoutBtn.disabled = true;
    
    setTimeout(() => {
        cart = [];
        updateCartUI();
        saveCartToStorage();
        displayCartItems();
        closeCart();
        
        checkoutBtn.innerHTML = originalText;
        checkoutBtn.disabled = false;
        
        showSuccessMessage('Order placed successfully! Thank you for shopping with us!');
    }, 2000);
}

// Local Storage Functions
function saveCartToStorage() {
    localStorage.setItem('shopease_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('shopease_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Utility Functions
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

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add loading animation to buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-primary') || e.target.classList.contains('btn-secondary')) {
            e.target.style.transform = 'scale(0.95)';
            setTimeout(() => {
                e.target.style.transform = '';
            }, 150);
        }
    });
    
    // Add hover effect to product cards
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('.product-card')) {
            e.target.closest('.product-card').style.transform = 'translateY(-10px)';
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('.product-card')) {
            e.target.closest('.product-card').style.transform = '';
        }
    });
});

// Performance optimization
window.addEventListener('load', function() {
    // Preload critical images
    const imageUrls = [
        'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg',
        'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
});