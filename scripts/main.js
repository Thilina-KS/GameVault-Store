// DOM Elements
const gamesContainer = document.querySelector('.games-container');
console.log('Games container element:', gamesContainer); // Debug log
const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('category-filter');

// Constants
const USD_TO_LKR = 320;
const FALLBACK_GAME_IMAGE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMjAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMzIwIDE1MCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMmM1MzY0OyIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzQxN2Y5YjsiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE1MCIgZmlsbD0idXJsKCNncmFkKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNDAlIiBmb250LXNpemU9IjIwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiPkdhbWUgSW1hZ2U8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNhZGI1YmQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCI+VGVtcG9yYXJpbHkgVW5hdmFpbGFibGU8L3RleHQ+PC9zdmc+";

// Format currency
function formatCurrency(amount) {
    return {
        usd: `$${amount.toFixed(2)}`,
        lkr: `LKR ${(amount * USD_TO_LKR).toFixed(2)}`
    };
}

// Initialize games data
function initGames() {
    try {
        console.log('Initializing games...'); // Debug log
        // Check if games are already loaded
        if (!window.games || !Array.isArray(window.games)) {
            console.log('Games not initialized, loading...'); // Debug log
            // Try to load from localStorage first
            const savedGames = localStorage.getItem('gamesData');
            if (savedGames) {
                window.games = JSON.parse(savedGames);
                console.log('Loaded games from localStorage:', window.games.length);
            } else {
                console.log('Loading default games array...'); // Debug log
                // Use default games array
                window.games = [
                    {
                        id: 1,
                        title: "Red Dead Redemption 2",
                        image: "https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg",
                        originalPrice: 59.99,
                        discountedPrice: 39.99,
                        genre: "Action",
                        releaseDate: "2019-12-05",
                        systemRequirements: {
                            os: "Windows 10",
                            processor: "Intel Core i7-4770K / AMD Ryzen 5 1500X",
                            memory: "12 GB RAM",
                            graphics: "NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 480 4GB",
                            storage: "150 GB"
                        }
                    },
                    {
                        id: 2,
                        title: "Cyberpunk 2077",
                        image: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
                        originalPrice: 59.99,
                        discountedPrice: 29.99,
                        genre: "RPG",
                        releaseDate: "2020-12-10",
                        systemRequirements: {
                            os: "Windows 10",
                            processor: "Intel Core i7-4790 / AMD Ryzen 3 3200G",
                            memory: "12 GB RAM",
                            graphics: "NVIDIA GeForce GTX 1060 6GB / AMD Radeon R9 Fury",
                            storage: "70 GB"
                        }
                    },
                    {
                        id: 3,
                        title: "Elden Ring",
                        image: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
                        originalPrice: 59.99,
                        discountedPrice: 49.99,
                        genre: "RPG",
                        releaseDate: "2022-02-25",
                        systemRequirements: {
                            os: "Windows 10",
                            processor: "Intel Core i5-8400 / AMD Ryzen 3 3300X",
                            memory: "12 GB RAM",
                            graphics: "NVIDIA GeForce GTX 1060 3GB / AMD Radeon RX 580 4GB",
                            storage: "60 GB"
                        }
                    },
                    {
                        id: 4,
                        title: "God of War",
                        image: "https://cdn.akamai.steamstatic.com/steam/apps/1593500/header.jpg",
                        originalPrice: 49.99,
                        discountedPrice: 39.99,
                        genre: "Action",
                        releaseDate: "2022-01-14",
                        systemRequirements: {
                            os: "Windows 10",
                            processor: "Intel i5-6600k / AMD Ryzen 5 2400G",
                            memory: "8 GB RAM",
                            graphics: "NVIDIA GTX 1060 6GB / AMD RX 570 4GB",
                            storage: "70 GB"
                        }
                    },
                    {
                        id: 5,
                        title: "Counter-Strike 2",
                        image: "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg",
                        originalPrice: 0,
                        discountedPrice: 0,
                        genre: "FPS",
                        releaseDate: "2023-09-27",
                        systemRequirements: {
                            os: "Windows 10",
                            processor: "Intel Core i5-4460 / AMD Ryzen 3 1200",
                            memory: "8 GB RAM",
                            graphics: "NVIDIA GTX 1060 / AMD RX 570",
                            storage: "85 GB"
                        }
                    },
                    {
                        id: 6,
                        title: "Baldur's Gate 3",
                        image: "https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg",
                        originalPrice: 59.99,
                        discountedPrice: 59.99,
                        genre: "RPG",
                        releaseDate: "2023-08-03",
                        systemRequirements: {
                            os: "Windows 10",
                            processor: "Intel i5-4690 / AMD FX 8350",
                            memory: "8 GB RAM",
                            graphics: "NVIDIA GTX 1060 6GB / AMD RX 580",
                            storage: "150 GB"
                        }
                    },
                    {
                        id: 7,
                        title: "EA SPORTS FC™ 24",
                        image: "https://cdn.akamai.steamstatic.com/steam/apps/2195250/header.jpg",
                        originalPrice: 69.99,
                        discountedPrice: 39.99,
                        genre: "Sports",
                        releaseDate: "2023-09-29",
                        systemRequirements: {
                            os: "Windows 10 64-bit",
                            processor: "Intel Core i5-6600K / AMD Ryzen 5 1600",
                            memory: "8 GB RAM",
                            graphics: "NVIDIA GeForce GTX 1050 Ti / AMD Radeon RX 570",
                            storage: "100 GB"
                        }
                    },
                    {
                        id: 8,
                        title: "Lethal Company",
                        image: "https://cdn.akamai.steamstatic.com/steam/apps/1966720/header.jpg",
                        originalPrice: 9.99,
                        discountedPrice: 9.99,
                        genre: "Survival",
                        releaseDate: "2023-10-23",
                        systemRequirements: {
                            os: "Windows 10",
                            processor: "Intel Core i5-4590",
                            memory: "8 GB RAM",
                            graphics: "NVIDIA GTX 970 / AMD RX 470",
                            storage: "2 GB"
                        }
                    },
                    {
                        id: 9,
                        title: "Palworld",
                        image: "https://cdn.akamai.steamstatic.com/steam/apps/1623730/header.jpg",
                        originalPrice: 29.99,
                        discountedPrice: 29.99,
                        genre: "Survival",
                        releaseDate: "2024-01-19",
                        systemRequirements: {
                            os: "Windows 10",
                            processor: "Intel Core i5-3570K / AMD Ryzen 3 1200",
                            memory: "16 GB RAM",
                            graphics: "NVIDIA GeForce GTX 1060 / AMD RX 570",
                            storage: "40 GB"
                        }
                    },
                    {
                        id: 10,
                        title: "Helldivers 2",
                        image: "https://cdn.akamai.steamstatic.com/steam/apps/553850/header.jpg",
                        originalPrice: 39.99,
                        discountedPrice: 39.99,
                        genre: "Action",
                        releaseDate: "2024-02-08",
                        systemRequirements: {
                            os: "Windows 10",
                            processor: "Intel Core i7-4790K / AMD Ryzen 5 1600",
                            memory: "16 GB RAM",
                            graphics: "NVIDIA RTX 2060 / AMD RX 6600 XT",
                            storage: "100 GB"
                        }
                    },
                    {
                        id: 11,
                        title: "Grand Theft Auto V",
                        image: "https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg",
                        originalPrice: 39.99,
                        discountedPrice: 19.99,
                        genre: "Action",
                        releaseDate: "2015-04-14",
                        systemRequirements: {
                            os: "Windows 10",
                            processor: "Intel Core i5-3470 / AMD FX-8350",
                            memory: "8 GB RAM",
                            graphics: "NVIDIA GTX 780 / AMD RX 470",
                            storage: "110 GB"
                        }
                    },
                    {
                        id: 12,
                        title: "The Last of Us™ Part I",
                        image: "https://cdn.akamai.steamstatic.com/steam/apps/1888930/header.jpg",
                        originalPrice: 59.99,
                        discountedPrice: 39.99,
                        genre: "Action",
                        releaseDate: "2023-03-28",
                        systemRequirements: {
                            os: "Windows 10",
                            processor: "AMD Ryzen 5 1500X / Intel Core i7-4770K",
                            memory: "16 GB RAM",
                            graphics: "AMD Radeon RX 470 / NVIDIA GeForce GTX 970",
                            storage: "100 GB"
                        }
                    },
                    {
                        id: 13,
                        title: "Resident Evil 4",
                        image: "https://cdn.akamai.steamstatic.com/steam/apps/2050650/header.jpg",
                        originalPrice: 59.99,
                        discountedPrice: 39.99,
                        genre: "Survival",
                        releaseDate: "2023-03-24",
                        systemRequirements: {
                            os: "Windows 10",
                            processor: "AMD Ryzen 3 1200 / Intel Core i5-7500",
                            memory: "8 GB RAM",
                            graphics: "AMD RX 560 / NVIDIA GeForce GTX 1050 Ti",
                            storage: "60 GB"
                        }
                    },
                    {
                        id: 14,
                        title: "Hogwarts Legacy",
                        image: "https://cdn.akamai.steamstatic.com/steam/apps/990080/header.jpg",
                        originalPrice: 59.99,
                        discountedPrice: 29.99,
                        genre: "RPG",
                        releaseDate: "2023-02-10",
                        systemRequirements: {
                            os: "Windows 10",
                            processor: "Intel Core i5-8400 / AMD Ryzen 5 2600",
                            memory: "16 GB RAM",
                            graphics: "NVIDIA GeForce GTX 1070 / AMD RX Vega 56",
                            storage: "85 GB"
                        }
                    },
                    {
                        id: 15,
                        title: "Sea of Thieves",
                        image: "https://cdn.akamai.steamstatic.com/steam/apps/1172620/header.jpg",
                        originalPrice: 39.99,
                        discountedPrice: 19.99,
                        genre: "Action",
                        releaseDate: "2020-06-03",
                        systemRequirements: {
                            os: "Windows 10",
                            processor: "Intel Q9450 / AMD Phenom II X6",
                            memory: "8 GB RAM",
                            graphics: "NVIDIA GTX 650 / AMD Radeon 7750",
                            storage: "50 GB"
                        }
                    },
                    {
                        id: 16,
                        title: "Marvel's Spider-Man 2",
                        image: "https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/60eca3ac155f0e05496cc83896ac5e00e16d76c3a0df4f26.jpg",
                        originalPrice: 69.99,
                        discountedPrice: 59.99,
                        genre: "Action",
                        releaseDate: "2024-03-20",
                        systemRequirements: {
                            os: "Windows 10 64-bit",
                            processor: "Intel Core i5-9400F / AMD Ryzen 5 3600",
                            memory: "16 GB RAM",
                            graphics: "NVIDIA RTX 3060 / AMD RX 6600 XT",
                            storage: "110 GB"
                        }
                    },
                    {
                        id: 17,
                        title: "Diablo IV",
                        image: "https://cdn.akamai.steamstatic.com/steam/apps/2344520/header.jpg",
                        originalPrice: 69.99,
                        discountedPrice: 49.99,
                        genre: "RPG",
                        releaseDate: "2023-10-17",
                        systemRequirements: {
                            os: "Windows 10 64-bit",
                            processor: "Intel Core i5-9600K / AMD Ryzen 5 3600",
                            memory: "16 GB RAM",
                            graphics: "NVIDIA GTX 1070 / AMD RX 5700",
                            storage: "90 GB"
                        }
                    },
                    {
                        id: 18,
                        title: "Lies of P",
                        image: "https://cdn.akamai.steamstatic.com/steam/apps/1627720/header.jpg",
                        originalPrice: 59.99,
                        discountedPrice: 44.99,
                        genre: "Action",
                        releaseDate: "2023-09-19",
                        systemRequirements: {
                            os: "Windows 10",
                            processor: "Intel Core i5-7600 / AMD Ryzen 3 3100",
                            memory: "16 GB RAM",
                            graphics: "NVIDIA GTX 1060 / AMD RX 580",
                            storage: "80 GB"
                        }
                    },
                    {
                        id: 19,
                        title: "Starfield",
                        image: "https://cdn.akamai.steamstatic.com/steam/apps/1716740/header.jpg",
                        originalPrice: 69.99,
                        discountedPrice: 59.99,
                        genre: "RPG",
                        releaseDate: "2023-09-06",
                        systemRequirements: {
                            os: "Windows 10/11",
                            processor: "Intel Core i7-6800K / AMD Ryzen 5 2600X",
                            memory: "16 GB RAM",
                            graphics: "NVIDIA RTX 2080 / AMD RX 6800 XT",
                            storage: "125 GB"
                        }
                    },
                    {
                        id: 20,
                        title: "Mortal Kombat 1",
                        image: "https://cdn.akamai.steamstatic.com/steam/apps/1971870/header.jpg",
                        originalPrice: 69.99,
                        discountedPrice: 49.99,
                        genre: "Action",
                        releaseDate: "2023-09-19",
                        systemRequirements: {
                            os: "Windows 10 64-bit",
                            processor: "Intel Core i5-6600 / AMD Ryzen 3 3100",
                            memory: "8 GB RAM",
                            graphics: "NVIDIA GTX 980 / AMD RX 470",
                            storage: "100 GB"
                        }
                    },
                    {
                        id: 21,
                        title: "Like a Dragon: Infinite Wealth",
                        image: "https://cdn.akamai.steamstatic.com/steam/apps/1971783/header.jpg",
                        originalPrice: 69.99,
                        discountedPrice: 59.99,
                        genre: "RPG",
                        releaseDate: "2024-01-26",
                        systemRequirements: {
                            os: "Windows 10",
                            processor: "Intel Core i5-3470 / AMD Ryzen 3 1200",
                            memory: "8 GB RAM",
                            graphics: "NVIDIA GTX 960 / AMD RX 460",
                            storage: "82 GB"
                        }
                    },
                    {
                        id: 22,
                        title: "Tekken 8",
                        image: "https://cdn.akamai.steamstatic.com/steam/apps/1778820/header.jpg",
                        originalPrice: 69.99,
                        discountedPrice: 64.99,
                        genre: "Action",
                        releaseDate: "2024-01-26",
                        systemRequirements: {
                            os: "Windows 10",
                            processor: "Intel Core i5-6600 / AMD Ryzen 5 1600",
                            memory: "8 GB RAM",
                            graphics: "NVIDIA GTX 1050 Ti / AMD RX 580",
                            storage: "100 GB"
                        }
                    },
                    {
                        id: 23,
                        title: "Dragon's Dogma 2",
                        image: "https://cdn.akamai.steamstatic.com/steam/apps/2054970/header.jpg",
                        originalPrice: 69.99,
                        discountedPrice: 69.99,
                        genre: "RPG",
                        releaseDate: "2024-03-22",
                        systemRequirements: {
                            os: "Windows 10",
                            processor: "Intel Core i7-9700K / AMD Ryzen 5 3600X",
                            memory: "16 GB RAM",
                            graphics: "NVIDIA RTX 2080 / AMD RX 6700",
                            storage: "65 GB"
                        }
                    },
                    {
                        id: 24,
                        title: "Rise of the Ronin",
                        image: "https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/1c7f65a6c6b8f8c9960709d3563c3e89e7cb816f6aafa01e.jpg",
                        originalPrice: 69.99,
                        discountedPrice: 69.99,
                        genre: "Action",
                        releaseDate: "2024-03-22",
                        systemRequirements: {
                            os: "Windows 10",
                            processor: "Intel Core i7-8700K / AMD Ryzen 5 3600",
                            memory: "16 GB RAM",
                            graphics: "NVIDIA RTX 3060 / AMD RX 6600 XT",
                            storage: "100 GB"
                        }
                    },
                    {
                        id: 25,
                        title: "Final Fantasy VII Rebirth",
                        image: "https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/ba9b66fe8c1f42f6c564f31d8b580be0e814d5f41f3c5a9c.jpg",
                        originalPrice: 69.99,
                        discountedPrice: 69.99,
                        genre: "RPG",
                        releaseDate: "2024-02-29",
                        systemRequirements: {
                            os: "Windows 10 64-bit",
                            processor: "Intel Core i7-9700K / AMD Ryzen 7 3700X",
                            memory: "16 GB RAM",
                            graphics: "NVIDIA RTX 3070 / AMD RX 6800",
                            storage: "150 GB"
                        }
                    }
                ];
                console.log('Default games array loaded with', window.games.length, 'games'); // Debug log
            }
        }

        // Save games to localStorage for future use
        try {
            localStorage.setItem('gamesData', JSON.stringify(window.games));
            console.log('Games saved to localStorage');
        } catch (error) {
            console.error('Error saving games to localStorage:', error);
        }

        // Initial render
        console.log('Starting initial render with', window.games.length, 'games'); // Debug log
        renderGames(window.games);
        console.log('Initial render complete');
    } catch (error) {
        console.error('Error initializing games:', error);
        gamesContainer.innerHTML = '<div class="error">Error loading games. Please try refreshing the page.</div>';
    }
}

