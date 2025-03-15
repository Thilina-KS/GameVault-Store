// DOM Elements
const gamesContainer = document.querySelector('.games-container');
const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('category-filter');

// State
let filteredGames = [];
window.games = [];

// Functions
function loadGames() {
    try {
        // Load games from localStorage
        const savedGames = localStorage.getItem('gamesData');
        if (savedGames) {
            const parsedGames = JSON.parse(savedGames);
            if (Array.isArray(parsedGames)) {
                window.games = parsedGames;
                filteredGames = [...window.games];
                return true;
            }
        }
    } catch (error) {
        console.error('Error loading games:', error);
    }
    
    // If we get here, either there were no games or there was an error
    window.games = [];
    filteredGames = [];
    return false;
}

function formatCurrency(usdPrice) {
    // Handle null, undefined, or invalid price values
    if (usdPrice === null || usdPrice === undefined || isNaN(usdPrice)) {
        return {
            usd: 'N/A',
            lkr: 'N/A'
        };
    }
    
    return {
        usd: `$${Number(usdPrice).toFixed(2)}`,
        lkr: `LKR ${(Number(usdPrice) * USD_TO_LKR).toLocaleString()}`
    };
}

function renderGames(gamesToRender) {
    if (!gamesToRender || !gamesToRender.length) {
        gamesContainer.innerHTML = '<div class="no-games">No games available</div>';
        return;
    }

    gamesContainer.innerHTML = gamesToRender.map(game => {
        // Validate game object and its properties
        if (!game || typeof game !== 'object') {
            return '';
        }

        const originalPrice = formatCurrency(game.originalPrice);
        const discountedPrice = formatCurrency(game.discountedPrice);
        
        return `
        <div class="game-card" data-id="${game.id || ''}">
            <img src="${game.image || ''}" alt="${game.title || 'Game'}" class="game-image">
            <div class="game-info">
                <h3 class="game-title">${game.title || 'Untitled Game'}</h3>
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
                    <p><strong>Genre:</strong> ${(game.genre || 'Unknown').charAt(0).toUpperCase() + (game.genre || 'Unknown').slice(1)}</p>
                    <p><strong>Release Date:</strong> ${game.releaseDate ? new Date(game.releaseDate).toLocaleDateString() : 'TBA'}</p>
                    <details>
                        <summary>System Requirements</summary>
                        <p>OS: ${game.systemRequirements?.os || 'N/A'}</p>
                        <p>Processor: ${game.systemRequirements?.processor || 'N/A'}</p>
                        <p>Memory: ${game.systemRequirements?.memory || 'N/A'}</p>
                        <p>Graphics: ${game.systemRequirements?.graphics || 'N/A'}</p>
                        <p>Storage: ${game.systemRequirements?.storage || 'N/A'}</p>
                    </details>
                </div>
                <button class="add-to-cart" onclick="addToCart(${game.id || 0})">
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

// Real-time update handling
const gameUpdateChannel = new BroadcastChannel('game-updates');
let lastUpdateTimestamp = Date.now();

gameUpdateChannel.onmessage = (event) => {
    const update = event.data;
    
    // Update both window.games and filteredGames
    switch(update.type) {
        case 'add':
            window.games.push(update.game);
            showUpdateNotification('New Game Added', `${update.game.title} has been added to the store!`);
            break;
            
        case 'edit':
            const editIndex = window.games.findIndex(g => g.id === update.game.id);
            if (editIndex !== -1) {
                window.games[editIndex] = update.game;
                showUpdateNotification('Game Updated', `${update.game.title} has been updated!`);
            }
            break;
            
        case 'delete':
            const deleteIndex = window.games.findIndex(g => g.id === update.game.id);
            if (deleteIndex !== -1) {
                window.games.splice(deleteIndex, 1);
                showUpdateNotification('Game Removed', `${update.game.title} has been removed from the store.`);
            }
            break;
    }
    
    // Update localStorage
    localStorage.setItem('gamesData', JSON.stringify(window.games));
    lastUpdateTimestamp = update.timestamp;
    
    // Update filtered games and re-render
    filteredGames = [...window.games];
    filterGames();
};

function showUpdateNotification(title, message) {
    const notification = document.createElement('div');
    notification.className = 'game-update-notification';
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="fas fa-sync"></i>
            </div>
            <div class="notification-text">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Check for missed updates on page load
function checkForMissedUpdates() {
    try {
        const lastStoredUpdate = localStorage.getItem('lastGameUpdate');
        if (lastStoredUpdate) {
            const updateData = JSON.parse(lastStoredUpdate);
            if (updateData.timestamp > lastUpdateTimestamp) {
                showUpdateNotification(
                    'Store Updated',
                    'The game catalog has been updated while you were away. Refreshing content...'
                );
                loadGames(); // Reload games from localStorage
                filterGames(); // Apply current filters and render
            }
        }
    } catch (error) {
        console.error('Error checking for updates:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // First load games from localStorage
    loadGames();
    
    // Then check for any missed updates
    checkForMissedUpdates();
    
    // Initial render
    filterGames();
    
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