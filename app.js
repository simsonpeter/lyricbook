document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);

    darkModeToggle.addEventListener('click', () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Load Songs
    fetch('songs.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('index');
            document.getElementById('loading').remove();

            data.songs.forEach(song => {
                const card = document.createElement('div');
                card.className = 'song-card';
                card.innerHTML = `
                    <a href="lyrics/${song.file}">
                        <span class="song-number">${song.id}.</span>
                        ${song.title}
                        <div class="song-meta">
                            <small>${song.category} • CCLI ${song.CCLI}</small>
                        </div>
                    </a>
                `;
                container.appendChild(card);
            });

            // Search Functionality
            document.getElementById('search').addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                document.querySelectorAll('.song-card').forEach(card => {
                    const text = card.textContent.toLowerCase();
                    card.style.display = text.includes(term) ? 'block' : 'none';
                });
            });
        });
});