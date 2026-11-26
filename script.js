const songs = [
    {
        title: "Multo",
        artist: "Cup of Joe",
        audio: "audio/multo.mp3",
        lyrics: "lyrics/multo.lrc",
        category: "opm"
    },
    {
        title: "Nandito Ako",
        artist: "Ogie Alcasid",
        audio: "audio/nandito-ako.mp3",
        lyrics: "lyrics/nandito-ako.lrc",
        category: "love"
    },
    {
        title: "Pahina",
        artist: "Cup of Joe",
        audio: "audio/pahina.mp3",
        lyrics: "lyrics/pahina.lrc",
        category: "opm"
    },
    {
        title: "Palagi",
        artist: "TJ Monterde",
        audio: "audio/palagi.mp3",
        lyrics: "lyrics/palagi.lrc",
        category: "love"
    },
    {
        title: "Saksi Ang Langit",
        artist: "December Avenue",
        audio: "audio/saksi-ang-langit.mp3",
        lyrics: "lyrics/saksi-ang-langit.lrc",
        category: "love"
    },
    {
        title: "Sarangola",
        artist: "Ben&Ben",
        audio: "audio/saranggola.mp3",
        lyrics: "lyrics/saranggola.lrc",
        category: "chill"
    },
    {
        title: "Tahanan",
        artist: "Adie",
        audio: "audio/tahanan.mp3",
        lyrics: "lyrics/tahanan.lrc",
        category: "love"
    },
    {
        title: "Maybe This Time",
        artist: "Sarah Geronimo",
        audio: "audio/maybe-this-time.mp3",
        lyrics: "lyrics/maybe-this-time.lrc",
        category: "love"
    },
    {
        title: "Love Story",
        artist: "Taylor Swift",
        audio: "audio/love-story.mp3",
        lyrics: "lyrics/love-story.lrc",
        category: "love"
    },
    {
        title: "Forevermore",
        artist: "Side A",
        audio: "audio/forevermore.mp3",
        lyrics: "lyrics/forevermore.lrc",
        category: "chill"
    }
];

// ELEMENTS

const audio = document.getElementById("audioPlayer");
const songList = document.getElementById("songList");

const currentTitle = document.getElementById("currentTitle");
const currentArtist = document.getElementById("currentArtist");
const miniCover = document.getElementById("miniCover");

const playBtn = document.getElementById("playBtn");
const nextBtn = document.getElementById("nextBtn");
const previousBtn = document.getElementById("previousBtn");

const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");
const favoriteBtn = document.getElementById("favoriteBtn");

const progressBar = document.getElementById("progressBar");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const volumeBar = document.getElementById("volumeBar");

const lyricsDisplay = document.getElementById("lyricsDisplay");
const showLyrics = document.getElementById("showLyrics");

const lyricTitle = document.getElementById("lyricTitle");
const lyricArtist = document.getElementById("lyricArtist");
const songCount = document.getElementById("songCount");

// VARIABLES

let currentSongIndex = -1;
let lyricsData = [];
let lyricsExpanded = false;

let shuffleEnabled = false;

// Repeat modes: 0 = Off, 1 = Repeat All, 2 = Repeat One
let repeatMode = 0;

let favorites = [];
let lyricRequest = 0;


// DISPLAY SONGS

function displaySongs(category = "all") {

    songList.innerHTML = "";

    const filteredSongs = songs
        .map((song, index) => ({ ...song, index }))
        .filter(song =>
            category === "all" || song.category === category
        );

    songCount.textContent = '${filteredSongs.length} TRACKS';
    filteredSongs.forEach(song => {

        const card = document.createElement("div");

        card.className = "song-card";
        card.dataset.index = song.index;

        if (song.index === currentSongIndex) {
            card.classList.add("playing");
        }

        card.innerHTML = `
            <div class="song-cover">♫</div>

            <div class="song-details">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
            </div>

            <span class="song-number">⋮</span>
        `;

        card.addEventListener("click", () => {
            loadSong(song.index);
        });

        songList.appendChild(card);
    });
}


// LOAD SONG

