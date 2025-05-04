// YouTube API Key - You'll need to replace this with your own API key
const API_KEY = 'AIzaSyBKZKNZCAfy0BZh_avJrFtix0sUfaaAHG8';
const TRENDING_ENDPOINT = 'https://www.googleapis.com/youtube/v3/videos';

// Function to fetch trending music videos
async function fetchTrendingSongs() {
    try {
        const response = await fetch(`${TRENDING_ENDPOINT}?part=snippet,statistics&chart=mostPopular&videoCategoryId=10&maxResults=3&key=${API_KEY}`);
        const data = await response.json();
        
        if (data.items) {
            displayTrendingSongs(data.items);
        }
    } catch (error) {
        console.error('Error fetching trending songs:', error);
    }
}

// Function to display trending songs in the UI
function displayTrendingSongs(songs) {
    const trendingList = document.querySelector('.trending-list');
    trendingList.innerHTML = ''; // Clear existing content

    songs.forEach(song => {
        const li = document.createElement('li');
        li.className = 'trending-item';
        
        li.innerHTML = `
            <img src="${song.snippet.thumbnails.high.url}" alt="${song.snippet.title}">
            <a href="https://www.youtube.com/watch?v=${song.id}" target="_blank">
                ${song.snippet.title}
            </a>
        `;
        
        trendingList.appendChild(li);
    });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchTrendingSongs); 