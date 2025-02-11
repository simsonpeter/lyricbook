document.addEventListener('DOMContentLoaded', () => {
    // Theme Management
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Load Songs
    const loadSongs = async () => {
        try {
            const response = await fetch('songs.json');
            const { songs } = await response.json();
            const grid = document.getElementById('songGrid');
            const loading = document.getElementById('loadingStatus');
            
            loading.textContent = `${songs.length} hymns loaded`;
            
            songs.forEach(song => {
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

            // Search Implementation
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
            loading.textContent = 'Error loading hymn index';
        }
    };

    loadSongs();
});
