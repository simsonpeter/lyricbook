document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initializeTheme();

    // Theme toggle button
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Rest of your existing app.js code
});

    // Load Songs
    try {
        const response = await fetch('songs.json');
        const data = await response.json();
        const grid = document.getElementById('songGrid');
        const loading = document.getElementById('loading');
        
        loading.remove();
        
        data.songs.forEach(song => {
            const card = document.createElement('div');
            card.className = 'song-card';
            card.innerHTML = `
                <a href="lyrics/${song.file}">
                    <h3>${song.title}</h3>
                    <p>${song.category} • #${song.id}</p>
                </a>
            `;
            grid.appendChild(card);
        });

        // Search Functionality
        document.getElementById('search').addEventListener('input', function() {
            const term = this.value.toLowerCase();
            document.querySelectorAll('.song-card').forEach(card => {
                card.style.display = card.textContent.toLowerCase().includes(term) 
                    ? 'block' 
                    : 'none';
            });
        });

    } catch (error) {
        console.error('Error loading songs:', error);
        document.getElementById('loading').textContent = 'Error loading songs';
    }
});
