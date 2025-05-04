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
    { title: "WAR", artist: "Nirvair Pannu", src: "song/WAR.mp3", cover: "images/WAR-Punjabi-2023-20231211191050-500x500 (1).jpg", favorite: false },
    { title: "295", artist: "Sidhu Moose Wala", src: "song/AUDIO-2024-11-18-21-33-31 3.mp3", cover: "images/295.jpg", favorite: false },
    { title: "Afterhours", artist: "BIR", src: "song/Afterhours - Bir.mp3", cover: "images/hqdefault.jpg", favorite: false },
    { title: "Bexley Road", artist: "Baggh E SMG", src: "song/Bexley Road - Baggh E SMG.mp3", cover: "images/size_m.jpg", favorite: false },
    { title: "Judaa 3", artist: "Amrinder Gill", src: "song/Judaa 3 Title Track - Amrinder Gill.mp3", cover: "images/AG.jpg", favorite: false },
    { title: "Khush Reha Kar", artist: "Rajvir Jawanda", src: "song/Khush Reha Kar - Rajvir Jawanda.mp3", cover: "images/RJ.jpeg", favorite: false },
];
let favorites = [];
let currentSongIndex = 0;

// Queue functionality
let queue = [];

// Load Initial Song
function loadSong(index) {
    const song = playlist[index];
    document.getElementById('name').textContent = song.artist;
    document.querySelector('.title.run').textContent = song.title;
    document.getElementById('artist').src = song.cover;
    audio.src = song.src;
    
    // Update playing class for all songs
    const songItems = document.querySelectorAll('.sidebar-song-list li');
    songItems.forEach((item, i) => {
        if (i === index) {
            item.classList.add('playing');
        } else {
            item.classList.remove('playing');
        }
    });
}

// Toggle Sidebar Visibility
function toggleSidebar() {
    sidebar.classList.toggle('active');
}

// Play or Pause the Audio
function togglePlay() {
    if (audio.paused) {
        // Resume audio context if it was suspended
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        audio.play().catch(error => {
            console.error('Error playing audio:', error);
            // Initialize audio context if there's an error
            initializeAudioContext();
            audio.play();
        });
        updatePlayPauseIcons(false);
    } else {
        audio.pause();
        updatePlayPauseIcons(true);
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
    if (queue.length > 0) {
        const nextSong = queue.shift(); // Remove from queue
        const originalIndex = playlist.findIndex(s => s.title === nextSong.title && s.artist === nextSong.artist);
        if (originalIndex !== -1) {
            playSong(originalIndex);
        } else {
            // Fallback to next song in playlist if not found
            currentSongIndex = (currentSongIndex + 1) % playlist.length;
            loadSong(currentSongIndex);
            audio.play();
        }
        updateQueueDisplay();
    } else {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        audio.play();
    }
    updatePlayPauseIcons(false);
}

// Navigate to the Previous Song
function backward() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentSongIndex);
    audio.play();
    updatePlayPauseIcons(false); // Show pause icon
}

