// DOM Elements
const cartModal = document.getElementById('cart-modal');
const cartCount = document.querySelector('.cart-count');
const cartItems = document.querySelector('.cart-items');
const totalAmount = document.querySelector('.total-amount');
const checkoutBtn = document.querySelector('.checkout-btn');
const closeModal = document.querySelector('.close-modal');
const cartLink = document.querySelector('.cart-link');

// State
let cart = [];
const WHATSAPP_NUMBER = '94741871585';
let updateDebounceTimeout;

// Initialize cart from localStorage
function initCart() {
    try {
        // Load cart data
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }

        // Initialize UI
        debouncedUpdateUI();

        // Add event listeners
        if (cartLink) {
            cartLink.addEventListener('click', (e) => {
                e.preventDefault();
                openCart();
            });
        }

        if (closeModal) {
            closeModal.addEventListener('click', closeCart);
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', checkoutViaWhatsApp);
        }

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                closeCart();
            }
        });

        // Handle escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && cartModal.style.display === 'flex') {
                closeCart();
            }
        });

        // Handle mobile back button
        window.addEventListener('popstate', () => {
            if (cartModal.style.display === 'flex') {
                closeCart();
            }
        });

        console.log('Cart initialized with', cart.length, 'items');
    } catch (error) {
        console.error('Error initializing cart:', error);
        cart = [];
    }
}

// Functions
function openCart() {
    if (!cartModal) return;
    updateCartUI();
    cartModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeCart() {
    if (!cartModal) return;
    cartModal.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
}

function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart:', error);
        showNotification('Error saving cart. Please try again.');
    }
}

function addToCart(gameId) {
    try {
        if (!window.games) {
            console.error('Games data not available');
            showNotification('Error: Games data not available');
            return;
        }

        const game = window.games.find(g => g.id === gameId);
        if (!game) {
            console.error('Game not found:', gameId);
            showNotification('Error: Game not found');
            return;
        }

        const existingItem = cart.find(item => item.id === gameId);

        if (existingItem) {
            existingItem.quantity++;
            showNotification(`Increased ${game.title} quantity in cart`);
        } else {
            cart.push({
                id: game.id,
                title: game.title,
                price: game.discountedPrice || game.originalPrice,
                quantity: 1
            });
            showNotification(`${game.title} added to cart`);
        }

        saveCart();
        debouncedUpdateUI();

        // Check achievements
        if (window.achievements && typeof window.achievements.unlockAchievement === 'function') {
            window.achievements.checkAchievements();
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Error adding game to cart');
    }
}

function removeFromCart(gameId) {
    try {
        cart = cart.filter(item => item.id !== gameId);
        saveCart();
        debouncedUpdateUI();
    } catch (error) {
        console.error('Error removing from cart:', error);
        showNotification('Error removing game from cart');
    }
}

function updateQuantity(gameId, newQuantity) {
    try {
        const item = cart.find(item => item.id === gameId);
        if (item) {
            if (newQuantity < 1) {
                removeFromCart(gameId);
            } else {
                item.quantity = newQuantity;
                saveCart();
                debouncedUpdateUI();
            }
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        showNotification('Error updating quantity');
    }
}

function debouncedUpdateUI() {
    clearTimeout(updateDebounceTimeout);
    updateDebounceTimeout = setTimeout(() => {
        updateCartCount();
        updateCartUI();
    }, 100);
}

function updateCartCount() {
    if (!cartCount) return;
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'block' : 'none';
}

function updateCartUI() {
    if (!cartItems || !totalAmount) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        totalAmount.textContent = '$0.00';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="item-details">
                <h3>${escapeHtml(item.title)}</h3>
                <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
            </div>
            <div class="item-actions">
                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" class="quantity-btn" aria-label="Decrease quantity">-</button>
                <span class="quantity">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" class="quantity-btn" aria-label="Increase quantity">+</button>
                <button onclick="removeFromCart(${item.id})" class="remove-item" aria-label="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    totalAmount.textContent = `$${total.toFixed(2)}`;
    if (checkoutBtn) checkoutBtn.disabled = false;
}

function checkBigSpenderAchievement() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (total > 100) {
        unlockAchievement('big_spender');
    }
}

function checkoutViaWhatsApp() {
    try {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        let message = '🎮 *New Game Order*\n\n';
        message += '*Selected Games:*\n';
        
        cart.forEach(item => {
            message += `▪️ ${item.title}\n`;
            message += `   × ${item.quantity} copy(s)\n`;
            message += `   × $${(item.price * item.quantity).toFixed(2)}\n\n`;
        });
        
        message += '------------------------\n';
        message += `*Total Amount:* $${total.toFixed(2)}\n\n`;
        message += 'Please confirm my order. Thank you!';

        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        
        window.open(whatsappURL, '_blank');
    } catch (error) {
        console.error('Error during checkout:', error);
        showNotification('Error processing checkout');
    }
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', initCart); 