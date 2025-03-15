// DOM Elements
const gamesTableBody = document.getElementById('gamesTableBody');
const gameModal = document.getElementById('gameModal');
const gameForm = document.getElementById('gameForm');
const modalTitle = document.getElementById('modalTitle');

// State
let editingGameId = null;
let gamesData = [];

// Functions
function loadGames() {
    // Load games from localStorage if available
    const savedGames = localStorage.getItem('gamesData');
    if (savedGames) {
        gamesData = JSON.parse(savedGames);
    }
    return gamesData;
}

function renderGamesTable() {
    if (!gamesData || !Array.isArray(gamesData)) {
        gamesTableBody.innerHTML = '<tr><td colspan="6">No games available</td></tr>';
        return;
    }

    gamesTableBody.innerHTML = gamesData.map(game => {
        // Validate game object and its properties
        if (!game || typeof game !== 'object') {
            return '';
        }

        const originalPrice = game.originalPrice != null ? Number(game.originalPrice).toFixed(2) : 'N/A';
        const discountedPrice = game.discountedPrice != null ? Number(game.discountedPrice).toFixed(2) : 'N/A';
        
        return `
        <tr>
            <td><img src="${game.image || ''}" alt="${game.title || 'Game'}" class="game-thumbnail"></td>
            <td>${game.title || 'Untitled Game'}</td>
            <td>${game.genre || 'Unknown'}</td>
            <td>$${originalPrice}</td>
            <td>$${discountedPrice}</td>
            <td>
                <button onclick="editGame(${game.id || 0})" class="action-btn edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteGame(${game.id || 0})" class="action-btn delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `}).join('');
}

function openGameModal(gameId = null) {
    const game = gameId ? gamesData.find(g => g.id === gameId) : null;
    editingGameId = gameId;
    modalTitle.textContent = game ? 'Edit Game' : 'Add New Game';
    
    if (game) {
        document.getElementById('title').value = game.title;
        document.getElementById('image').value = game.image;
        document.getElementById('originalPrice').value = game.originalPrice;
        document.getElementById('discountedPrice').value = game.discountedPrice;
        document.getElementById('genre').value = game.genre;
        document.getElementById('releaseDate').value = game.releaseDate;
        document.getElementById('os').value = game.systemRequirements.os;
        document.getElementById('processor').value = game.systemRequirements.processor;
        document.getElementById('memory').value = game.systemRequirements.memory;
        document.getElementById('graphics').value = game.systemRequirements.graphics;
        document.getElementById('storage').value = game.systemRequirements.storage;
    } else {
        gameForm.reset();
    }

    gameModal.style.display = 'flex';
}

function closeGameModal() {
    gameModal.style.display = 'none';
    gameForm.reset();
    editingGameId = null;
}

function handleGameSubmit(event) {
    event.preventDefault();

    // Get form values
    const title = document.getElementById('title').value.trim();
    const image = document.getElementById('image').value.trim();
    const originalPrice = document.getElementById('originalPrice').value;
    const discountedPrice = document.getElementById('discountedPrice').value;
    const genre = document.getElementById('genre').value.trim();
    const releaseDate = document.getElementById('releaseDate').value;

    // Validate required fields
    if (!title) {
        showNotification('Game title is required!');
        return false;
    }

    if (!image) {
        showNotification('Game image URL is required!');
        return false;
    }

    if (!originalPrice || isNaN(originalPrice) || parseFloat(originalPrice) <= 0) {
        showNotification('Please enter a valid original price!');
        return false;
    }

    if (!discountedPrice || isNaN(discountedPrice) || parseFloat(discountedPrice) <= 0) {
        showNotification('Please enter a valid discounted price!');
        return false;
    }

    if (!genre) {
        showNotification('Game genre is required!');
        return false;
    }

    if (!releaseDate) {
        showNotification('Release date is required!');
        return false;
    }

    const gameData = {
        id: editingGameId || Date.now(),
        title,
        image,
        originalPrice: parseFloat(originalPrice),
        discountedPrice: parseFloat(discountedPrice),
        genre,
        releaseDate,
        systemRequirements: {
            os: document.getElementById('os').value.trim(),
            processor: document.getElementById('processor').value.trim(),
            memory: document.getElementById('memory').value.trim(),
            graphics: document.getElementById('graphics').value.trim(),
            storage: document.getElementById('storage').value.trim()
        }
    };

    // Validate that at least some system requirements are provided
    const hasSystemRequirements = Object.values(gameData.systemRequirements).some(value => value !== '');
    if (!hasSystemRequirements) {
        showNotification('Please provide at least some system requirements!');
        return false;
    }

    if (editingGameId) {
        // Update existing game
        const index = gamesData.findIndex(g => g.id === editingGameId);
        if (index !== -1) {
            gamesData[index] = gameData;
            broadcastGameUpdate({
                type: 'update',
                game: gameData,
                timestamp: Date.now()
            });
        }
    } else {
        // Add new game
        gamesData.push(gameData);
        broadcastGameUpdate({
            type: 'add',
            game: gameData,
            timestamp: Date.now()
        });
    }

    // Save to localStorage
    saveGames(gamesData);

    // Refresh table and close modal
    renderGamesTable();
    closeGameModal();
    showNotification(editingGameId ? 'Game updated successfully!' : 'Game added successfully!');

    return false;
}

function deleteGame(gameId) {
    if (confirm('Are you sure you want to delete this game?')) {
        // Load current games
        const currentGames = loadGames();
        
        // Filter out the deleted game
        const updatedGames = currentGames.filter(game => game.id !== gameId);
        
        // Save the updated games list
        saveGames(updatedGames);
        
        // Update the games array
        gamesData = updatedGames;
        
        // Broadcast the change
        broadcastGameUpdate({
            type: 'delete',
            gameId: gameId,
            timestamp: Date.now()
        });
        
        // Refresh the table
        renderGamesTable();
        showNotification('Game deleted successfully!');
    }
}

function editGame(gameId) {
    openGameModal(gameId);
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

function saveGames(games) {
    localStorage.setItem('gamesData', JSON.stringify(games));
    // Save last update timestamp
    localStorage.setItem('lastGameUpdate', JSON.stringify({
        data: { type: 'update', timestamp: Date.now() },
        timestamp: Date.now()
    }));
}

function addGame(gameData) {
    const newGame = {
        id: Date.now(), // Use timestamp as ID
        ...gameData
    };
    gamesData.push(newGame);
    saveGames(gamesData);
    renderGamesTable();
}

function updateGame(gameId, updatedData) {
    const index = gamesData.findIndex(game => game.id === gameId);
    if (index !== -1) {
        gamesData[index] = { ...gamesData[index], ...updatedData };
        saveGames(gamesData);
        renderGamesTable();
    }
}

// Broadcast channel for real-time updates
const gameUpdateChannel = new BroadcastChannel('game-updates');

function broadcastGameUpdate(updateData) {
    // Save to localStorage with timestamp
    localStorage.setItem('lastGameUpdate', JSON.stringify({
        data: updateData,
        timestamp: Date.now()
    }));
    
    // Broadcast the update
    gameUpdateChannel.postMessage(updateData);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load games from localStorage
    loadGames();
    renderGamesTable();

    // Set up event listeners for the game form
    gameForm.addEventListener('submit', handleGameSubmit);
}); 