const lyricsData = {
    "295": [
        { time: 10, text: "🎵 Das putt tera head down kaston?" },
        { time: 12, text: "🎶 Changa bhala hasda si maun kaston?" },
        { time: 15, text: "🎵 Ah jehre darwaje vich board chakki kharhe aa" },
        { time: 18, text: "🎶 Mai changi tarah janda ea kaun kaston" },
        { time: 20, text: "🎵 Kuch ethe chandi chamkauna chahunde ne" },
        { time: 23, text: "🎶 Kuch tainu farh thalle launa chahunde ne" },
        { time: 26, text: "🎵 Kujh ke ne aye ethe bhukhe fame de" },
        { time: 28, text: "🎶 Naam laike tera agge auna chahunde ne" },
        { time: 31, text: "🎵 Museebat tan marda'an te pendi rehndi ae" },
        { time: 34, text: "🎶 Dabi'n naa tu duniya swaad lendi ae" },
        { time: 36, text: "🎵 Naale jehre raste te tu tureya" },
        { time: 38, text: "🎶 Ethe badnami high rate milugi" },
        { time: 41, text: "🎵 Nitt controversy create milugi" },
        { time: 44, text: "🎶 Dharma de naam te debate milugi" },
        { time: 47, text: "🎵 Sach bolenga ta milu 295" },
        { time: 49, text: "🎶 Jeh karenga tarakki putt hate milugi" },
        { time: 52, text: "🎵 Nitt controversy create milugi" },
        { time: 55, text: "🎶 Dharma de naam te debate milugi" },
        { time: 58, text: "🎵 Sach bolenga ta milu 295" },
        { time: 60, text: "🎶 Jeh karenga tarakki putt hate milugi" },
        { time: 64, text: "🎵 Ajj kayi bachaun sabheyachaar jutt ke" },
        { time: 67, text: "🎶 Janna khana dinda ae vichar uthke" },
        { time: 69, text: "🎵 Inj lagge rabb jiven hath kharhe kargeya" },
        { time: 72, text: "🎶 Parhan jaddo subah akhbar uthke" },
        { time: 75, text: "🎵 Chup reh oh puttra ni bhed kholide" },
        { time: 77, text: "🎶 Leader ne ethe haqdar goli de" },
        { time: 79, text: "🎵 Jihna de jawaaka de na John te Steve aa" },
        { time: 82, text: "🎶 Raakhe bane firde o maa boli de" },
        { time: 85, text: "🎵 Jhooth naiyo etho de fact eh vi ne" },
        { time: 88, text: "🎶 Chor bande urro de samaj sevi ne" },
        { time: 91, text: "🎵 Sach wala baana pa jo lok lutt de" },
        { time: 93, text: "🎶 Saja ehna nu vi chheti mate milugi" },
        { time: 96, text: "🎵 Nitt controversy create milugi" },
        { time: 99, text: "🎶 Dharma de naam te debate milugi" },
        { time: 102, text: "🎵 Sach bolenga ta milu 295" },
        { time: 104, text: "🎶 Jeh karenga tarakki putt hate milugi" },
        { time: 117, text: "🎶 Lok vatte marde aa bhare rukhan te" },
        { time: 120, text: "🎶 Minta'n vich ponch jande maa'van kukh'an te" },
        { time: 123, text: "🎶 Kaun kutta? Kaun dalla? Kanjar ae kaun?" },
        { time: 125, text: "🎶 Ethe certificate den facebook'an te" },
        { time: 128, text: "🎶 Leader varaun deke atta ehna nu" },
        { time: 131, text: "🎶 Vote'an laike marde chapata ehna nu" },
        { time: 134, text: "🎶 Pta ni zameer ohdo kithe hundi ae" },
        { time: 137, text: "🎶 Saale bolde ni sharam da ghaata ehna nu" },
        { time: 139, text: "🎶 Diggde nu den lok taadi rakhke" },
        { time: 141, text: "🎶 Kad de kyi gaalan ethe daarhi reh akhke" },
        { time: 144, text: "🎶 O teri ate ohdi maa ch farak ae ki?" },
        { time: 147, text: "🎶 Akal ehna nu thorhi late milugi" },
        { time: 149, text: "🎶 Nitt controversy create milugi" },
        { time: 152, text: "🎶 Dharma de naam te debate milugi" },
        { time: 155, text: "🎶 Sach bolenga ta milu 295" },
        { time: 157, text: "🎶 Jeh karenga tarakki putt hate milugi" },
        { time: 160, text: "🎵 Tu hun takk agge tere damm karke" },
        { time: 162, text: "🎶 Ethe photo ni khichonda koi chamm karke" },
        { time: 165, text: "🎵 Kaun kinna rabb ch yakeen rakhda" },
        { time: 168, text: "🎶 Lok karde ae judge ohde kam karke" },
        { time: 170, text: "🎵 Jhukeya zaroor hoya kauda ta nahi" },
        { time: 173, text: "🎶 Pagg tere sirr te tu roda ta nahi" },
        { time: 176, text: "🎵 Ikk gal puch ehna thekedara nu" },
        { time: 179, text: "🎶 Sada vi ae panth kalla thoda ta nahi" },
        { time: 182, text: "🎵 Oh Gandiya'n seyaasta nu dilo'n kad deyo" },
        { time: 185, text: "🎶 Kise nu ta guru ghar joga chad deyo" },
        { time: 188, text: "🎵 Kise bachhee sirr naiyo kes labhne" },
        { time: 190, text: "🎶 Nahi ta thonu chheti aesi date milugi" },
        { time: 192, text: "🎵 Nitt controversy create milugi" },
        { time: 195, text: "🎶 Dharma de naam te debate milugi" },
        { time: 198, text: "🎵 Sach bolenga ta milu 295" },
        { time: 200, text: "🎶 Jeh karenga tarakki putt hate milugi" },
        { time: 203, text: "🎵 Media kayi bann bethe ajj de gawaar" },
        { time: 206, text: "🎶 Ikko jhooth bolde aa oh vi vaar vaar" },
        { time: 209, text: "🎵 Bethke jananiya'n naal karde aa chugliyaan" },
        { time: 211, text: "🎶 Te show da naam rakhde aa chajj da vichaar" },
        { time: 214, text: "🎵 Shaam te saere bhalde vivad ne" },
        { time: 216, text: "🎶 Aevein tere nal karde fasaad ne" },
        { time: 218, text: "🎵 24 ghante nale nind de paronhe nu" },
        { time: 221, text: "🎶 Naale ode kalle kalle geet yaad ne" },
        { time: 224, text: "🎵 Bhavein aukhi hoyi ae crowd tere te" },
        { time: 227, text: "🎶 Bolde ne aevein saale loud tere te" },
        { time: 229, text: "🎵 Par ikk gal rakhi meri yaad puttra" },
        { time: 232, text: "🎶 Aah baapu tera barha aa proud tere te" },
        { time: 235, text: "🎵 Tu dabb geya duniya ne veham paa leya" },
        { time: 237, text: "🎶 Uth putt jhoteya oye Moose 'aaleya" },
        { time: 240, text: "🎶 Jeh aevein reha geet'an vich sach bolda" },
        { time: 243, text: "🎶 Aun wali peerhi educate milugi" },
        { time: 246, text: "🎵 Nitt controversy create milugi" },
        { time: 249, text: "🎶 Dharma de naam te debate milugi" },
        { time: 252, text: "🎵 Sach bolenga ta milu 295" },
        { time: 254, text: "🎶 Jeh karenga tarakki putt hate milugi" }
    ],
    "WAR": [
        { time: 9, text: "🎵 Ho pehredari teri karn stena 15 je" },
        { time: 13, text: "🎶 Asi vi billan vichon kad kad vairi maare" },
        { time: 18, text: "🎵 Eh kut kut vairi karde jaago de chajj warga" },
        { time: 23, text: "🎶 Jehra shang aake na firna khamb khilare" },
        { time: 28, text: "🎵 Moddeyon lakk vall nu galwakdi hundi rondan di" },
        { time: 33, text: "🎶 Vajjde saar charhade israel tigade" },
        { time: 37, text: "🎵 Ho takni takhat hilave aabo hawa badalni ae" },
        { time: 42, text: "🎶 Dehi dekh na samjhli jigre pakhon maarhe" },
        { time: 47, text: "🎵 Ho jad maut rikasa banke muhre nachdi ae" },
        { time: 52, text: "🎶 Bande aam ni hunde chad de jo jaikaare" },
        { time: 57, text: "🎵 Ho gun culture rehnda jithe poore joban te" },
        { time: 62, text: "🎶 Othe sochi da ni fullan di kaashat baare" },
        { time: 67, text: "🎵 Jehri keran tokke wange sade ulat challe" },
        { time: 71, text: "🎶 Rehndi koon jogi na jeeba oh dobare" },
        { time: 85, text: "🎵 Ho jad laa ke chaante chadde collaron vigreyan nu" },
        { time: 90, text: "🎶 Eda udd de jidan hathon ginn si gubare" },
        { time: 95, text: "🎵 Ho jungle beleyan de vich hon kade samjhote na" },
        { time: 100, text: "🎶 Vairi mitt na hunde hathon baajh karaare" },
        { time: 105, text: "🎵 Ena soolan ne das sanu ki thirkaona ae" },
        { time: 110, text: "🎶 Sade sabar ton poore vaakif rambiyan aare" },
        { time: 124, text: "🎵 Ho ginti vaahva ee aa jo vairi sade naal arhe" },
        { time: 129, text: "🎶 Karke nafrat hoge allah nu piyare" },
        { time: 134, text: "🎵 Bhathi waqtan di bande nu thos bnondi ae" },
        { time: 138, text: "🎶 Baney na tej dimagi khake giri shavare" },
        { time: 143, text: "🎵 Uthe talab talashi karda pagga lafzan di" },
        { time: 148, text: "🎶 Haole akhran naal na kitte varke bhaare" },
        { time: 153, text: "🎵 Kuj aisa karke ruksat hovange dunia ton" },
        { time: 158, text: "🎶 Gaatha vich syllabus parhon ge vidhyak adhaare" }
    ],
    "Afterhours": [
        { time: 10, text: "🎵 2 Cheejan pakkian jo geeje da shingaar ne" },
        { time: 12, text: "🎶 Ik paase sand dooje paase mag 4 ne" },
        { time: 15, text: "🎵 Hoodiyan de pehre thalle chehre naio disde" },
        { time: 18, text: "🎶 Lowkey bande billo khoofiya vichar ne" },
        { time: 21, text: "🎵 Wag kaatlan da, naal rehnda jo" },
        { time: 25, text: "🎶 Raatan kaaliyan te" },
        { time: 28, text: "🎵 Gaddi aa slow" },
        { time: 31, text: "🎶 Dabbi kaal tange" },
        { time: 34, text: "🎵 Karde ni show" },
        { time: 37, text: "🎶 Luikande kharde aa vajjdi trap te" },
        { time: 39, text: "🎵 Saade aala Hood beeba labhna nai map te" },
        { time: 41, text: "🎶 Sidhi call lagni nai number aa Tap te" },
        { time: 44, text: "🎵 J karna aa raabta te aaja tu Snap te" },
        { time: 47, text: "🎶 Dealer'an Plug'an naal saadi behni uthni" },
        { time: 50, text: "🎵 Asle di range edi sheti naio mukni" },
        { time: 53, text: "🎶 Chit parchawya layi khed de shikaar ne" },
        { time: 55, text: "🎵 Source nah puch beeba kaale karobar ne" },
        { time: 60, text: "🎶 Wang buleyan de, Cash da flow" },
        { time: 66, text: "🎵 Raatan kaaliyan te" },
        { time: 68, text: "🎶 Gaddi aa slow" },
        { time: 71, text: "🎵 Dabbi kaal tange" },
        { time: 73, text: "🎶 Karde ni show" },
        { time: 87, text: "🎵 Halkeyan Paeran naal hundi karwai aa" },
        { time: 89, text: "🎶 Pta naio lagda k Gang kitho aayi aa" },
        { time: 93, text: "🎵 Ferragamo akhan aali laalgi aa takkdi" },
        { time: 95, text: "🎶 Khaadi hundi dinne rehnde raat tak High aa" },
        { time: 100, text: "🎵 Vekh chehreya to Dulda glow" },
        { time: 105, text: "🎶 Raatan kaaliyan te" },
        { time: 108, text: "🎵 Gaddi aa slow" },
        { time: 111, text: "🎶 Dabbi kaal tange" },
        { time: 113, text: "🎵 Karde ni show" }
    ],
};

