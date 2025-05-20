// Global variables
let currentSongIndex = 0;
const audioPlayer = document.getElementById("audio-player");
const songs = [
  {
    id: 1,
    name: "Sugar",
    artist: "Maroon 5",
    img: "../assets/sugar.jpg",
    genre: "pop",
    source: "../assets/sugar.mp3"
  },
  {
    id: 2,
    name: "Locked Away",
    artist: "R-City",
    img: "../assets/locked.jpg",
    genre: "rock",
    source: "../assets/locked.mp3"
  },
  // ... add more songs as needed
];
const playlists = {};

// Render all songs (with optional genre filter and search)
function showSongs(genre = "all", searchText = "") {
  const songsList = document.getElementById("songs-list");
  songsList.innerHTML = "";
  let filteredSongs = genre === "all" ? songs : songs.filter(song => song.genre === genre);
  if (searchText) {
    filteredSongs = filteredSongs.filter(song =>
      song.name.toLowerCase().includes(searchText.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  filteredSongs.forEach(song => {
    const songDiv = document.createElement("div");
    songDiv.textContent = `${song.name} - ${song.artist}`;
    songDiv.style.cursor = "pointer";
    songDiv.addEventListener("click", () => {
      currentSongIndex = songs.findIndex(s => s.id === song.id);
      renderCurrentSong(songs[currentSongIndex]);
    });
    songsList.appendChild(songDiv);
  });
}

// Render current playing song in the song card section and play it
function renderCurrentSong(song) {
  document.getElementById("song-image").src = song.img;
  document.getElementById("song-name").textContent = song.name;
  document.getElementById("artist-name").textContent = song.artist;
  const audioPlayer = document.getElementById("audio-player");
  audioPlayer.src = song.source;
  audioPlayer.play();
}

// Toggle theme between light and dark
function toggleTheme() {
  document.body.classList.toggle("dark-theme");
}

// Handler for adding current song to a playlist
function addToPlaylist() {
  let playlistName = prompt("Enter the playlist name to add this song:");
  if (playlistName) {
    if (!playlists[playlistName]) {
      alert("Playlist does not exist. Please create it first!");
      return;
    }
    playlists[playlistName].push(songs[currentSongIndex]);
    renderPlaylistSongs(playlistName);
  }
}

// Create a new playlist
function createPlaylist() {
  const playlistName = document.getElementById("new-playlist-name").value.trim();
  if (!playlistName) {
    alert("Please enter a valid playlist name.");
    return;
  }
  if (playlists[playlistName]) {
    alert("Playlist already exists!");
    return;
  }
  playlists[playlistName] = [];
  renderPlaylistList();
  document.getElementById("new-playlist-name").value = "";
}

// Render list of playlists filtered by search input
function renderPlaylistList() {
  const playlistList = document.getElementById("playlist-list");
  const searchText = document.getElementById("playlist-search").value;
  playlistList.innerHTML = "";
  Object.keys(playlists)
    .filter(name => name.toLowerCase().includes(searchText.toLowerCase()))
    .forEach(name => {
      const btn = document.createElement("button");
      btn.textContent = name;
      btn.addEventListener("click", () => renderPlaylistSongs(name));
      playlistList.appendChild(btn);
    });
}

// Render songs in a particular playlist including remove button
function renderPlaylistSongs(playlistName) {
  const playlistSongsDiv = document.getElementById("playlist-songs");
  playlistSongsDiv.innerHTML = `<h3>${playlistName} Songs</h3>`;
  const playlistSongs = playlists[playlistName];
  if (playlistSongs.length === 0) {
    playlistSongsDiv.innerHTML += "<p>No songs in this playlist.</p>";
  } else {
    playlistSongs.forEach((song, index) => {
      const songDiv = document.createElement("div");
      songDiv.textContent = `${song.name} - ${song.artist}`;
      // Remove button
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.style.marginLeft = "10px";
      removeBtn.addEventListener("click", () => {
        playlists[playlistName].splice(index, 1);
        renderPlaylistSongs(playlistName);
      });
      songDiv.appendChild(removeBtn);
      playlistSongsDiv.appendChild(songDiv);
    });
  }
}

// Search event for songs and update song list
document.getElementById("song-search").addEventListener("input", e => {
  const searchText = e.target.value;
  const genre = document.getElementById("genre-filter").value;
  showSongs(genre, searchText);
});

// Genre filter event
document.getElementById("genre-filter").addEventListener("change", e => {
  const genre = e.target.value;
  const searchText = document.getElementById("song-search").value;
  showSongs(genre, searchText);
});

// Search event for playlists
document.getElementById("playlist-search").addEventListener("input", renderPlaylistList);

// Event listeners for control buttons
document.getElementById("toggle-theme").addEventListener("click", toggleTheme);
document.getElementById("add-to-playlist-btn").addEventListener("click", addToPlaylist);
document.getElementById("create-playlist-btn").addEventListener("click", createPlaylist);

// Toggle play/pause
document.getElementById("play-btn").addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
});

// Stop the audio (pause and reset to start)
document.getElementById("stop-btn").addEventListener("click", () => {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
});

// Next button
document.getElementById("next-btn").addEventListener("click", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  renderCurrentSong(songs[currentSongIndex]);
});

// Previous button
document.getElementById("prev-btn").addEventListener("click", () => {
  currentSongIndex =
    (currentSongIndex - 1 + songs.length) % songs.length;
  renderCurrentSong(songs[currentSongIndex]);
});

// Initialize UI with full list of songs
showSongs();
renderPlaylistList();
renderCurrentSong(songs[currentSongIndex]);