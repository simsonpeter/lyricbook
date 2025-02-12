document.addEventListener('DOMContentLoaded', () => {
    let songs = [];
    const apiUrl = 'songs.json';

    // DOM Elements
    const songList = document.getElementById('songList');
    const modal = document.getElementById('songModal');
    const form = document.getElementById('songForm');

    // Load initial songs
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            songs = data.songs;
            renderSongList();
        });

    // Render song list
    function renderSongList() {
        songList.innerHTML = '';
        songs.forEach(song => {
            const songItem = document.createElement('div');
            songItem.className = 'song-item';
            songItem.innerHTML = `
                <h3>${song.title}</h3>
                <p>${song.author}</p>
                <div class="song-actions">
                    <button class="edit-btn" data-id="${song.id}">Edit</button>
                    <button class="delete-btn" data-id="${song.id}">Delete</button>
                </div>
            `;
            songList.appendChild(songItem);
        });

        // Add event listeners to action buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => loadSongForEdit(e.target.dataset.id));
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => deleteSong(e.target.dataset.id));
        });
    }

    // Form Submit Handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const songData = {
            id: document.getElementById('songId').value || Date.now(),
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            category: document.getElementById('category').value,
            lyrics: document.getElementById('lyrics').value,
            last_updated: new Date().toISOString().split('T')[0]
        };

        if (songData.id) {
            // Update existing song
            const index = songs.findIndex(s => s.id == songData.id);
            songs[index] = songData;
        } else {
            // Add new song
            songs.push(songData);
        }

        renderSongList();
        closeModal();
    });

    // Delete Song
    function deleteSong(id) {
        songs = songs.filter(song => song.id != id);
        renderSongList();
    }

    // Load Song for Editing
    function loadSongForEdit(id) {
        const song = songs.find(s => s.id == id);
        document.getElementById('songId').value = song.id;
        document.getElementById('title').value = song.title;
        document.getElementById('author').value = song.author;
        document.getElementById('category').value = song.category;
        document.getElementById('lyrics').value = song.lyrics;
        openModal();
    }

    // Modal Controls
    document.getElementById('addSongBtn').addEventListener('click', openModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.querySelector('.close').addEventListener('click', closeModal);

    function openModal() {
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
        form.reset();
        document.getElementById('songId').value = '';
    }

    // Close modal when clicking outside
    window.onclick = function(e) {
        if (e.target === modal) {
            closeModal();
        }
    }
});
