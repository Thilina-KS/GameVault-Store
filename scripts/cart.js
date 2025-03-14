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

// Functions
function addToCart(gameId) {
    const game = window.games.find(g => g.id === gameId);
    if (!game) {
        showNotification('Error: Game not found!');
        return;
    }
    
    const existingItem = cart.find(item => item.id === gameId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: game.id,
            title: game.title,
            price: game.discountedPrice,
            image: game.image,
            quantity: 1
        });
    }

    updateCart();
    showNotification(`${game.title} added to cart!`);
}

function removeFromCart(gameId) {
    cart = cart.filter(item => item.id !== gameId);
    updateCart();
}

function updateQuantity(gameId, newQuantity) {
    const item = cart.find(item => item.id === gameId);
    if (item) {
        item.quantity = Math.max(1, newQuantity);
        updateCart();
    }
}

function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        const formattedPrice = formatCurrency(itemTotal);
        
        return `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-info">
                <h4>${item.title}</h4>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <div class="price-rows">
                    <p>${formattedPrice.usd}</p>
                    <p>${formattedPrice.lkr}</p>
                </div>
            </div>
            <button onclick="removeFromCart(${item.id})" class="remove-item">&times;</button>
        </div>
    `}).join('');

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const formattedTotal = formatCurrency(total);
    totalAmount.innerHTML = `
        <div>${formattedTotal.usd}</div>
        <div>${formattedTotal.lkr}</div>
    `;

    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const formattedTotal = formatCurrency(total);

    const message = `Hello! I would like to purchase the following games:%0A%0A${
        cart.map(item => {
            const itemTotal = item.price * item.quantity;
            const formattedPrice = formatCurrency(itemTotal);
            return `${item.title} (${item.quantity}x) - ${formattedPrice.usd} / ${formattedPrice.lkr}`;
        }).join('%0A')
    }%0A%0ATotal: ${formattedTotal.usd} / ${formattedTotal.lkr}`;

    window.open('https://chat.whatsapp.com/LR3TaNmO2OzGvAvkXMlFao', '_blank');
}

// Event Listeners
cartLink.addEventListener('click', (e) => {
    e.preventDefault();
    cartModal.classList.add('active');
});

closeModal.addEventListener('click', () => {
    cartModal.classList.remove('active');
});

cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('active');
    }
});

checkoutBtn.addEventListener('click', checkout);

// Load cart from localStorage
const savedCart = localStorage.getItem('cart');
if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
} 