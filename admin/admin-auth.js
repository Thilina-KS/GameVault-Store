// Admin credentials (in a real application, this would be stored securely on a server)
const ADMIN_EMAIL = 'admin@gamevault.com';
const ADMIN_PASSWORD = 'admin123'; // In a real app, this would be hashed

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    const currentPage = window.location.pathname;

    if (!isLoggedIn && !currentPage.includes('login.html')) {
        window.location.href = 'login.html';
    } else if (isLoggedIn && currentPage.includes('login.html')) {
        window.location.href = 'panel.html';
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem('adminLoggedIn', 'true');
        window.location.href = 'panel.html';
    } else {
        errorMessage.textContent = 'Invalid email or password';
        errorMessage.style.display = 'block';
    }

    return false;
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
}

// Check authentication status when page loads
document.addEventListener('DOMContentLoaded', checkAuth); 