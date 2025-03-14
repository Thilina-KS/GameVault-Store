// Ping Service to prevent Render from spinning down
const pingService = {
    init() {
        // Ping every 5 minutes (300000 ms)
        this.pingInterval = 300000;
        this.startPing();
    },

    async ping() {
        try {
            const timestamp = new Date().toISOString();
            const response = await fetch(`${window.location.href}?ping=${timestamp}`);
            if (!response.ok) {
                console.warn('Ping failed:', response.status);
            }
        } catch (error) {
            console.warn('Ping error:', error);
        }
    },

    startPing() {
        // Initial ping
        this.ping();
        
        // Set up regular pings
        setInterval(() => this.ping(), this.pingInterval);

        // Add event listeners for visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.ping();
            }
        });

        // Ping on user interaction
        const userEvents = ['click', 'keypress', 'scroll', 'mousemove'];
        let lastPing = Date.now();

        userEvents.forEach(event => {
            document.addEventListener(event, () => {
                const now = Date.now();
                if (now - lastPing >= 60000) { // At most once per minute
                    this.ping();
                    lastPing = now;
                }
            }, { passive: true });
        });
    }
};

// Initialize ping service
document.addEventListener('DOMContentLoaded', () => {
    pingService.init();
}); 