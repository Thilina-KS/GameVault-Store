// Currency constants and utilities
const USD_TO_LKR = 315; // Current approximate rate

function formatCurrency(usdPrice) {
    return {
        usd: `$${usdPrice.toFixed(2)}`,
        lkr: `LKR ${(usdPrice * USD_TO_LKR).toLocaleString()}`
    };
} 