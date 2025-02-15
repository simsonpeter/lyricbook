// Application State
const state = {
    songs: [],
    filteredSongs: [],
    bookmarks: JSON.parse(localStorage.getItem('bookmarks')) || [],
    currentTab: 'all',
    searchQuery: '',
    currentSongId: null
};

// DOM Elements
const elements = {
    search: document.getElementById('search'),
    songList: document.getElementById('song-list'),
    modal: document.getElementById('modal'),
    modalTitle: document.getElementById('modal-title'),
    modalLyrics: document.getElementById('modal-lyrics'),
    bookmarkBtn: document.getElementById('bookmark-btn'),
    loading: document.getElementById('loading'),
    error: document.getElementById('error')
};

// Initialize Application
window.addEventListener('DOMContentLoaded', initApp);

async function initApp() {
    try {
        showLoading();
        const response = await fetch('songs.json');
        
        if (!response.ok) throw new Error('Failed to load songs');
        
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid song data format');
        
        state.songs = data.map(song => ({
            ...song,
            searchText: `${song.title} ${song.content || ''}`.toLowerCase()
        }));
        
        setupEventListeners();
        updateUI();
        
    } catch (error) {
        showError(`பாடல்களை ஏற்ற முடியவில்லை: ${error.message}`);
    } finally {
        hideLoading();
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Tab Navigation
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            state.currentTab = tab.dataset.tab;
            updateUI();
        });
    });

    // Search Input
    elements.search.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase();
        updateUI();
    });

    // Modal Close Actions
    document.querySelector('.close').addEventListener('click', closeModal);
    elements.modal.addEventListener('click', (e) => {
        if (e.target === elements.modal) closeModal();
    });

    // Bookmark Button
    elements.bookmarkBtn.addEventListener('click', toggleBookmark);
}

// Update UI Components
function updateUI() {
    updateTabIndicator();
    filterSongs();
    renderSongList();
}

// Tab Indicator Update
function updateTabIndicator() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === state.currentTab);
    });
}

// Filter Songs Based on State
function filterSongs() {
    state.filteredSongs = state.songs.filter(song => {
        const matchesSearch = song.searchText.includes(state.searchQuery);
        const isBookmarked = state.bookmarks.includes(song.id);
        
        return state.currentTab === 'bookmarks' 
            ? (matchesSearch && isBookmarked)
            : matchesSearch;
    });
}

// Render Song List
function renderSongList() {
    elements.songList.innerHTML = state.filteredSongs
        .map(song => `
            <div class="song-card" data-id="${song.id}" onclick="showSong('${song.id}')">
                <h3>${song.title}</h3>
                ${song.author ? `<p class="author">${song.author}</p>` : ''}
            </div>
        `)
        .join('');
}

// Show Song Modal
function showSong(songId) {
    const song = state.songs.find(s => s.id === songId);
    if (!song) return;

    state.currentSongId = songId;
    
    // Update Modal Content
    elements.modalTitle.textContent = song.title;
    elements.modalLyrics.innerHTML = song.content
        .split('\n')
        .map(line => `<div class="lyric-line">${line}</div>`)
        .join('');
    
    // Update Bookmark Button
    elements.bookmarkBtn.textContent = state.bookmarks.includes(songId) ? '★' : '☆';
    
    // Show Modal
    elements.modal.style.display = 'block';
}

// Close Modal
function closeModal() {
    elements.modal.style.display = 'none';
    state.currentSongId = null;
}

// Toggle Bookmark
function toggleBookmark() {
    if (!state.currentSongId) return;

    const index = state.bookmarks.indexOf(state.currentSongId);
    
    if (index > -1) {
        state.bookmarks.splice(index, 1);
    } else {
        state.bookmarks.push(state.currentSongId);
    }
    
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
    updateUI();
    showSong(state.currentSongId); // Refresh modal state
}

// Loading States
function showLoading() {
    elements.loading.classList.remove('hidden');
    elements.error.classList.add('hidden');
}

function hideLoading() {
    elements.loading.classList.add('hidden');
}

// Error Handling
function showError(message) {
    elements.error.innerHTML = `
        <div class="error-message">
            <h3>பிழை!</h3>
            <p>${message}</p>
            <button onclick="location.reload()">மீண்டும் முயற்சிக்கவும்</button>
        </div>
    `;
    elements.error.classList.remove('hidden');
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .catch(err => console.error('Service Worker registration failed:', err));
    });
}
