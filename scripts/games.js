// Steam Games Data
const games = [
    {
        id: 1,
        title: "Counter-Strike 2",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
        originalPrice: 0,
        discountedPrice: 0,
        genre: "fps",
        releaseDate: "2023-09-27",
        systemRequirements: {
            os: "Windows® 10 (64-bit)",
            processor: "Intel® Core™ i5-3570K or better",
            memory: "8 GB RAM",
            graphics: "NVIDIA® GeForce® GTX 1050 or better",
            storage: "85 GB available space"
        }
    },
    {
        id: 2,
        title: "Dota 2",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg",
        originalPrice: 0,
        discountedPrice: 0,
        genre: "moba",
        releaseDate: "2013-07-09",
        systemRequirements: {
            os: "Windows 7 or newer",
            processor: "Dual core from Intel or AMD at 2.8 GHz",
            memory: "4 GB RAM",
            graphics: "NVIDIA GeForce 8600/9600GT",
            storage: "60 GB available space"
        }
    },
    {
        id: 3,
        title: "Red Dead Redemption 2",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg",
        originalPrice: 59.99,
        discountedPrice: 29.99,
        genre: "action",
        releaseDate: "2019-12-05",
        systemRequirements: {
            os: "Windows 10",
            processor: "Intel® Core™ i7-4770K / AMD Ryzen 5 1500X",
            memory: "12 GB RAM",
            graphics: "NVIDIA GeForce GTX 1060 6GB",
            storage: "150 GB available space"
        }
    },
    {
        id: 4,
        title: "The Witcher 3: Wild Hunt",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg",
        originalPrice: 39.99,
        discountedPrice: 19.99,
        genre: "rpg",
        releaseDate: "2015-05-18",
        systemRequirements: {
            os: "Windows 7/8/10 64-bit",
            processor: "Intel CPU Core i5-2500K 3.3GHz",
            memory: "6 GB RAM",
            graphics: "NVIDIA GPU GeForce GTX 660",
            storage: "50 GB available space"
        }
    },
    {
        id: 5,
        title: "Grand Theft Auto V",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg",
        originalPrice: 29.99,
        discountedPrice: 14.99,
        genre: "action",
        releaseDate: "2015-04-14",
        systemRequirements: {
            os: "Windows 10 64-bit",
            processor: "Intel Core i5 3470 @ 3.2GHz",
            memory: "8 GB RAM",
            graphics: "NVIDIA GTX 660 2GB",
            storage: "110 GB available space"
        }
    },
    {
        id: 6,
        title: "Cyberpunk 2077",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
        originalPrice: 59.99,
        discountedPrice: 39.99,
        genre: "rpg",
        releaseDate: "2020-12-10",
        systemRequirements: {
            os: "Windows 10 64-bit",
            processor: "Intel Core i7-4790 or AMD Ryzen 3 3200G",
            memory: "12 GB RAM",
            graphics: "NVIDIA GeForce GTX 1060 6GB",
            storage: "70 GB available space"
        }
    },
    {
        id: 7,
        title: "FIFA 24",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2195250/header.jpg",
        originalPrice: 69.99,
        discountedPrice: 49.99,
        genre: "sports",
        releaseDate: "2023-09-29",
        systemRequirements: {
            os: "Windows 10 64-bit",
            processor: "Intel Core i5-6600K or AMD Ryzen 5 1600",
            memory: "8 GB RAM",
            graphics: "NVIDIA GeForce GTX 1050 Ti",
            storage: "100 GB available space"
        }
    },
    {
        id: 8,
        title: "Elden Ring",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
        originalPrice: 59.99,
        discountedPrice: 44.99,
        genre: "rpg",
        releaseDate: "2022-02-25",
        systemRequirements: {
            os: "Windows 10",
            processor: "INTEL CORE I5-8400 or AMD RYZEN 3 3300X",
            memory: "12 GB RAM",
            graphics: "NVIDIA GEFORCE GTX 1060 3 GB",
            storage: "60 GB available space"
        }
    },
    {
        id: 9,
        title: "PUBG: BATTLEGROUNDS",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/578080/header.jpg",
        originalPrice: 0,
        discountedPrice: 0,
        genre: "battle-royale",
        releaseDate: "2017-12-21",
        systemRequirements: {
            os: "64-bit Windows 10",
            processor: "Intel Core i5-4430 / AMD FX-6300",
            memory: "8 GB RAM",
            graphics: "NVIDIA GeForce GTX 960 2GB",
            storage: "40 GB available space"
        }
    },
    {
        id: 10,
        title: "Apex Legends",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg",
        originalPrice: 0,
        discountedPrice: 0,
        genre: "battle-royale",
        releaseDate: "2020-11-04",
        systemRequirements: {
            os: "64-bit Windows 10",
            processor: "Intel Core i3-6300 3.8GHz",
            memory: "6 GB RAM",
            graphics: "NVIDIA GeForce GT 640",
            storage: "56 GB available space"
        }
    },
    {
        id: 11,
        title: "Stardew Valley",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg",
        originalPrice: 14.99,
        discountedPrice: 11.99,
        genre: "simulation",
        releaseDate: "2016-02-26",
        systemRequirements: {
            os: "Windows Vista or greater",
            processor: "2 Ghz",
            memory: "2 GB RAM",
            graphics: "256 MB video memory",
            storage: "500 MB available space"
        }
    },
    {
        id: 12,
        title: "Rust",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/252490/header.jpg",
        originalPrice: 39.99,
        discountedPrice: 29.99,
        genre: "survival",
        releaseDate: "2018-02-08",
        systemRequirements: {
            os: "Windows 10 64bit",
            processor: "Intel Core i7-3770 / AMD FX-9590",
            memory: "10 GB RAM",
            graphics: "GTX 670 2GB / AMD R9 280",
            storage: "25 GB available space"
        }
    },
    {
        id: 13,
        title: "Portal 2",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/620/header.jpg",
        originalPrice: 9.99,
        discountedPrice: 4.99,
        genre: "puzzle",
        releaseDate: "2011-04-19",
        systemRequirements: {
            os: "Windows 7",
            processor: "3.0 GHz P4",
            memory: "2 GB RAM",
            graphics: "NVIDIA GeForce 7600",
            storage: "8 GB available space"
        }
    },
    {
        id: 14,
        title: "Terraria",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/105600/header.jpg",
        originalPrice: 9.99,
        discountedPrice: 7.99,
        genre: "sandbox",
        releaseDate: "2011-05-16",
        systemRequirements: {
            os: "Windows Xp, Vista, 7, 8/8.1, 10",
            processor: "2.0 Ghz",
            memory: "2.5 GB RAM",
            graphics: "128mb Video Memory",
            storage: "200 MB available space"
        }
    },
    {
        id: 15,
        title: "Among Us",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/945360/header.jpg",
        originalPrice: 4.99,
        discountedPrice: 3.99,
        genre: "party",
        releaseDate: "2018-11-16",
        systemRequirements: {
            os: "Windows 7 SP1+",
            processor: "SSE2 instruction set support",
            memory: "1 GB RAM",
            graphics: "Basic GPU",
            storage: "250 MB available space"
        }
    }
];

// Save games to localStorage
localStorage.setItem('gamesData', JSON.stringify(games)); 