const lyricsDisplay = document.getElementById("lyrics-display");

function updateLyrics() {
    const currentTime = audio.currentTime;
    lyricsDisplay.innerHTML = ""; // Clear lyrics
    
    const currentSong = playlist[currentSongIndex].title;
    const currentSongLyrics = lyricsData[currentSong];
    
    if (!currentSongLyrics) {
        lyricsDisplay.innerHTML = "<p>No lyrics available for this song</p>";
        return;
    }
    
    // Find the current line index
    let currentLineIndex = -1;
    for (let i = 0; i < currentSongLyrics.length; i++) {
        if (currentTime >= currentSongLyrics[i].time) {
            currentLineIndex = i;
        } else {
            break;
        }
    }
    
    // Calculate the start index for the 8-line window
    let startIndex = Math.max(0, currentLineIndex - 3);
    let endIndex = Math.min(currentSongLyrics.length, startIndex + 8);
    
    // Adjust startIndex if we're near the end of the song
    if (endIndex - startIndex < 8) {
        startIndex = Math.max(0, endIndex - 8);
    }
    
    // Display the 8 lines
    for (let i = startIndex; i < endIndex; i++) {
        const line = currentSongLyrics[i];
        const lyricElement = document.createElement("p");
        lyricElement.textContent = line.text;
        lyricElement.classList.add("lyrics");
        
        // Add tracking classes
        if (i < currentLineIndex) {
            lyricElement.classList.add("played");
        } else if (i === currentLineIndex) {
            lyricElement.classList.add("active");
        }
        
        lyricsDisplay.appendChild(lyricElement);
    }
}

// Add event listener for time updates
audio.addEventListener("timeupdate", updateLyrics);

// Add event listener for seeking
audio.addEventListener("seeked", updateLyrics);

// Add event listener for song changes
audio.addEventListener("loadeddata", updateLyrics);

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
    // Update fill effect for volume slider
    volumeSlider.style.setProperty('--fill', `${volumeSlider.value * 100}%`);
});

// Initialize volume slider fill on page load
function initializeVolumeSlider() {
    volumeSlider.style.setProperty('--fill', `${volumeSlider.value * 100}%`);
}

// Format Time Display
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Theme Toggle (Light/Dark Mode)
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    
    // Update icon
    if (document.body.classList.contains('light-mode')) {
        themeToggle.classList.remove('fa-moon');
        themeToggle.classList.add('fa-sun');
    } else {
        themeToggle.classList.remove('fa-sun');
        themeToggle.classList.add('fa-moon');
    }
    
    // Store preference
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
});

// Show All Songs
function showAllSongs() {
    const songList = document.getElementById('songList');
    songList.innerHTML = "<h3 style='color: #4a90e2; margin: 10px 0;'>All Songs</h3>";
    
    playlist.forEach((song, index) => {
        const li = document.createElement('li');
        li.setAttribute('data-index', index);
        if (index === currentSongIndex) {
            li.classList.add('playing');
        }
        
        li.innerHTML = `
            <span>${song.title} - ${song.artist}</span>
            <div class="song-controls">
                <button class="song-play-btn" onclick="playSong(${index})"><i class="fas fa-play"></i></button>
                <button class="song-queue-btn" onclick="addToQueue(${index})"><i class="fas fa-plus"></i></button>
                <button onclick="toggleFavorite(${index})" class="song-star-btn ${song.favorite ? 'active' : ''}">
                    <i class="fas ${song.favorite ? 'fa-star' : 'fa-star-o'}"></i>
                </button>
            </div>
        `;
        songList.appendChild(li);
    });
    
    sidebar.classList.add('active');
}

