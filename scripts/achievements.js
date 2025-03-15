// Achievement definitions
const achievements = [
    {
        id: 'first_purchase',
        title: 'First Purchase',
        description: 'Make your first purchase in the store',
        icon: '🛍️',
        unlocked: false,
        timestamp: null
    },
    {
        id: 'big_spender',
        title: 'Big Spender',
        description: 'Spend over $100 in a single purchase',
        icon: '💰',
        unlocked: false,
        timestamp: null
    },
    {
        id: 'night_owl',
        title: 'Night Owl',
        description: 'Enable dark mode',
        icon: '🌙',
        unlocked: false,
        timestamp: null
    },
    {
        id: 'collector',
        title: 'Game Collector',
        description: 'Add 5 different games to your cart',
        icon: '🎮',
        unlocked: false,
        timestamp: null
    }
];

let achievementsPanel = null;
let achievementsToggle = null;
let achievementsList = null;
let achievementsProgress = null;
let achievementsProgressBar = null;

// Initialize achievements system
function initAchievements() {
    try {
        // Create achievements toggle button if it doesn't exist
        if (!achievementsToggle) {
            achievementsToggle = document.createElement('button');
            achievementsToggle.className = 'achievements-toggle';
            achievementsToggle.setAttribute('aria-label', 'Toggle Achievements Panel');
            achievementsToggle.innerHTML = '🏆';
            document.body.appendChild(achievementsToggle);
        }

        // Create achievements panel if it doesn't exist
        if (!achievementsPanel) {
            achievementsPanel = document.createElement('div');
            achievementsPanel.className = 'achievements-panel';
            achievementsPanel.setAttribute('role', 'dialog');
            achievementsPanel.setAttribute('aria-label', 'Achievements');
            
            const header = document.createElement('h2');
            header.textContent = 'Achievements';
            achievementsPanel.appendChild(header);

            // Add progress bar
            const progressContainer = document.createElement('div');
            progressContainer.className = 'achievements-progress-bar';
            achievementsProgressBar = document.createElement('div');
            achievementsProgressBar.className = 'achievements-progress';
            progressContainer.appendChild(achievementsProgressBar);
            achievementsPanel.appendChild(progressContainer);

            achievementsList = document.createElement('div');
            achievementsList.className = 'achievement-list';
            achievementsPanel.appendChild(achievementsList);

            document.body.appendChild(achievementsPanel);
        }

        // Load saved achievements
        loadAchievements();

        // Add event listeners
        achievementsToggle.addEventListener('click', toggleAchievementsPanel);
        document.addEventListener('keydown', handleEscapeKey);

        // Initial UI update
        updateAchievementsPanel();
    } catch (error) {
        console.error('Error initializing achievements:', error);
    }
}

// Load achievements from localStorage
function loadAchievements() {
    try {
        const savedAchievements = localStorage.getItem('achievements');
        if (savedAchievements) {
            const parsed = JSON.parse(savedAchievements);
            achievements.forEach(achievement => {
                const saved = parsed.find(a => a.id === achievement.id);
                if (saved) {
                    achievement.unlocked = saved.unlocked;
                    achievement.timestamp = saved.timestamp;
                }
            });
        }
    } catch (error) {
        console.error('Error loading achievements:', error);
    }
}

// Save achievements to localStorage
function saveAchievements() {
    try {
        localStorage.setItem('achievements', JSON.stringify(achievements));
    } catch (error) {
        console.error('Error saving achievements:', error);
    }
}

// Toggle achievements panel visibility
function toggleAchievementsPanel() {
    achievementsPanel.classList.toggle('active');
    const isOpen = achievementsPanel.classList.contains('active');
    achievementsToggle.setAttribute('aria-expanded', isOpen.toString());
    if (isOpen) {
        achievementsPanel.focus();
    }
}

// Handle escape key press
function handleEscapeKey(event) {
    if (event.key === 'Escape' && achievementsPanel.classList.contains('active')) {
        toggleAchievementsPanel();
    }
}

// Update achievements panel UI
function updateAchievementsPanel() {
    if (!achievementsList) return;

    // Clear existing content
    achievementsList.innerHTML = '';

    // Update progress bar
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const progress = (unlockedCount / achievements.length) * 100;
    achievementsProgressBar.style.width = `${progress}%`;
    achievementsProgressBar.setAttribute('aria-valuenow', progress);
    achievementsProgressBar.setAttribute('aria-valuemin', '0');
    achievementsProgressBar.setAttribute('aria-valuemax', '100');

    // Add achievements to the list
    achievements.forEach(achievement => {
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement ${achievement.unlocked ? 'unlocked' : 'locked'}`;
        achievementElement.setAttribute('role', 'listitem');

        const icon = document.createElement('div');
        icon.className = 'achievement-icon';
        icon.textContent = achievement.icon;

        const info = document.createElement('div');
        info.className = 'achievement-info';

        const title = document.createElement('h3');
        title.textContent = achievement.title;

        const description = document.createElement('p');
        description.textContent = achievement.description;

        info.appendChild(title);
        info.appendChild(description);

        if (achievement.unlocked && achievement.timestamp) {
            const date = document.createElement('span');
            date.className = 'achievement-date';
            date.textContent = new Date(achievement.timestamp).toLocaleDateString();
            info.appendChild(date);
        }

        achievementElement.appendChild(icon);
        achievementElement.appendChild(info);
        achievementsList.appendChild(achievementElement);
    });
}

// Show achievement notification
function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');

    const icon = document.createElement('div');
    icon.className = 'achievement-icon';
    icon.textContent = achievement.icon;

    const text = document.createElement('div');
    text.className = 'achievement-text';

    const title = document.createElement('h3');
    title.textContent = 'Achievement Unlocked!';

    const description = document.createElement('p');
    description.textContent = achievement.title;

    text.appendChild(title);
    text.appendChild(description);

    notification.appendChild(icon);
    notification.appendChild(text);

    document.body.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Unlock achievement
function unlockAchievement(achievementId) {
    try {
        const achievement = achievements.find(a => a.id === achievementId);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            achievement.timestamp = new Date().toISOString();
            saveAchievements();
            updateAchievementsPanel();
            showAchievementNotification(achievement);
        }
    } catch (error) {
        console.error('Error unlocking achievement:', error);
    }
}

// Check for achievements
function checkAchievements() {
    try {
        // Check cart-related achievements
        if (window.cart && window.cart.length > 0) {
            unlockAchievement('first_purchase');
            
            const totalAmount = window.cart.reduce((total, item) => total + item.price * item.quantity, 0);
            if (totalAmount > 100) {
                unlockAchievement('big_spender');
            }

            const uniqueGames = new Set(window.cart.map(item => item.id));
            if (uniqueGames.size >= 5) {
                unlockAchievement('collector');
            }
        }

        // Check dark mode achievement
        if (document.body.classList.contains('dark-mode')) {
            unlockAchievement('night_owl');
        }
    } catch (error) {
        console.error('Error checking achievements:', error);
    }
}

// Initialize achievements when DOM is loaded
document.addEventListener('DOMContentLoaded', initAchievements);

// Export functions for use in other modules
window.achievements = {
    unlockAchievement,
    checkAchievements
}; 