// Functions
function renderGames(gamesToRender) {
    console.log('Rendering games:', gamesToRender.length); // Debug log
    
    if (!gamesToRender || !Array.isArray(gamesToRender) || gamesToRender.length === 0) {
        console.log('No games to render'); // Debug log
        gamesContainer.innerHTML = '<div class="no-games">No games available</div>';
        return;
    }

    const html = gamesToRender.map(game => {
        const originalPrice = formatCurrency(game.originalPrice);
        const discountedPrice = formatCurrency(game.discountedPrice);
        
        return `
        <div class="game-card" data-id="${game.id}">
            <img src="${game.image}" alt="${game.title}" class="game-image" onerror="this.onerror=null; this.src='${FALLBACK_GAME_IMAGE}';">
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
                    <p><strong>Genre:</strong> ${game.genre}</p>
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
    
    console.log('Generated HTML length:', html.length); // Debug log
    gamesContainer.innerHTML = html;
    console.log('HTML set to container'); // Debug log
}

function filterGames() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filtered = window.games.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchTerm);
        const matchesCategory = !selectedCategory || game.genre === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    renderGames(filtered);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // Initialize games
    initGames();
    
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

    // Add event listeners for search and filter
    if (searchInput) {
        searchInput.addEventListener('input', filterGames);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterGames);
    }
}); 