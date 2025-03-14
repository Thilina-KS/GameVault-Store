// DOM Elements
const gamesTableBody = document.getElementById('gamesTableBody');
const gameModal = document.getElementById('gameModal');
const gameForm = document.getElementById('gameForm');
const modalTitle = document.getElementById('modalTitle');

// State
let editingGameId = null;
let gamesData = [...games]; // Create a mutable copy of the games array

// Functions
function renderGamesTable() {
    gamesTableBody.innerHTML = gamesData.map(game => `
        <tr>
            <td><img src="${game.image}" alt="${game.title}" class="game-thumbnail"></td>
            <td>${game.title}</td>
            <td>${game.genre}</td>
            <td>$${game.originalPrice.toFixed(2)}</td>
            <td>$${game.discountedPrice.toFixed(2)}</td>
            <td>
                <button onclick="editGame(${game.id})" class="action-btn edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteGame(${game.id})" class="action-btn delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
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

    const gameData = {
        id: editingGameId || gamesData.length + 1,
        title: document.getElementById('title').value,
        image: document.getElementById('image').value,
        originalPrice: parseFloat(document.getElementById('originalPrice').value),
        discountedPrice: parseFloat(document.getElementById('discountedPrice').value),
        genre: document.getElementById('genre').value,
        releaseDate: document.getElementById('releaseDate').value,
        systemRequirements: {
            os: document.getElementById('os').value,
            processor: document.getElementById('processor').value,
            memory: document.getElementById('memory').value,
            graphics: document.getElementById('graphics').value,
            storage: document.getElementById('storage').value
        }
    };

    if (editingGameId) {
        // Update existing game
        const index = gamesData.findIndex(g => g.id === editingGameId);
        gamesData[index] = gameData;
    } else {
        // Add new game
        gamesData.push(gameData);
    }

    // Save to localStorage
    localStorage.setItem('gamesData', JSON.stringify(gamesData));
    
    // Update the games variable for the main site
    window.games = [...gamesData];

    // Refresh table and close modal
    renderGamesTable();
    closeGameModal();
    showNotification(editingGameId ? 'Game updated successfully!' : 'Game added successfully!');

    return false;
}

function deleteGame(gameId) {
    if (confirm('Are you sure you want to delete this game?')) {
        const index = gamesData.findIndex(g => g.id === gameId);
        gamesData.splice(index, 1);
        
        // Save to localStorage
        localStorage.setItem('gamesData', JSON.stringify(gamesData));
        
        // Update the games variable for the main site
        window.games = [...gamesData];

        // Refresh table
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
    // Save to adminGamesData for syncing
    localStorage.setItem('adminGamesData', JSON.stringify(games));
    localStorage.setItem('adminGamesLastUpdate', Date.now().toString());
    
    // Also update regular gamesData
    localStorage.setItem('gamesData', JSON.stringify(games));
    localStorage.setItem('gamesLastUpdate', Date.now().toString());
}

function addGame(gameData) {
    const games = loadGames();
    const newGame = {
        id: Date.now(), // Use timestamp as ID
        ...gameData
    };
    games.push(newGame);
    saveGames(games);
    renderGamesTable();
}

function updateGame(gameId, updatedData) {
    const games = loadGames();
    const index = games.findIndex(game => game.id === gameId);
    if (index !== -1) {
        games[index] = { ...games[index], ...updatedData };
        saveGames(games);
        renderGamesTable();
    }
}

function deleteGame(gameId) {
    const games = loadGames();
    const filteredGames = games.filter(game => game.id !== gameId);
    saveGames(filteredGames);
    renderGamesTable();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load games from localStorage if available
    const savedGames = localStorage.getItem('gamesData');
    if (savedGames) {
        gamesData = JSON.parse(savedGames);
        window.games = [...gamesData]; // Update the main site's games array
    } else {
        gamesData = [...games]; // Use the initial games data if nothing in localStorage
    }
    renderGamesTable();
}); 