// Equalizer functionality
let audioContext;
let source;
let gainNode;

function initializeAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        source = audioContext.createMediaElementSource(audio);
        gainNode = audioContext.createGain();
        
        // Connect the audio nodes
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
    }
}

// Initialize equalizer values
let equalizerValues = {
    bass: 0,
    mid: 0,
    treble: 0
};

// Update equalizer when sliders change
document.querySelectorAll('.equalizer-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
        const band = e.target.dataset.band;
        const value = parseFloat(e.target.value);
        equalizerValues[band] = value;
        
        // Update the displayed value
        document.getElementById(`${band}Value`).textContent = `${value}dB`;
        
        updateEqualizer();
    });
});

function updateEqualizer() {
    if (gainNode) {
        // Simple equalizer implementation
        const bassGain = Math.pow(10, equalizerValues.bass / 20);
        const midGain = Math.pow(10, equalizerValues.mid / 20);
        const trebleGain = Math.pow(10, equalizerValues.treble / 20);
        
        // Apply the gains
        gainNode.gain.value = (bassGain + midGain + trebleGain) / 3;
    }
}

// Modify the playSong function
function playSong(index) {
    // Don't apply crossfade if first song or audio not playing
    if (crossfadeDuration > 0 && audio && !audio.paused) {
        // Start crossfade
        const originalVolume = audio.volume;
        const fadeSteps = 20;
        const fadeInterval = (crossfadeDuration * 1000) / fadeSteps;
        const volumeStep = originalVolume / fadeSteps;
        
        let currentStep = 0;
        const fadeOutInterval = setInterval(() => {
            currentStep++;
            if (currentStep < fadeSteps) {
                audio.volume = originalVolume - (volumeStep * currentStep);
            } else {
                clearInterval(fadeOutInterval);
                loadAndPlayNewSong(index);
            }
        }, fadeInterval);
    } else {
        loadAndPlayNewSong(index);
    }
}

// Add smooth transitions when switching songs
function loadAndPlayNewSong(index) {
    currentSongIndex = index;
    const song = playlist[currentSongIndex];
    
    // Fade out album art
    const albumArt = document.getElementById('artist');
    const songTitle = document.querySelector('.title.run');
    const artistName = document.getElementById('name');
    
    // Add transition classes
    albumArt.classList.add('fade-transition');
    songTitle.classList.add('fade-transition');
    artistName.classList.add('fade-transition');
    
    // After a short delay, update content and fade back in
    setTimeout(() => {
        audio.src = song.src;
        audio.volume = volumeSlider.value;
        albumArt.src = song.cover;
        songTitle.textContent = song.title;
        artistName.textContent = song.artist;
        
        // Start playing after content update
        audio.play().then(() => {
            updatePlayPauseButton();
            
            // Remove transition classes after animation completes
            setTimeout(() => {
                albumArt.classList.remove('fade-transition');
                songTitle.classList.remove('fade-transition');
                artistName.classList.remove('fade-transition');
            }, 500);
        }).catch(error => {
            console.error("Error playing audio:", error);
        });
    }, 300);
    
    // Update song info in UI
    updateSongInfo();
    
    // Update active song in sidebar
    updateActiveSongInSidebar();
}

// Add missing updateSongInfo function
function updateSongInfo() {
    document.title = `${playlist[currentSongIndex].title} - ${playlist[currentSongIndex].artist}`;
    
    // Reset progress bar
    progressBar.value = 0;
    document.getElementById('start').textContent = '0:00';
}

// Update active song in sidebar
function updateActiveSongInSidebar() {
    const songItems = document.querySelectorAll('.sidebar-song-list li');
    songItems.forEach((item, i) => {
        const songIndex = item.getAttribute('data-index');
        if (songIndex == currentSongIndex) {
            item.classList.add('playing');
        } else {
            item.classList.remove('playing');
        }
    });
}

// Show Playlist
function showPlaylist() {
    const songList = document.getElementById('songList');
    songList.innerHTML = "<h3 style='color: #4a90e2; margin: 10px 0;'>Playlist</h3>";
    
    if (favorites.length === 0) {
        songList.innerHTML += "<p style='color: #f4f4f4; padding: 10px;'>Your playlist is empty!</p>";
        return;
    }
    
    favorites.forEach((song, index) => {
        const originalIndex = playlist.findIndex(s => s.title === song.title && s.artist === song.artist);
        const li = document.createElement('li');
        // Add index as custom property for staggered animation
        li.style.setProperty('--index', index);
        
        li.innerHTML = `
            <span>${song.title} - ${song.artist}</span>
            <div class="song-controls">
                <button class="song-play-btn" onclick="playSong(${originalIndex})"><i class="fas fa-play"></i></button>
                <button class="song-star-btn active" onclick="toggleFavorite(${originalIndex})">
                    <i class="fas fa-star"></i>
                </button>
                <button class="song-download-btn" onclick="downloadSong(${originalIndex})"><i class="fas fa-download"></i></button>
            </div>
        `;
        songList.appendChild(li);
    });
    
    sidebar.classList.add('active');
}

