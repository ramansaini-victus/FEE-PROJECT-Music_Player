// DOM Elements
const audio = document.getElementById('audio');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const progressBar = document.getElementById('progressBar');
const volumeSlider = document.getElementById('volumeSlider');
const sidebar = document.querySelector('.sidebar');
const themeToggle = document.getElementById('themeToggle');
const songList = document.getElementById('songList');

// Playlist Array (example data structure for favorites)
let playlist = [
    { title: "WAR", artist: "Nirvair Pannu", src: "songs/WAR.mp3", cover: "images/WAR-Punjabi-2023-20231211191050-500x500 (1).jpg", favorite: false },
    { title: "Afterhours", artist: "BIR", src: "songs/Afterhours - Bir.mp3", cover: "images/hqdefault.jpg", favorite: false },
    { title: "Bexley Road", artist: "Baggh E SMG", src: "songs/Bexley Road - Baggh E SMG.mp3", cover: "images/size_m.jpg", favorite: false },
    { title: "Judaa 3", artist: "Amrinder Gill", src: "songs/Judaa 3 Title Track - Amrinder Gill.mp3", cover: "images/AG.jpg", favorite: false },
    { title: "Khush Reha Kar", artist: "Rajvir Jawanda", src: "songs/Khush Reha Kar - Rajvir Jawanda.mp3", cover: "images/RJ.jpeg", favorite: false }
];
let favorites = [];
let currentSongIndex = 0;

// Load Initial Song
function loadSong(index) {
    const song = playlist[index];
    document.getElementById('name').textContent = song.artist;
    document.querySelector('.title.run').textContent = song.title;
    document.getElementById('artist').src = song.cover;
    audio.src = song.src;
}

// Toggle Sidebar Visibility
function toggleSidebar() {
    sidebar.classList.toggle('active');
}

// Play or Pause the Audio
function togglePlay() {
    if (audio.paused) {
        audio.play();
        updatePlayPauseIcons(false); // Show pause icon
    } else {
        audio.pause();
        updatePlayPauseIcons(true); // Show play icon
    }
}

// Helper function to update play/pause icons
function updatePlayPauseIcons(showPlay) {
    if (showPlay) {
        playIcon.classList.add('active');
        pauseIcon.classList.remove('active');
    } else {
        playIcon.classList.remove('active');
        pauseIcon.classList.add('active');
    }
}

// Navigate to the Next Song
function forward() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    loadSong(currentSongIndex);
    audio.play();
    updatePlayPauseIcons(false); // Show pause icon
}

// Navigate to the Previous Song
function backward() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentSongIndex);
    audio.play();
    updatePlayPauseIcons(false); // Show pause icon
}

// Update Progress Bar
audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
    document.getElementById('start').textContent = formatTime(audio.currentTime);
    document.getElementById('end').textContent = formatTime(audio.duration);
});

// Seek Audio Position
progressBar.addEventListener('input', () => {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
});

// Volume Control
volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
});

// Format Time Display
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Theme Toggle (Light/Dark Mode)
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
});

// Show All Songs
function showAllSongs() {
    const songList = document.getElementById('songList');
    songList.innerHTML = "<h3 style='color: #FFD700; margin: 10px 0;'>All Songs</h3>";
    
    playlist.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${song.title} - ${song.artist}</span>
            <div class="song-controls">
                <button onclick="playSong(${index})"><i class="fas fa-play"></i></button>
                <button onclick="toggleFavorite(${index})" class="favorite-btn">
                    ${song.favorite ? '★' : '☆'}
                </button>
            </div>
        `;
        songList.appendChild(li);
    });
    
    // Keep sidebar open when showing songs
    sidebar.classList.add('active');
}

function playSong(index) {
    currentSongIndex = index;
    loadSong(currentSongIndex);
    audio.play();
    playIcon.classList.add('none');
    pauseIcon.classList.remove('none');
}

function toggleFavorite(index) {
    playlist[index].favorite = !playlist[index].favorite;
    if (playlist[index].favorite) {
        if (!favorites.includes(playlist[index])) {
            favorites.push(playlist[index]);
        }
    } else {
        favorites = favorites.filter(song => song !== playlist[index]);
    }
    // Update the display based on current view
    if (document.getElementById('songList').firstChild.textContent === 'Favorites') {
        showFavorites();
    } else {
        showAllSongs();
    }
}

// Show Favorites
function showFavorites() {
    const songList = document.getElementById('songList');
    songList.innerHTML = "<h3 style='color: #FFD700; margin: 10px 0;'>Favorites</h3>";
    
    if (favorites.length === 0) {
        songList.innerHTML += "<p style='color: #f4f4f4; padding: 10px;'>No favorite songs yet!</p>";
        return;
    }
    
    favorites.forEach(song => {
        const originalIndex = playlist.findIndex(s => s === song);
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${song.title} - ${song.artist}</span>
            <div class="song-controls">
                <button onclick="playSong(${originalIndex})"><i class="fas fa-play"></i></button>
                <button onclick="toggleFavorite(${originalIndex})" class="favorite-btn">★</button>
            </div>
        `;
        songList.appendChild(li);
    });
    
    // Keep sidebar open when showing favorites
    sidebar.classList.add('active');
}

// Add New Song Modal (Simplified Version)
function openAddSongModal() {
    const newSongTitle = prompt("Enter Song Title:");
    const newSongArtist = prompt("Enter Artist Name:");
    const newSongSrc = prompt("Enter Song File Path (e.g., 'songs/song.mp3'):");
    const newSongCover = prompt("Enter Cover Image Path (e.g., 'images/cover.jpg'):");

    if (newSongTitle && newSongArtist && newSongSrc && newSongCover) {
        const newSong = {
            title: newSongTitle,
            artist: newSongArtist,
            src: newSongSrc,
            cover: newSongCover,
            favorite: false // Add favorite property to new songs
        };
        playlist.push(newSong);
        alert("New song added to the playlist!");
        showAllSongs(); // Refresh the song list
    }
}

// Load the initial song and show all songs when the page loads
window.onload = function() {
    loadSong(currentSongIndex);
    showAllSongs();
    updatePlayPauseIcons(true); // Show play icon initially
};

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Add event listener for when song ends
audio.addEventListener('ended', () => {
    updatePlayPauseIcons(true); // Show play icon
});

// Add event listener for when song loads
audio.addEventListener('loadeddata', () => {
    // Update duration display
    document.getElementById('end').textContent = formatTime(audio.duration);
});
