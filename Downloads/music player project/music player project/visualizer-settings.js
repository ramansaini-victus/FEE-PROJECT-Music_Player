// Visualizer settings
let visualizerSettings = {
    mode: 'bars',
    color: '#4a90e2',
    intensity: 5,
    background: 'transparent',
    fps: 45
};

// Function to toggle visualizer settings panel
function toggleVisualizerSettings() {
    const panel = document.getElementById('visualizerSettingsPanel');
    panel.classList.toggle('active');
    
    // Add close button if not exists
    if (!document.querySelector('.settings-close')) {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'settings-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.onclick = () => panel.classList.remove('active');
        panel.appendChild(closeBtn);
    }
}

// Initialize visualizer settings
document.addEventListener('DOMContentLoaded', () => {
    // Get all settings elements
    const modeSelect = document.getElementById('visualizerMode');
    const colorPicker = document.getElementById('visualizerColor');
    const intensitySlider = document.getElementById('visualizerIntensity');
    const backgroundSelect = document.getElementById('visualizerBackground');
    const fpsSlider = document.getElementById('visualizerFPS');
    const intensityValue = document.getElementById('intensityValue');
    const fpsValue = document.getElementById('fpsValue');

    // Set initial values
    modeSelect.value = visualizerSettings.mode;
    colorPicker.value = visualizerSettings.color;
    intensitySlider.value = visualizerSettings.intensity;
    backgroundSelect.value = visualizerSettings.background;
    fpsSlider.value = visualizerSettings.fps;
    intensityValue.textContent = visualizerSettings.intensity;
    fpsValue.textContent = visualizerSettings.fps;

    // Add event listeners
    modeSelect.addEventListener('change', (e) => {
        visualizerSettings.mode = e.target.value;
        updateVisualizer();
    });

    colorPicker.addEventListener('input', (e) => {
        visualizerSettings.color = e.target.value;
        updateVisualizer();
    });

    intensitySlider.addEventListener('input', (e) => {
        visualizerSettings.intensity = parseInt(e.target.value);
        intensityValue.textContent = e.target.value;
        updateVisualizer();
    });

    backgroundSelect.addEventListener('change', (e) => {
        visualizerSettings.background = e.target.value;
        updateVisualizer();
    });

    fpsSlider.addEventListener('input', (e) => {
        visualizerSettings.fps = parseInt(e.target.value);
        fpsValue.textContent = e.target.value;
        updateVisualizer();
    });
});

// Function to update visualizer with new settings
function updateVisualizer() {
    const visualizer = document.getElementById('visualizer');
    if (!visualizer) return;

    // Update visualizer canvas with new settings
    const ctx = visualizer.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, visualizer.width, visualizer.height);
    
    // Apply background
    switch (visualizerSettings.background) {
        case 'transparent':
            ctx.clearRect(0, 0, visualizer.width, visualizer.height);
            break;
        case 'gradient':
            const gradient = ctx.createLinearGradient(0, 0, 0, visualizer.height);
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, visualizer.width, visualizer.height);
            break;
        case 'solid':
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, visualizer.width, visualizer.height);
            break;
    }

    // Update visualizer mode
    const modeBtns = document.querySelectorAll('.mode-btn');
    modeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === visualizerSettings.mode) {
            btn.classList.add('active');
        }
    });

    // Update visualizer color
    document.documentElement.style.setProperty('--visualizer-color', visualizerSettings.color);

    // Update visualizer intensity
    document.documentElement.style.setProperty('--visualizer-intensity', visualizerSettings.intensity);

    // Update FPS
    if (window.visualizerAnimation) {
        cancelAnimationFrame(window.visualizerAnimation);
    }
    animateVisualizer();
}

// Function to animate visualizer
function animateVisualizer() {
    const visualizer = document.getElementById('visualizer');
    if (!visualizer) return;

    const ctx = visualizer.getContext('2d');
    const audio = document.getElementById('audio');
    
    if (!audio || !audio.playing) {
        window.visualizerAnimation = requestAnimationFrame(animateVisualizer);
        return;
    }

    // Get audio data
    const analyser = audio.analyser;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    // Clear canvas
    ctx.clearRect(0, 0, visualizer.width, visualizer.height);

    // Draw based on mode
    switch (visualizerSettings.mode) {
        case 'bars':
            drawBars(ctx, dataArray);
            break;
        case 'circle':
            drawCircle(ctx, dataArray);
            break;
        case 'wave':
            drawWave(ctx, dataArray);
            break;
    }

    // Schedule next frame
    window.visualizerAnimation = requestAnimationFrame(animateVisualizer);
}

// Drawing functions
function drawBars(ctx, dataArray) {
    const barWidth = visualizer.width / dataArray.length;
    const intensity = visualizerSettings.intensity;
    
    for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * visualizer.height * intensity;
        const x = i * barWidth;
        const y = visualizer.height - barHeight;
        
        ctx.fillStyle = visualizerSettings.color;
        ctx.fillRect(x, y, barWidth - 1, barHeight);
    }
}

function drawCircle(ctx, dataArray) {
    const centerX = visualizer.width / 2;
    const centerY = visualizer.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    const intensity = visualizerSettings.intensity;
    
    ctx.beginPath();
    for (let i = 0; i < dataArray.length; i++) {
        const angle = (i / dataArray.length) * Math.PI * 2;
        const value = (dataArray[i] / 255) * radius * intensity;
        const x = centerX + Math.cos(angle) * (radius + value);
        const y = centerY + Math.sin(angle) * (radius + value);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.fillStyle = visualizerSettings.color;
    ctx.fill();
}

function drawWave(ctx, dataArray) {
    const intensity = visualizerSettings.intensity;
    
    ctx.beginPath();
    for (let i = 0; i < dataArray.length; i++) {
        const x = (i / dataArray.length) * visualizer.width;
        const y = visualizer.height / 2 + (dataArray[i] / 255) * (visualizer.height / 2) * intensity;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.strokeStyle = visualizerSettings.color;
    ctx.lineWidth = 2;
    ctx.stroke();
} 