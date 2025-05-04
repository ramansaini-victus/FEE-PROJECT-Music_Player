// Voice Commands for Music Player
class VoiceCommands {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.lastCommandTime = 0;
        this.commandCooldown = 500; // Reduced to 500ms for faster response
        this.commands = {
            'play': () => this.handlePlayCommand(),
            'pause': () => this.handlePauseCommand(),
            'next': () => this.handleNextCommand(),
            'previous': () => this.handlePreviousCommand(),
            'volume up': () => this.handleVolumeUpCommand(),
            'volume down': () => this.handleVolumeDownCommand(),
            'mute': () => this.handleMuteCommand(),
            'unmute': () => this.handleUnmuteCommand(),
            'stop': () => this.handleStopCommand(),
            'resume': () => this.handleResumeCommand(),
            'search': (query) => this.handleSearchCommand(query),
            'what song': () => this.handleCurrentSongCommand(),
            'repeat': () => this.handleRepeatCommand(),
            'shuffle': () => this.handleShuffleCommand()
        };
        
        // Pre-compile regex patterns
        this.fillerWordsRegex = /\b(um|uh|like|you know)\b/g;
        this.whitespaceRegex = /\s+/g;
    }

    initialize() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
            this.recognition.maxAlternatives = 1; // Reduced to 1 for faster processing

            this.recognition.onresult = (event) => {
                const now = Date.now();
                if (now - this.lastCommandTime < this.commandCooldown) {
                    return;
                }

                const result = event.results[event.results.length - 1];
                if (result.isFinal) {
                    const transcript = result[0].transcript.toLowerCase().trim();
                    this.processCommand(transcript);
                    this.lastCommandTime = now;
                }
            };

            this.recognition.onerror = (event) => {
                if (event.error === 'no-speech' || event.error === 'audio-capture') {
                    this.showToast('Microphone issue. Please check settings.', 1500);
                }
                
                if (this.isListening) {
                    setTimeout(() => this.recognition.start(), 500);
                }
            };

            this.recognition.onend = () => {
                if (this.isListening) {
                    this.recognition.start();
                }
            };
        } else {
            this.showToast('Voice commands not supported', 2000);
        }
    }

    startListening() {
        if (this.recognition) {
            try {
                this.recognition.start();
                this.isListening = true;
                this.showToast('Listening for voice commands...', 2000);
            } catch (error) {
                console.error('Error starting recognition:', error);
                this.showToast('Error starting voice commands. Please try again.', 2000);
            }
        }
    }

    stopListening() {
        if (this.recognition) {
            try {
                this.recognition.stop();
                this.isListening = false;
                this.showToast('Voice commands stopped', 2000);
            } catch (error) {
                console.error('Error stopping recognition:', error);
            }
        }
    }

    processCommand(transcript) {
        // Faster transcript cleaning
        const cleanedTranscript = transcript
            .replace(this.fillerWordsRegex, '')
            .replace(this.whitespaceRegex, ' ')
            .trim();

        // Quick exact match check
        for (const [command, handler] of Object.entries(this.commands)) {
            if (cleanedTranscript.includes(command)) {
                if (command === 'search') {
                    const query = cleanedTranscript.replace('search', '').trim();
                    if (query) handler(query);
                } else {
                    handler();
                }
                this.showToast(`Command executed: ${command}`, 1500);
                return;
            }
        }

        // Fast partial match with word count
        for (const [command, handler] of Object.entries(this.commands)) {
            const words = command.split(' ');
            let matchCount = 0;
            
            for (const word of words) {
                if (cleanedTranscript.includes(word)) matchCount++;
            }
            
            if (matchCount / words.length >= 0.7) {
                if (command === 'search') {
                    const query = cleanedTranscript.replace(words[0], '').trim();
                    if (query) handler(query);
                } else {
                    handler();
                }
                this.showToast(`Command executed: ${command}`, 1500);
                return;
            }
        }

        // If no command matched, show help message
        this.showToast('Command not recognized. Try saying "help" for available commands.', 2000);
    }

    handlePlayCommand() {
        if (audio.paused) audio.play();
    }

    handlePauseCommand() {
        if (!audio.paused) audio.pause();
    }

    handleNextCommand() {
        forward();
    }

    handlePreviousCommand() {
        backward();
    }

    handleVolumeUpCommand() {
        const newVolume = Math.min(1, audio.volume + 0.1);
        audio.volume = newVolume;
        volumeSlider.value = newVolume;
        volumeSlider.style.setProperty('--fill', `${newVolume * 100}%`);
    }

    handleVolumeDownCommand() {
        const newVolume = Math.max(0, audio.volume - 0.1);
        audio.volume = newVolume;
        volumeSlider.value = newVolume;
        volumeSlider.style.setProperty('--fill', `${newVolume * 100}%`);
    }

    handleMuteCommand() {
        audio.volume = 0;
        volumeSlider.value = 0;
        volumeSlider.style.setProperty('--fill', '0%');
    }

    handleUnmuteCommand() {
        audio.volume = 0.5;
        volumeSlider.value = 0.5;
        volumeSlider.style.setProperty('--fill', '50%');
    }

    handleStopCommand() {
        audio.pause();
        audio.currentTime = 0;
        updatePlayPauseIcons(true);
    }

    handleResumeCommand() {
        if (audio.paused) audio.play();
    }

    handleSearchCommand(query) {
        const searchResults = playlist.filter(song => 
            song.title.toLowerCase().includes(query.toLowerCase()) || 
            song.artist.toLowerCase().includes(query.toLowerCase())
        );
        
        if (searchResults.length > 0) {
            const index = playlist.findIndex(song => song === searchResults[0]);
            currentSongIndex = index;
            loadSong(currentSongIndex);
            audio.play();
            updatePlayPauseIcons(false);
            this.showToast(`Playing: ${searchResults[0].title}`, 2000);
        } else {
            this.showToast('No matching songs found', 2000);
        }
    }

    handleCurrentSongCommand() {
        const currentSong = playlist[currentSongIndex];
        this.showToast(`Currently playing: ${currentSong.title} by ${currentSong.artist}`, 3000);
    }

    handleRepeatCommand() {
        const repeatBtn = document.querySelector('[onclick="toggleRepeatMode()"]');
        if (repeatBtn) {
            repeatBtn.click();
            this.showToast('Repeat mode toggled', 1500);
        }
    }

    handleShuffleCommand() {
        const shuffledPlaylist = [...playlist];
        for (let i = shuffledPlaylist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledPlaylist[i], shuffledPlaylist[j]] = [shuffledPlaylist[j], shuffledPlaylist[i]];
        }
        playlist = shuffledPlaylist;
        this.showToast('Playlist shuffled', 1500);
    }

    showToast(message, duration) {
        let toast = document.querySelector('.voice-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'voice-toast';
            document.body.appendChild(toast);
        }

        if (toast.timeout) clearTimeout(toast.timeout);

        toast.textContent = message;
        toast.style.display = 'block';
        toast.style.opacity = '1';

        toast.timeout = setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.style.display = 'none', 300);
        }, duration);
    }
}

// Initialize voice commands when the page loads
window.addEventListener('load', () => {
    const voiceCommands = new VoiceCommands();
    voiceCommands.initialize();

    // Add voice control button to the navigation bar
    const voiceControlButton = document.createElement('button');
    voiceControlButton.className = 'voice-control-btn';
    voiceControlButton.innerHTML = '<i class="fas fa-microphone"></i>';
    voiceControlButton.title = 'Voice Commands';
    
    // Add click event to toggle voice commands
    voiceControlButton.addEventListener('click', () => {
        if (voiceCommands.isListening) {
            voiceCommands.stopListening();
            voiceControlButton.classList.remove('active');
        } else {
            voiceCommands.startListening();
            voiceControlButton.classList.add('active');
        }
    });

    // Add the button to the navigation bar next to the theme toggle
    const navIcons = document.querySelector('.nav-icons');
    navIcons.insertBefore(voiceControlButton, navIcons.firstChild);
}); 