// Theme management
let currentTheme = localStorage.getItem('theme') || 'light';

// Apply theme to the document
function applyTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    }
}

// Initialize theme on page load
function initializeTheme() {
    applyTheme();
}

// Toggle between light and dark themes
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    applyTheme();
}

// Initialize theme when the script loads
initializeTheme();