function loadSong(index) {

    if (index < 0 || index >= songs.length) return;

    currentSongIndex = index;

    const song = songs[index];

    audio.pause();
    audio.src = song.audio;
    audio.load();

    currentTitle.textContent = song.title;
    currentArtist.textContent = song.artist;

    lyricTitle.textContent = song.title;
    lyricArtist.textContent = song.artist;

    // RESET TIME

    currentTime.textContent = "0:00";
    duration.textContent = "0:00";
    progressBar.value = 0;

    // UPDATE MINI COVER COLOR

    const selectedCard = document.querySelector(
        '.song-card[data-index="${index}"] .song-cover'
    );

    if (selectedCard) {
        miniCover.style.background =
            getComputedStyle(selectedCard).background;
    } else {
        miniCover.style.background =
            getCoverGradient(index);
    }

    // RESET PLAY BUTTON

    playBtn.textContent = "▶";

    // UPDATE SELECTED SONG

    document.querySelectorAll(".song-card").forEach(card => {
        card.classList.remove("playing");
    });

    const activeCard = document.querySelector(
        '.song-card[data-index="${index}"]'
    );

    if (activeCard) {
        activeCard.classList.add("playing");
    }

    displaySongs(
        document.querySelector(".category.active")?.dataset.category || "all"
    );

    // LOAD LYRICS

    loadLyrics(song.lyrics);

    // PLAY SONG

    audio.play()
        .then(() => {
            playBtn.textContent = "Ⅱ";
        })
        .catch(() => {
            playBtn.textContent = "▶";
            alert(
                "Cannot play this song. Check the MP3 filename inside your songs folder."
            );
        });
}


// GRADIENT COLORS

function getCoverGradient(index) {

    const gradients = [
        "linear-gradient(135deg,#ff5f9e,#7928ca)",
        "linear-gradient(135deg,#00c9a7,#0072ff)",
        "linear-gradient(135deg,#f7971e,#ff3d00)",
        "linear-gradient(135deg,#fc466b,#3f5efb)",
        "linear-gradient(135deg,#11998e,#38ef7d)",
        "linear-gradient(135deg,#654ea3,#eaafc8)",
        "linear-gradient(135deg,#2193b0,#6dd5ed)",
        "linear-gradient(135deg,#ee0979,#ff6a00)",
        "linear-gradient(135deg,#4568dc,#b06ab3)",
        "linear-gradient(135deg,#00b09b,#96c93d)"
    ];

    return gradients[index];
}


// PLAY AND PAUSE

function togglePlay() {

    if (currentSongIndex === -1) {
        loadSong(0);
        return;
    }

    if (audio.paused) {

        audio.play()
            .then(() => {
                playBtn.textContent = "Ⅱ";
            })
            .catch(() => {
                alert("Unable to play audio. Check your MP3 file.");
            });

    } else {

        audio.pause();
        playBtn.textContent = "▶";
    }
}

playBtn.addEventListener("click", togglePlay);


// NEXT SONG

function nextSong() {

    if (shuffleEnabled && songs.length > 1) {

        let randomIndex;

        do {
            randomIndex = Math.floor(Math.random() * songs.length);
        } while (randomIndex === currentSongIndex);

        loadSong(randomIndex);

    } else {

        currentSongIndex++;

        if (currentSongIndex >= songs.length) {
            currentSongIndex = 0;
        }

        loadSong(currentSongIndex);
    }
}

nextBtn.addEventListener("click", nextSong);


// PREVIOUS SONG

previousBtn.addEventListener("click", () => {

    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }

    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }

    loadSong(currentSongIndex);
});


// AUTOMATIC NEXT AND REPEAT

audio.addEventListener("ended", () => {

    if (repeatMode === 2) {

        audio.currentTime = 0;

        audio.play();

        return;
    }

    if (currentSongIndex === songs.length - 1 &&
        repeatMode === 0 &&
        !shuffleEnabled) {

        playBtn.textContent = "▶";
        return;
    }

    nextSong();
});


// SHUFFLE

