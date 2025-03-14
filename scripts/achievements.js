// Achievement System
const achievements = {
    firstPurchase: {
        id: 'first_purchase',
        title: 'New Player',
        description: 'Made your first purchase',
        icon: '🎮',
        unlocked: false
    },
    bigSpender: {
        id: 'big_spender',
        title: 'Whale Status',
        description: 'Spent over $100 in a single purchase',
        icon: '💎',
        unlocked: false
    },
    collectionMaster: {
        id: 'collection_master',
        title: 'Collection Master',
        description: 'Added 5 different games to cart',
        icon: '🏆',
        unlocked: false
    },
    nightOwl: {
        id: 'night_owl',
        title: 'Night Owl',
        description: 'Made a purchase between 12 AM and 5 AM',
        icon: '🦉',
        unlocked: false
    },
    quickBuyer: {
        id: 'quick_buyer',
        title: 'Speed Runner',
        description: 'Completed a purchase in under 1 minute',
        icon: '⚡',
        unlocked: false
    }
};

class AchievementSystem {
    constructor() {
        this.achievements = this.loadAchievements();
        this.startTime = null;
    }

    loadAchievements() {
        const saved = localStorage.getItem('gameVaultAchievements');
        return saved ? JSON.parse(saved) : achievements;
    }

    saveAchievements() {
        localStorage.setItem('gameVaultAchievements', JSON.stringify(this.achievements));
    }

    startShopping() {
        this.startTime = new Date();
    }

    unlockAchievement(id) {
        if (!this.achievements[id].unlocked) {
            this.achievements[id].unlocked = true;
            this.saveAchievements();
            this.showAchievementNotification(this.achievements[id]);
        }
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <h3>${achievement.title}</h3>
                <p>${achievement.description}</p>
            </div>
        `;
        document.body.appendChild(notification);

        // Animate and remove notification
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 500);
            }, 3000);
        }, 100);
    }

    checkAchievements(cart) {
        // First Purchase
        if (cart.length > 0) {
            this.unlockAchievement('first_purchase');
        }

        // Big Spender
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        if (total > 100) {
            this.unlockAchievement('big_spender');
        }

        // Collection Master
        const uniqueGames = new Set(cart.map(item => item.id)).size;
        if (uniqueGames >= 5) {
            this.unlockAchievement('collection_master');
        }

        // Night Owl
        const hour = new Date().getHours();
        if (hour >= 0 && hour < 5) {
            this.unlockAchievement('night_owl');
        }

        // Quick Buyer
        if (this.startTime) {
            const purchaseTime = (new Date() - this.startTime) / 1000;
            if (purchaseTime < 60) {
                this.unlockAchievement('quick_buyer');
            }
        }
    }
}

// Export the achievement system
window.achievementSystem = new AchievementSystem(); 