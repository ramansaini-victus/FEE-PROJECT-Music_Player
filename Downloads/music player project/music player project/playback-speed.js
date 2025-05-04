// Playback speed options
const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
let currentSpeed = 1.0;

// Function to toggle the speed menu
function togglePlaybackSpeedMenu() {
    const speedMenu = document.querySelector('.speed-menu');
    if (!speedMenu) {
        createSpeedMenu();
    } else {
        speedMenu.classList.toggle('active');
    }
}

// Function to create the speed menu
function createSpeedMenu() {
    const menuDropdown = document.querySelector('.menu-dropdown');
    const speedMenu = document.createElement('div');
    speedMenu.className = 'speed-menu';
    
    speedOptions.forEach(speed => {
        const option = document.createElement('div');
        option.className = `speed-option ${speed === currentSpeed ? 'active' : ''}`;
        option.textContent = `${speed}x`;
        option.onclick = () => setPlaybackSpeed(speed);
        speedMenu.appendChild(option);
    });
    
    menuDropdown.appendChild(speedMenu);
    speedMenu.classList.add('active');
}

// Function to set playback speed
function setPlaybackSpeed(speed) {
    const audio = document.getElementById('audio');
    if (audio) {
        audio.playbackRate = speed;
        currentSpeed = speed;
        
        // Update active state in menu
        const speedOptions = document.querySelectorAll('.speed-option');
        speedOptions.forEach(option => {
            option.classList.remove('active');
            if (parseFloat(option.textContent) === speed) {
                option.classList.add('active');
            }
        });
    }
}

// Close speed menu when clicking outside
document.addEventListener('click', (e) => {
    const speedMenu = document.querySelector('.speed-menu');
    const menuDropdown = document.querySelector('.menu-dropdown');
    
    if (speedMenu && speedMenu.classList.contains('active') && 
        !menuDropdown.contains(e.target)) {
        speedMenu.classList.remove('active');
    }
});

// Initialize playback speed
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio');
    if (audio) {
        audio.playbackRate = currentSpeed;
    }
}); 