let currentTheme = localStorage.getItem('theme') || 'light';

function applyTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    const themeButtons = document.querySelectorAll('#themeToggle');
    themeButtons.forEach(btn => {
        btn.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    });
}

function initializeTheme() {
    applyTheme();
    document.querySelectorAll('#themeToggle').forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    applyTheme();
}

// Initialize theme on load
document.addEventListener('DOMContentLoaded', initializeTheme);
