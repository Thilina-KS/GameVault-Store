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
const WHATSAPP_NUMBER = '94741871585'; // Your WhatsApp number without the + symbol or spaces

// Functions
function addToCart(gameId) {
    const game = window.games.find(g => g.id === gameId);
    if (!game) return;

    const existingItem = cart.find(item => item.id === gameId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: game.id,
            title: game.title,
            price: game.discountedPrice || game.originalPrice,
            quantity: 1
        });
    }

    updateCartCount();
    showNotification('Game added to cart!');
}

function removeFromCart(gameId) {
    cart = cart.filter(item => item.id !== gameId);
    updateCartUI();
    updateCartCount();
}

function updateQuantity(gameId, newQuantity) {
    const item = cart.find(item => item.id === gameId);
    if (item) {
        item.quantity = Math.max(1, newQuantity);
        updateCart();
    }
}

function updateCartCount() {
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

function updateCartUI() {
    if (!cartItems || !totalAmount) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        totalAmount.textContent = '$0.00';
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-details">
                <h3>${item.title}</h3>
                <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
            </div>
            <button onclick="removeFromCart(${item.id})" class="remove-item">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    totalAmount.textContent = `$${total.toFixed(2)}`;
}

function checkoutViaWhatsApp() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create the message
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

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappURL, '_blank');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Cart Modal
    const cartModal = document.getElementById('cart-modal');
    const cartLink = document.querySelector('.cart-link');
    const closeModal = document.querySelector('.close-modal');
    const checkoutBtn = document.querySelector('.checkout-btn');

    if (cartLink) {
        cartLink.addEventListener('click', (e) => {
            e.preventDefault();
            updateCartUI();
            cartModal.style.display = 'flex';
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkoutViaWhatsApp);
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Initialize cart count
    updateCartCount();
});

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

// Load cart from localStorage
const savedCart = localStorage.getItem('cart');
if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
} 