shuffleBtn.addEventListener("click", () => {

    shuffleEnabled = !shuffleEnabled;

    shuffleBtn.classList.toggle("selected", shuffleEnabled);

    shuffleBtn.title = shuffleEnabled
        ? "Shuffle On"
        : "Shuffle Off";
});


// REPEAT

repeatBtn.addEventListener("click", () => {

    repeatMode++;

    if (repeatMode > 2) {
        repeatMode = 0;
    }

    if (repeatMode === 0) {
        repeatBtn.textContent = "🔁";
        repeatBtn.title = "Repeat Off";
        repeatBtn.classList.remove("selected");
    }

    if (repeatMode === 1) {
        repeatBtn.textContent = "🔁";
        repeatBtn.title = "Repeat All";
        repeatBtn.classList.add("selected");
    }

    if (repeatMode === 2) {
        repeatBtn.textContent = "🔂";
        repeatBtn.title = "Repeat One";
        repeatBtn.classList.add("selected");
    }
});


// FORMAT TIME

function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return minutes +":"+
    String(remainingSeconds).padStart(2, "0");
}


// UPDATE SONG DURATION

audio.addEventListener("loadedmetadata", () => {

    duration.textContent = formatTime(audio.duration);

});



// Automatically update the current time and lyrics
audio.addEventListener("timeupdate", () => {

    // Get the current playing time
    const currentSeconds = audio.currentTime;

    // Update the progress bar
    const progress = (currentSeconds / audio.duration) * 100;

    progressBar.value = progress || 0;

    // Display current song time
    currentTime.textContent = formatTime(currentSeconds);

    // Find the correct lyric based on song time
    let currentLine = -1;

    lyricLines.forEach((line, index) => {

        if (currentSeconds >= line.time) {
            currentLine = index;
        }

    });

    // Highlight the current lyric
    if (currentLine !== activeLyricIndex) {

        activeLyricIndex = currentLine;

        document.querySelectorAll(".lyric-line").forEach(line => {
            line.classList.remove("active");
        });

        if (currentLine !== -1) {

            const activeLine = document.getElementById(
                lyric-'${currentLine}'
            );

            if (activeLine) {

                activeLine.classList.add("active");

                // Automatically scroll to the next lyric
                activeLine.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

        }

    }

});



// SEEK SONG

progressBar.addEventListener("input", () => {

    if (Number.isFinite(audio.duration) && audio.duration > 0) {

        audio.currentTime =
            (progressBar.value / 100) * audio.duration;

        updateActiveLyric();
    }
});


// VOLUME

audio.volume = 0.8;

volumeBar.addEventListener("input", () => {

    audio.volume = Number(volumeBar.value);

});


// LOAD LRC LYRICS

async function loadLyrics(file) {

    const requestNumber = ++lyricRequest;

    lyricsData = []
    lyricsDisplay.innerHTML =
        '<p class="empty-lyrics">Loading lyrics...</p>';

    if (!file) {

        lyricsDisplay.innerHTML =
            '<p class="empty-lyrics">Lyrics are not available yet.</p>';

        return;
    }

    try {

        const response = await fetch(file);

        if (!response.ok) {
            throw new Error("Lyrics file not found");
        }

        const text = await response.text();

        // Ignore old requests if another song was selected
        if (requestNumber !== lyricRequest) return;

        const lines = text.split(/\r?\n/);

        lines.forEach(line => {

            const matches = line.matchAll(
                /\[(\d{2}):(\d{2})(?:[.:](\d{1,3}))?\](.*)/g
            );

            for (const match of matches) {

                const minutes = Number(match[1]);
                const seconds = Number(match[2]);

                const fraction = match[3] || "0";

                const timestamp =
                    minutes * 60 +
                    seconds +
                    Number("0." + fraction);

                const lyric = match[4].trim();

                if (lyric) {

                    lyricsData.push({
                        time: timestamp,
                        text: lyric
                    });
                }
            }
        });

        lyricsData.sort((a, b) => a.time - b.time);

        displayLyrics();

    } catch (error) {

        if (requestNumber !== lyricRequest) return;

        lyricsDisplay.innerHTML =
            '<p class="empty-lyrics">Lyrics file not found. Check your LRC folder.</p>';
    }
}


// DISPLAY LYRICS

function displayLyrics() {

    lyricsDisplay.innerHTML = "";

    if (lyricsData.length === 0) {

        lyricsDisplay.innerHTML =
            '<p class="empty-lyrics">No synchronized lyrics available.</p>';

        return;
    }

    lyricsData.forEach((line, index) => {

        const paragraph = document.createElement("p");

        paragraph.textContent = line.text;

        paragraph.dataset.index = index;

        lyricsDisplay.appendChild(paragraph);
    });

}


// SYNCHRONIZED LYRICS

function updateActiveLyric() {

    if (lyricsData.length === 0) return;

    let activeIndex = -1;

    lyricsData.forEach((line, index) => {

        if (audio.currentTime >= line.time) {
            activeIndex = index;
        }

    });

    const paragraphs =
        lyricsDisplay.querySelectorAll("p[data-index]");

    paragraphs.forEach((paragraph, index) => {

        paragraph.classList.toggle(
            "active",
            index === activeIndex
        );

    });

    const activeParagraph =
        lyricsDisplay.querySelector("p.active");

    if (activeParagraph) {

        activeParagraph.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
}


// SHOW MORE LYRICS

showLyrics.addEventListener("click", () => {

    lyricsExpanded = !lyricsExpanded;

    lyricsDisplay.style.height =
        lyricsExpanded ? "500px" : "235px";

    showLyrics.textContent =
        lyricsExpanded
            ? "Show less lyrics ↑"
            : "Show more lyrics ↓";
});


// FAVORITE BUTTON

favoriteBtn.addEventListener("click", () => {

    if (currentSongIndex === -1) return;

    const index = currentSongIndex;

    if (favorites.includes(index)) {

        favorites = favorites.filter(item => item !== index);

        favoriteBtn.textContent = "♡";

        favoriteBtn.classList.remove("favorited");

    } else {

        favorites.push(index);

        favoriteBtn.textContent = "♥";

        favoriteBtn.classList.add("favorited");
    }
});


// CATEGORY FILTER

document.querySelectorAll(".category").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".category").forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        const category = button.dataset.category;

        if (category === "favorites") {

            displaySongs("all");

            document.querySelectorAll(".song-card").forEach(card => {

                const index = Number(card.dataset.index);

                if (!favorites.includes(index)) {
                    card.remove();
                }
            });

            songCount.textContent =
                '${favorites.length} FAVORITES';

        } else {

            displaySongs(category);
        }
    });
});


