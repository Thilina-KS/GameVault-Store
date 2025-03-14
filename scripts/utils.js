// Currency constants and utilities
const USD_TO_LKR = 315; // Current approximate rate

function formatCurrency(usdPrice) {
    return {
        usd: `$${usdPrice.toFixed(2)}`,
        lkr: `LKR ${(usdPrice * USD_TO_LKR).toLocaleString()}`
    };
}

// Game Data Management
const gameDataManager = {
    lastUpdate: 0,

    async checkForUpdates() {
        const currentData = localStorage.getItem('gamesData');
        const currentTimestamp = localStorage.getItem('gamesLastUpdate');
        
        // Get games data from admin's localStorage
        const adminGamesData = localStorage.getItem('adminGamesData');
        const adminTimestamp = localStorage.getItem('adminGamesLastUpdate');

        if (adminGamesData && adminTimestamp) {
            // Compare timestamps
            if (!currentTimestamp || parseInt(adminTimestamp) > parseInt(currentTimestamp)) {
                // Update the games data
                localStorage.setItem('gamesData', adminGamesData);
                localStorage.setItem('gamesLastUpdate', adminTimestamp);
                return true;
            }
        }
        return false;
    },

    startSyncInterval() {
        // Check for updates every 30 seconds
        setInterval(async () => {
            const hasUpdates = await this.checkForUpdates();
            if (hasUpdates) {
                // Reload games and refresh the display
                window.dispatchEvent(new CustomEvent('gamesUpdated'));
            }
        }, 30000); // 30 seconds interval
    }
};

// Export for global use
window.gameDataManager = gameDataManager; 