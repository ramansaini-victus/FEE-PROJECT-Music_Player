class AudioVisualizer {
    constructor() {
        this.canvas = document.getElementById('visualizer');
        this.ctx = this.canvas.getContext('2d');
        this.audio = document.getElementById('audio');
        this.audioContext = null;
        this.analyser = null;
        this.source = null;
        this.bufferLength = 0;
        this.dataArray = null;
        this.isVisualizing = false;
        this.currentMode = 'bars';
        this.setupEventListeners();
        this.resizeCanvas();
    }

    initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.source = this.audioContext.createMediaElementSource(this.audio);
            this.source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            this.analyser.fftSize = 256;
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
        }
    }

    setupEventListeners() {
        // Initialize audio context on first user interaction
        const initOnInteraction = () => {
            this.initAudioContext();
            document.removeEventListener('click', initOnInteraction);
            document.removeEventListener('keydown', initOnInteraction);
        };

        document.addEventListener('click', initOnInteraction);
        document.addEventListener('keydown', initOnInteraction);

        // Visualizer toggle button
        document.getElementById('visualizerToggle').addEventListener('click', () => {
            this.initAudioContext();
            this.isVisualizing = !this.isVisualizing;
            if (this.isVisualizing) {
                this.startVisualization();
            } else {
                this.stopVisualization();
            }
        });

        // Mode buttons
        document.querySelectorAll('.mode-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.currentMode = button.dataset.mode;
            });
        });

        // Window resize
        window.addEventListener('resize', () => this.resizeCanvas());

        // Handle audio play/pause
        this.audio.addEventListener('play', () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        });
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    startVisualization() {
        if (!this.isVisualizing || !this.analyser) return;
        this.analyser.getByteFrequencyData(this.dataArray);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        switch (this.currentMode) {
            case 'bars':
                this.drawBars();
                break;
            case 'circle':
                this.drawCircle();
                break;
            case 'wave':
                this.drawWave();
                break;
        }

        requestAnimationFrame(() => this.startVisualization());
    }

    stopVisualization() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBars() {
        const barWidth = (this.canvas.width / this.bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < this.bufferLength; i++) {
            barHeight = (this.dataArray[i] / 255) * this.canvas.height;
            
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            gradient.addColorStop(0, '#FFD700');
            gradient.addColorStop(1, '#FFA500');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
        }
    }

    drawCircle() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.8;
        
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        for (let i = 0; i < this.bufferLength; i++) {
            const angle = (i / this.bufferLength) * 2 * Math.PI;
            const amplitude = (this.dataArray[i] / 255) * radius;
            
            const x = centerX + Math.cos(angle) * (radius + amplitude);
            const y = centerY + Math.sin(angle) * (radius + amplitude);
            
            if (i === 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.closePath();
        const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(1, '#FFA500');
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    drawWave() {
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height / 2);
        
        for (let i = 0; i < this.bufferLength; i++) {
            const x = (i / this.bufferLength) * this.canvas.width;
            const y = (this.dataArray[i] / 255) * this.canvas.height;
            
            this.ctx.lineTo(x, y);
        }
        
        this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
        this.ctx.closePath();
        
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(1, '#FFA500');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const visualizer = new AudioVisualizer();
}); 