// INITIALIZE

displaySongs();

audio.volume = 0.8;

console.log("Campus Beats Music Player is ready!");
// CATEGORY FILTER

document.querySelectorAll(".category").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".category").forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        const category = button.dataset.category;

        if (category === "favorites") {

            displaySongs("all");

            document.querySelectorAll(".song-card").forEach(card => {

                const index = Number(card.dataset.index);

                if (!favorites.includes(index)) {
                    card.remove();
                }
            });

            songCount.textContent =
                '${favorites.length} FAVORITES';

        } else {

            displaySongs(category);
        }
    });
});
// INITIALIZE

displaySongs();

audio.volume = 0.8;

console.log("Campus Beats Music Player is ready!");
// AUTOMATIC KARAOKE LYRICS SCROLL
const lyricSyncAudio = document.getElementById("audioPlayer");
const lyricSyncDisplay = document.getElementById("lyricsDisplay");

if (lyricSyncAudio && lyricSyncDisplay) {

    lyricSyncAudio.addEventListener("timeupdate", function () {

        if (!lyricsData || lyricsData.length === 0) return;

        const currentTime = lyricSyncAudio.currentTime;
        let activeIndex = -1;

        for (let i = 0; i < lyricsData.length; i++) {
            if (currentTime >= lyricsData[i].time) {
                activeIndex = i;
            } else {
                break;
            }
        }

        const lyricLines = lyricSyncDisplay.querySelectorAll("p");

        lyricLines.forEach((line, index) => {
            if (index === activeIndex) {
                line.classList.add("active");

                line.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            } else {
                line.classList.remove("active");
            }
        });

    });
}