// Update the toggleFavorite function to reflect playlist
function toggleFavorite(index) {
    playlist[index].favorite = !playlist[index].favorite;
    
    if (playlist[index].favorite) {
        if (!favorites.includes(playlist[index])) {
            favorites.push(playlist[index]);
        }
        showToast(`Added "${playlist[index].title}" to playlist`);
    } else {
        favorites = favorites.filter(song => song !== playlist[index]);
        showToast(`Removed "${playlist[index].title}" from playlist`);
    }
    
    // Update the display based on current view
    if (document.getElementById('songList').firstChild && 
        document.getElementById('songList').firstChild.textContent === 'Playlist') {
        showPlaylist();
    } else {
        showAllSongs();
    }
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
    initializeVolumeSlider();
    
    // Initialize settings
    initializeSettings();
    
    // Apply saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.classList.remove('fa-moon');
        themeToggle.classList.add('fa-sun');
    }
    
    // Add CSS for smooth transitions
    const style = document.createElement('style');
    style.textContent = `
        .fade-transition {
            opacity: 0.5;
            transition: opacity 0.3s ease;
        }
        .sidebar-song-list li.playing {
            background: rgba(74, 144, 226, 0.2);
            border-left: 3px solid #4a90e2;
        }
        #progressBar, #volumeSlider {
            --fill: 0%;
            background: linear-gradient(to right, #4a90e2 0%, #2a5298 var(--fill), #555 var(--fill));
        }
        .settings-panel {
            transform: translateY(20px);
            opacity: 0;
            pointer-events: none;
            transition: transform 0.3s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.3s ease;
            display: block;
        }
        .settings-panel.active {
            transform: translateY(0);
            opacity: 1;
            pointer-events: all;
        }
        .menu-dropdown {
            transform: translateY(10px);
            opacity: 0;
            pointer-events: none;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .menu-dropdown.active {
            transform: translateY(0);
            opacity: 1;
            pointer-events: all;
        }
    `;
    document.head.appendChild(style);
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

