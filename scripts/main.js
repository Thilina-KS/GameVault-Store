// DOM Elements
const gamesContainer = document.querySelector('.games-container');
const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('category-filter');

// State
let filteredGames = [];

// Functions
function loadGames() {
    // Load games from localStorage if available
    const savedGames = localStorage.getItem('gamesData');
    if (savedGames) {
        window.games = JSON.parse(savedGames);
    } else if (typeof games !== 'undefined') {
        // If localStorage is empty but games.js is loaded, use that
        window.games = [...games];
    } else {
        // Fallback to empty array if no games data is available
        window.games = [];
    }
    filteredGames = [...window.games];
}

function formatCurrency(usdPrice) {
    return {
        usd: `$${usdPrice.toFixed(2)}`,
        lkr: `LKR ${(usdPrice * USD_TO_LKR).toLocaleString()}`
    };
}

function renderGames(gamesToRender) {
    if (!gamesToRender.length) {
        gamesContainer.innerHTML = '<div class="no-games">No games available</div>';
        return;
    }

    gamesContainer.innerHTML = gamesToRender.map(game => {
        const originalPrice = formatCurrency(game.originalPrice);
        const discountedPrice = formatCurrency(game.discountedPrice);
        
        return `
        <div class="game-card" data-id="${game.id}">
            <img src="${game.image}" alt="${game.title}" class="game-image">
            <div class="game-info">
                <h3 class="game-title">${game.title}</h3>
                <div class="game-price">
                    <div class="price-row">
                        <span class="original-price">${originalPrice.usd}</span>
                        <span class="discounted-price">${discountedPrice.usd}</span>
                    </div>
                    <div class="price-row">
                        <span class="original-price">${originalPrice.lkr}</span>
                        <span class="discounted-price">${discountedPrice.lkr}</span>
                    </div>
                </div>
                <div class="game-specs">
                    <p><strong>Genre:</strong> ${game.genre.charAt(0).toUpperCase() + game.genre.slice(1)}</p>
                    <p><strong>Release Date:</strong> ${new Date(game.releaseDate).toLocaleDateString()}</p>
                    <details>
                        <summary>System Requirements</summary>
                        <p>OS: ${game.systemRequirements.os}</p>
                        <p>Processor: ${game.systemRequirements.processor}</p>
                        <p>Memory: ${game.systemRequirements.memory}</p>
                        <p>Graphics: ${game.systemRequirements.graphics}</p>
                        <p>Storage: ${game.systemRequirements.storage}</p>
                    </details>
                </div>
                <button class="add-to-cart" onclick="addToCart(${game.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `}).join('');
}

function filterGames() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    filteredGames = window.games.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchTerm);
        const matchesCategory = !selectedCategory || game.genre === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    renderGames(filteredGames);
}

// Event Listeners
searchInput.addEventListener('input', filterGames);
categoryFilter.addEventListener('change', filterGames);

// Game Update Handler
const gameUpdateHandler = {
    channel: new BroadcastChannel('game-updates'),
    
    init() {
        this.channel.onmessage = (event) => {
            const update = event.data;
            this.handleUpdate(update);
        };
        
        // Check for updates that happened while page was closed
        this.checkMissedUpdates();
    },
    
    checkMissedUpdates() {
        const lastUpdate = localStorage.getItem('lastGameUpdate');
        if (lastUpdate) {
            const { data, timestamp } = JSON.parse(lastUpdate);
            const lastVisit = localStorage.getItem('lastVisit') || 0;
            
            if (timestamp > lastVisit) {
                this.handleUpdate(data, true);
            }
        }
        
        // Update last visit timestamp
        localStorage.setItem('lastVisit', Date.now().toString());
    },
    
    handleUpdate(update, isMissed = false) {
        loadGames();
        filterGames();
        
        let updateDetails;
        switch (update.type) {
            case 'add':
                updateDetails = {
                    title: 'New Game Added!',
                    message: `"${update.game.title}" is now available`,
                    icon: '🎮'
                };
                break;
            case 'update':
                updateDetails = {
                    title: 'Game Updated',
                    message: `"${update.game.title}" has been updated`,
                    icon: '📝'
                };
                break;
            case 'delete':
                updateDetails = {
                    title: 'Game Removed',
                    message: 'A game has been removed from the store',
                    icon: '🗑️'
                };
                break;
        }
        
        if (updateDetails) {
            showUpdateNotification(updateDetails, isMissed);
        }
    }
};

function showUpdateNotification(details, isMissed = false) {
    const notification = document.createElement('div');
    notification.className = 'game-update-notification';
    
    const missedTag = isMissed ? '<span class="missed-update">While you were away</span>' : '';
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">${details.icon}</div>
            <div class="notification-text">
                <h4>${details.title}</h4>
                ${missedTag}
                <p>${details.message}</p>
            </div>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadGames();
    renderGames(filteredGames);
    
    // Initialize game update handler
    gameUpdateHandler.init();

    // Start the game data sync
    if (window.gameDataManager) {
        window.gameDataManager.startSyncInterval();
    }

    // Mobile Menu Functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isOpen = navLinks.classList.contains('active');
            mobileMenuToggle.querySelector('i').className = isOpen ? 'fas fa-times' : 'fas fa-bars';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
            });
        });
    }
}); 