// Search functionality
const searchInput = document.querySelector('.nav-search input');
const searchIcon = document.querySelector('.nav-search i');

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const songList = document.getElementById('songList');
    songList.innerHTML = "<h3 style='color: #FFD700; margin: 10px 0;'>Search Results</h3>";
    
    const filteredSongs = playlist.filter(song => 
        song.title.toLowerCase().includes(searchTerm) || 
        song.artist.toLowerCase().includes(searchTerm)
    );
    
    if (filteredSongs.length === 0) {
        songList.innerHTML += "<p style='color: #f4f4f4; padding: 10px;'>No songs found matching your search.</p>";
        return;
    }
    
    filteredSongs.forEach(song => {
        const originalIndex = playlist.findIndex(s => s === song);
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${song.title} - ${song.artist}</span>
            <div class="song-controls">
                <button onclick="playSong(${originalIndex})"><i class="fas fa-play"></i></button>
                <button onclick="toggleFavorite(${originalIndex})" class="favorite-btn">
                    ${song.favorite ? '★' : '☆'}
                </button>
            </div>
        `;
        songList.appendChild(li);
    });
    
    // Keep sidebar open when showing search results
    sidebar.classList.add('active');
}

// Add event listeners for search
searchInput.addEventListener('input', performSearch);
searchIcon.addEventListener('click', performSearch);

// Download Current Song Function
function downloadCurrentSong() {
    const currentSong = playlist[currentSongIndex];
    if (!currentSong || !currentSong.src) {
        showToast('No song available to download', 2000);
        return;
    }

    showToast(`Downloading "${currentSong.title}"...`);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = currentSong.src;
    
    // Set the download attribute with the song name
    const fileName = `${currentSong.title} - ${currentSong.artist}.mp3`;
    link.download = fileName;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show completion toast after a delay
    setTimeout(() => {
        showToast(`Downloaded "${currentSong.title}" successfully`, 2000);
    }, 1500);
}

// Download specific song
function downloadSong(index) {
    const song = playlist[index];
    if (!song || !song.src) {
        alert('Song not available for download');
        return;
    }

    const link = document.createElement('a');
    link.href = song.src;
    const fileName = `${song.title} - ${song.artist}.mp3`;
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Add to queue function
function addToQueue(songIndex) {
    const song = playlist[songIndex];
    if (!queue.includes(song)) {
        queue.push(song);
        updateQueueDisplay();
        showToast(`Added "${song.title}" to queue`);
    } else {
        showToast(`"${song.title}" is already in queue`);
    }
}

// Remove from queue function
function removeFromQueue(index) {
    const song = queue[index];
    queue.splice(index, 1);
    updateQueueDisplay();
    showToast(`Removed "${song.title}" from queue`);
}

// Show queue function
function showQueue() {
    const songList = document.getElementById('songList');
    songList.innerHTML = "<h3 style='color: #4a90e2; margin: 10px 0;'>Queue</h3>";
    
    if (queue.length === 0) {
        songList.innerHTML += "<p style='color: #f4f4f4; padding: 10px;'>Your queue is empty!</p>";
        return;
    }
    
    queue.forEach((song, index) => {
        const li = document.createElement('li');
        // Add index as custom property for staggered animation
        li.style.setProperty('--index', index);
        
        li.innerHTML = `
            <span>${song.title} - ${song.artist}</span>
            <div class="song-controls">
                <button class="song-play-btn" onclick="playFromQueue(${index})"><i class="fas fa-play"></i></button>
                <button class="song-remove-btn" onclick="removeFromQueue(${index})"><i class="fas fa-times"></i></button>
            </div>
        `;
        songList.appendChild(li);
    });
    
    sidebar.classList.add('active');
}

// Play from queue function
function playFromQueue(index) {
    const song = queue[index];
    const originalIndex = playlist.findIndex(s => s === song);
    currentSongIndex = originalIndex;
    loadSong(currentSongIndex);
    audio.play();
    updatePlayPauseIcons(false);
}

// Update queue display
function updateQueueDisplay() {
    if (document.getElementById('songList').firstChild && 
        document.getElementById('songList').firstChild.textContent === 'Queue') {
        showQueue();
    }
}

// Menu and Equalizer functionality
function toggleMenu() {
    const menu = document.querySelector('.menu-dropdown');
    const settingsPanels = document.querySelectorAll('.settings-panel');
    
    // Close all settings panels when toggling menu
    settingsPanels.forEach(panel => {
        panel.classList.remove('active');
    });
    
    menu.classList.toggle('active');
}

function toggleEqualizer() {
    const equalizer = document.querySelector('.equalizer-container');
    const menu = document.querySelector('.menu-dropdown');
    equalizer.classList.toggle('active');
    menu.classList.remove('active');
}

// Close menu and equalizer when clicking outside
document.addEventListener('click', (e) => {
    const menu = document.querySelector('.menu-dropdown');
    const equalizer = document.querySelector('.equalizer-container');
    const menuBtn = document.querySelector('.menu-btn');
    
    if (!menuBtn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('active');
    }
    
    if (!equalizer.contains(e.target) && !menu.contains(e.target)) {
        equalizer.classList.remove('active');
    }
});

// Add event listener for audio element
audio.addEventListener('play', () => {
    initializeAudioContext();
});

// Settings Panel Functions
function togglePlaybackSpeed() {
    const panel = document.getElementById('playbackSpeedPanel');
    const otherPanels = document.querySelectorAll('.settings-panel:not(#playbackSpeedPanel)');
    otherPanels.forEach(p => p.classList.remove('active'));
    panel.classList.toggle('active');
    
    // Close menu dropdown when opening settings
    const menu = document.querySelector('.menu-dropdown');
    menu.classList.remove('active');
}

function toggleSleepTimer() {
    const panel = document.getElementById('sleepTimerPanel');
    const otherPanels = document.querySelectorAll('.settings-panel:not(#sleepTimerPanel)');
    otherPanels.forEach(p => p.classList.remove('active'));
    panel.classList.toggle('active');
    
    // Close menu dropdown when opening settings
    const menu = document.querySelector('.menu-dropdown');
    menu.classList.remove('active');
}

function toggleCrossfade() {
    const panel = document.getElementById('crossfadePanel');
    const otherPanels = document.querySelectorAll('.settings-panel:not(#crossfadePanel)');
    otherPanels.forEach(p => p.classList.remove('active'));
    panel.classList.toggle('active');
    
    // Close menu dropdown when opening settings
    const menu = document.querySelector('.menu-dropdown');
    menu.classList.remove('active');
}

function toggleVisualizerSettings() {
    const panel = document.getElementById('visualizerSettingsPanel');
    const otherPanels = document.querySelectorAll('.settings-panel:not(#visualizerSettingsPanel)');
    otherPanels.forEach(p => p.classList.remove('active'));
    panel.classList.toggle('active');
    
    // Close menu dropdown when opening settings
    const menu = document.querySelector('.menu-dropdown');
    menu.classList.remove('active');
}

// Playback Speed Control
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');

speedSlider.addEventListener('input', () => {
    const speed = parseFloat(speedSlider.value);
    speedValue.textContent = `${speed.toFixed(1)}x`;
    if (audio) {
        audio.playbackRate = speed;
        showToast(`Playback speed set to ${speed.toFixed(1)}x`, 1500);
    }
});

// Sleep Timer
let sleepTimer = null;

function startSleepTimer() {
    const minutes = parseInt(document.getElementById('timerSelect').value);
    const timerStatus = document.getElementById('timerStatus');
    
    if (sleepTimer) {
        clearTimeout(sleepTimer);
    }
    
    if (minutes > 0) {
        timerStatus.textContent = `Timer: ${minutes} minutes`;
        showToast(`Sleep timer set for ${minutes} minutes`, 2000);
        
        sleepTimer = setTimeout(() => {
            if (audio) {
                audio.pause();
                updatePlayPauseButton();
                timerStatus.textContent = 'Timer: Off';
                showToast('Sleep timer ended - playback paused', 3000);
            }
        }, minutes * 60 * 1000);
    } else {
        timerStatus.textContent = 'Timer: Off';
        showToast('Sleep timer disabled', 2000);
    }
}

// Crossfade
let crossfadeDuration = 0;
const crossfadeSlider = document.getElementById('crossfadeSlider');
const crossfadeValue = document.getElementById('crossfadeValue');

crossfadeSlider.addEventListener('input', () => {
    crossfadeDuration = parseInt(crossfadeSlider.value);
    crossfadeValue.textContent = `${crossfadeDuration}s`;
    showToast(`Crossfade duration set to ${crossfadeDuration} seconds`, 1500);
});

// Visualizer Settings
const visualizerColor = document.getElementById('visualizerColor');
const visualizerType = document.getElementById('visualizerMode');
const visualizerIntensity = document.getElementById('visualizerIntensity');

visualizerColor.addEventListener('input', () => {
    const color = visualizerColor.value;
    document.documentElement.style.setProperty('--visualizer-color', color);
});

visualizerColor.addEventListener('change', () => {
    showToast('Visualizer color updated', 1500);
});

visualizerType.addEventListener('change', () => {
    const type = visualizerType.value;
    showToast(`Visualizer mode changed to ${type}`, 1500);
    // Update visualizer mode in visualizer.js
    if (window.updateVisualizerMode) {
        window.updateVisualizerMode(type);
    }
});

visualizerIntensity.addEventListener('input', () => {
    const intensity = visualizerIntensity.value;
    showToast(`Visualizer intensity set to ${intensity}`, 1500);
    // Update visualizer intensity in visualizer.js
    if (window.updateVisualizerIntensity) {
        window.updateVisualizerIntensity(intensity);
    }
});

// Close settings panels when clicking outside
document.addEventListener('click', (e) => {
    const settingsPanels = document.querySelectorAll('.settings-panel');
    const menuBtn = document.querySelector('.menu-btn');
    const menu = document.querySelector('.menu-dropdown');
    
    // Close settings panels
    if (!e.target.closest('.settings-panel') && !e.target.closest('.menu-btn')) {
        settingsPanels.forEach(panel => {
            panel.classList.remove('active');
        });
    }
    
    // Close menu dropdown
    if (!e.target.closest('.menu-dropdown') && !e.target.closest('.menu-btn')) {
        menu.classList.remove('active');
    }
});

// Fix updatePlayPauseButton function name inconsistency
function updatePlayPauseButton() {
    updatePlayPauseIcons(audio.paused);
}

// Add keyboard shortcuts for common actions
document.addEventListener('keydown', (e) => {
    // Prevent shortcuts when typing in input fields
    if (e.target.tagName.toLowerCase() === 'input') return;
    
    switch(e.code) {
        case 'Space': // Play/Pause
            e.preventDefault();
            togglePlay();
            break;
        case 'ArrowRight': // Next song
            if (e.ctrlKey || e.metaKey) forward();
            break;
        case 'ArrowLeft': // Previous song
            if (e.ctrlKey || e.metaKey) backward();
            break;
        case 'ArrowUp': // Volume up
            e.preventDefault();
            volumeSlider.value = Math.min(1, parseFloat(volumeSlider.value) + 0.05);
            audio.volume = volumeSlider.value;
            volumeSlider.style.setProperty('--fill', `${volumeSlider.value * 100}%`);
            break;
        case 'ArrowDown': // Volume down
            e.preventDefault();
            volumeSlider.value = Math.max(0, parseFloat(volumeSlider.value) - 0.05);
            audio.volume = volumeSlider.value;
            volumeSlider.style.setProperty('--fill', `${volumeSlider.value * 100}%`);
            break;
    }
});

// Toast notification function
function showToast(message, duration = 3000) {
    // Create toast container if it doesn't exist
    let toast = document.querySelector('.toast-notification');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }
    
    // Set message and show toast
    toast.textContent = message;
    toast.classList.add('show');
    
    // Hide toast after duration
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Add swipe gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

// Track touch positions
document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
});

function handleSwipeGesture() {
    // Detect left or right swipe (min 70px movement)
    if (touchEndX < touchStartX - 70) {
        // Swipe left - next song
        forward();
    } else if (touchEndX > touchStartX + 70) {
        // Swipe right - previous song
        backward();
    }
}

// Add event listeners for specific settings panels
document.getElementById('timerSelect').addEventListener('change', startSleepTimer);

// Ensure sleep timer activates when selected
function toggleSleepTimer() {
    const panel = document.getElementById('sleepTimerPanel');
    const otherPanels = document.querySelectorAll('.settings-panel:not(#sleepTimerPanel)');
    otherPanels.forEach(p => p.classList.remove('active'));
    panel.classList.toggle('active');
    
    // Close menu dropdown when opening settings
    const menu = document.querySelector('.menu-dropdown');
    menu.classList.remove('active');
}

// Fix repeat mode toggling
function toggleRepeatMode() {
    const isLooping = audio.loop;
    audio.loop = !isLooping;
    
    if (audio.loop) {
        showToast('Repeat mode: ON', 1500);
    } else {
        showToast('Repeat mode: OFF', 1500);
    }
    
    // Close menu dropdown
    const menu = document.querySelector('.menu-dropdown');
    menu.classList.remove('active');
}

// Toggle lyrics display
function toggleLyrics() {
    const lyricsContainer = document.querySelector('.lyrics-container');
    lyricsContainer.style.display = lyricsContainer.style.display === 'none' ? 'block' : 'none';
    
    showToast(lyricsContainer.style.display === 'none' ? 'Lyrics hidden' : 'Lyrics shown', 1500);
    
    // Close menu dropdown
    const menu = document.querySelector('.menu-dropdown');
    menu.classList.remove('active');
}

// Initialize all settings features
function initializeSettings() {
    // Set initial volume slider fill
    volumeSlider.style.setProperty('--fill', `${volumeSlider.value * 100}%`);
    
    // Set initial playback rate
    if (audio && speedSlider) {
        audio.playbackRate = parseFloat(speedSlider.value);
        speedValue.textContent = `${parseFloat(speedSlider.value).toFixed(1)}x`;
    }
    
    // Set initial crossfade value
    if (crossfadeSlider && crossfadeValue) {
        crossfadeDuration = parseInt(crossfadeSlider.value);
        crossfadeValue.textContent = `${crossfadeDuration}s`;
    }
    
    // Set initial timer status
    const timerStatus = document.getElementById('timerStatus');
    if (timerStatus) {
        timerStatus.textContent = 'Timer: Off';
    }
    
    // Set initial lyrics container display 
    const lyricsContainer = document.querySelector('.lyrics-container');
    if (lyricsContainer) {
        lyricsContainer.style.display = 'block'; // visible by default
    }
    
    // Initialize visualizer if available
    const visualizerContainer = document.querySelector('.visualizer-container');
    if (visualizerContainer) {
        visualizerContainer.style.display = 'none'; // Hidden by default
    }
}

// Toggle visualizer
function toggleVisualizerSettings() {
    const panel = document.getElementById('visualizerSettingsPanel');
    const otherPanels = document.querySelectorAll('.settings-panel:not(#visualizerSettingsPanel)');
    otherPanels.forEach(p => p.classList.remove('active'));
    panel.classList.toggle('active');
    
    // Close menu dropdown when opening settings
    const menu = document.querySelector('.menu-dropdown');
    menu.classList.remove('active');
}

// Toggle visualizer display
document.getElementById('visualizerToggle').addEventListener('click', function() {
    const visualizerContainer = document.querySelector('.visualizer-container');
    visualizerContainer.style.display = visualizerContainer.style.display === 'none' ? 'block' : 'none';
    
    showToast(visualizerContainer.style.display === 'none' ? 'Visualizer hidden' : 'Visualizer shown', 1500);
});

// Handle mode buttons in visualizer
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const mode = this.getAttribute('data-mode');
        // Update visualizer mode in visualizer.js
        if (window.updateVisualizerMode) {
            window.updateVisualizerMode(mode);
        }
        
        // Also update the select in settings
        document.getElementById('visualizerMode').value = mode;
        
        showToast(`Visualizer mode: ${mode}`, 1500);
    });
});

// Activity Panel Functions
let activityPanel = document.querySelector('.activity-panel');
let totalListeningTime = 0;
let songsPlayed = 0;
let topSongs = [];
let recentActivity = [];
let genres = {};
let currentSongStartTime = null;
let updateInterval = null;
let isPlaying = false;

// Save activity data to localStorage
function saveActivityData() {
    const activityData = {
        totalListeningTime,
        songsPlayed,
        topSongs,
        recentActivity,
        genres,
        lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('musicPlayerActivity', JSON.stringify(activityData));
}

// Load activity data from localStorage
function loadActivityData() {
    const savedData = localStorage.getItem('musicPlayerActivity');
    if (savedData) {
        try {
            const activityData = JSON.parse(savedData);
            totalListeningTime = activityData.totalListeningTime || 0;
            songsPlayed = activityData.songsPlayed || 0;
            topSongs = activityData.topSongs || [];
            recentActivity = activityData.recentActivity || [];
            genres = activityData.genres || {};
            
            // Update UI with loaded data
            updateActivityStats();
        } catch (error) {
            console.error('Error loading activity data:', error);
        }
    }
}

// Auto-save every 5 minutes
setInterval(saveActivityData, 5 * 60 * 1000);

// Save when window is closed
window.addEventListener('beforeunload', saveActivityData);

function toggleActivityPanel() {
    activityPanel.classList.toggle('active');
    if (activityPanel.classList.contains('active')) {
        updateActivityStats();
        startRealTimeUpdates();
    } else {
        stopRealTimeUpdates();
        saveActivityData(); // Save when closing panel
    }
}

function startRealTimeUpdates() {
    if (!updateInterval) {
        updateInterval = setInterval(() => {
            if (isPlaying && currentSongStartTime) {
                const currentTime = Date.now();
                const elapsedSeconds = (currentTime - currentSongStartTime) / 1000;
                totalListeningTime += elapsedSeconds;
                currentSongStartTime = currentTime;
                updateActivityStats();
                saveActivityData(); // Save periodically during playback
            }
        }, 1000);
    }
}

function stopRealTimeUpdates() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
}

function updateActivityStats() {
    // Update total listening time
    const hours = Math.floor(totalListeningTime / 3600);
    const minutes = Math.floor((totalListeningTime % 3600) / 60);
    const seconds = Math.floor(totalListeningTime % 60);
    document.getElementById('totalTime').textContent = `${hours}h ${minutes}m ${seconds}s`;

    // Update total songs played
    document.getElementById('totalSongs').textContent = `${songsPlayed} songs`;

    // Update top genre
    const topGenre = Object.entries(genres).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('topGenre').textContent = topGenre ? topGenre[0] : '-';

    // Update top songs list
    const topSongsList = document.getElementById('topSongsList');
    if (topSongsList) {
        topSongsList.innerHTML = '';
        topSongs.forEach(song => {
            const songItem = document.createElement('div');
            songItem.className = 'song-item';
            songItem.innerHTML = `
                <img src="${song.cover}" alt="${song.title}">
                <div class="song-info">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                    <p class="play-count">${song.plays} plays</p>
                    <p class="last-played">Last played: ${song.lastPlayed || 'Never'}</p>
                </div>
            `;
            topSongsList.appendChild(songItem);
        });
    }

    // Update activity timeline
    const activityTimeline = document.getElementById('activityTimeline');
    if (activityTimeline) {
        activityTimeline.innerHTML = '';
        recentActivity.forEach(activity => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.innerHTML = `
                <i class="fas fa-${activity.icon}"></i>
                <div class="timeline-content">
                    <p>${activity.text}</p>
                    <span class="timeline-time">${activity.time}</span>
                </div>
            `;
            activityTimeline.appendChild(timelineItem);
        });
    }
}

// Track song play
function trackSongPlay(song) {
    if (!song) return;
    
    songsPlayed++;
    currentSongStartTime = Date.now();
    isPlaying = true;

    // Add to recent activity
    const now = new Date();
    recentActivity.unshift({
        icon: 'play',
        text: `Playing "${song.title}" by ${song.artist}`,
        time: now.toLocaleTimeString(),
        date: now.toISOString()
    });

    // Keep only last 10 activities
    if (recentActivity.length > 10) {
        recentActivity.pop();
    }

    // Update top songs
    const existingSong = topSongs.find(s => s.title === song.title);
    if (existingSong) {
        existingSong.plays = (existingSong.plays || 0) + 1;
        existingSong.lastPlayed = now.toLocaleTimeString();
        existingSong.lastPlayedDate = now.toISOString();
    } else {
        topSongs.push({
            ...song,
            plays: 1,
            lastPlayed: now.toLocaleTimeString(),
            lastPlayedDate: now.toISOString()
        });
    }

    // Sort top songs by plays
    topSongs.sort((a, b) => (b.plays || 0) - (a.plays || 0));
    if (topSongs.length > 5) {
        topSongs = topSongs.slice(0, 5);
    }

    // Update genre statistics
    const genre = song.genre || 'Unknown';
    genres[genre] = (genres[genre] || 0) + 1;

    // Update stats if panel is open
    if (activityPanel && activityPanel.classList.contains('active')) {
        updateActivityStats();
    }

    // Save after tracking new activity
    saveActivityData();
}

// Add event listeners for audio
audio.addEventListener('play', () => {
    isPlaying = true;
    currentSongStartTime = Date.now();
    const currentSong = {
        title: document.querySelector('.art-name .title').textContent,
        artist: document.getElementById('name').textContent,
        cover: document.getElementById('artist').src,
        duration: audio.duration,
        genre: getSongGenre(document.querySelector('.art-name .title').textContent)
    };
    trackSongPlay(currentSong);
});

audio.addEventListener('pause', () => {
    isPlaying = false;
    if (currentSongStartTime) {
        const currentTime = Date.now();
        const elapsedSeconds = (currentTime - currentSongStartTime) / 1000;
        totalListeningTime += elapsedSeconds;
        currentSongStartTime = null;
    }
});

audio.addEventListener('ended', () => {
    isPlaying = false;
    if (currentSongStartTime) {
        const currentTime = Date.now();
        const elapsedSeconds = (currentTime - currentSongStartTime) / 1000;
        totalListeningTime += elapsedSeconds;
        currentSongStartTime = null;
    }
});

// Helper function to determine song genre
function getSongGenre(title) {
    if (!title) return 'Unknown';
    
    const genreKeywords = {
        'Punjabi': ['Punjabi', 'Bhangra', 'Desi'],
        'Pop': ['Pop', 'Dance'],
        'Rock': ['Rock', 'Alternative'],
        'Hip Hop': ['Hip Hop', 'Rap'],
        'Classical': ['Classical', 'Instrumental']
    };

    for (const [genre, keywords] of Object.entries(genreKeywords)) {
        if (keywords.some(keyword => title.toLowerCase().includes(keyword.toLowerCase()))) {
            return genre;
        }
    }
    return 'Other';
}

// Close activity panel when clicking outside
document.addEventListener('click', (e) => {
    if (activityPanel && activityPanel.classList.contains('active') && 
        !e.target.closest('.activity-panel') && 
        !e.target.closest('.activity-btn')) {
        toggleActivityPanel();
    }
});

// Close activity panel with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activityPanel && activityPanel.classList.contains('active')) {
        toggleActivityPanel();
    }
});

// Initialize activity panel and load saved data
document.addEventListener('DOMContentLoaded', () => {
    activityPanel = document.querySelector('.activity-panel');
    if (activityPanel) {
        loadActivityData();
        updateActivityStats();
    }
});
