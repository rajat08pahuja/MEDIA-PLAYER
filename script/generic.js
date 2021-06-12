let homeBtn = document.querySelector(".home-btn");
let fileInputBtn = document.querySelector(".home-btn-input-receiver");
let videoEle = document.querySelector(".video-element");
let playBtn = document.querySelector(".play-btn");
let totalTimeElement = document.querySelector(".total-timing");
let videoNameElement = document.querySelector(".media-name");
let docFullScreenEle = document.querySelector(".main-btn");
let videoFullScreenEle = document.querySelector(".fullscreen-btn");
let volumeSlideEle = document.querySelector(".vol-slider-ele");
let progressSlider = document.querySelector(".progress-slider");
let completedTimeElement = document.querySelector(".completed-timing");
let mainImageElement = document.querySelector(".main-panel-image");
let mediaIcon = document.querySelector(".media-icon-img");
let upperBtns = document.querySelectorAll(".upper-btn");
let lowerBtns = document.querySelectorAll(".lower-btn");
let mainVideoPage = document.querySelector(".main-video");
let mainAudioPage = document.querySelector(".main-audio");
let videoRepeatBtn = document.querySelector(".repeat-btn");
let audioCardTitle = document.querySelector(".audio-card-title");
let playbackDropDown = document.querySelector(".playback-dropdown");
let likedSongsListBtn = document.querySelector(".liked-songs-btn");
let likeSongIcon = document.querySelector(".like-icon");
let likeSongIconSVG = document.querySelector(".like-icon-svg");
let likedVideosPage = document.querySelector(".liked-video-playlists");
let likedSongsListEle = document.querySelector(".liked-songs-list");
let createPlayListBtn = document.querySelector(".create-playlist-btn");
let createPlayListPage = document.querySelector(".create-playlists-page");
let playlistFileReceiver = document.querySelector(".add-playlist-file-receiver");
let playListsSongsList = document.querySelector(".playlist-songs-list");
let playListName = document.querySelectorAll(".playlist-text-section div")[1];
let playListContainer = document.querySelector(".playlist-container");
let playAllBtns = document.querySelectorAll(".play-all-btn");
let openLibraryBtn = document.querySelector(".open-library-btn");

let playState = false;
let progressState = false;
let docFullScreenState = false;
let videoFullScreenState = false;
let loopState = false;
let videoBlob;
let totalDuration;
let mediaDuration;
let db;
let fileType;

// creating database
let openDBrequest = indexedDB.open("mediaPlayerDB", 1);
openDBrequest.onupgradeneeded = function () {
    db = openDBrequest.result;
    db.createObjectStore("likedSongsDB", { keyPath: 'id' });
    db.createObjectStore("playListsDB", { keyPath: 'id' });
    db.createObjectStore("lastPlayedSong", { keyPath: 'id' });
}

openDBrequest.onerror = function () {
    console.error("Error", openDBrequest.error);
}

openDBrequest.onsuccess = function () {
    db = openDBrequest.result;
    console.log("Suceess", db);

    let transaction = db.transaction("lastPlayedSong", "readonly");
    let lastPlayedSong = transaction.objectStore("lastPlayedSong");

    let cursorRequest = lastPlayedSong.openCursor();

    cursorRequest.onsuccess = function () {
        let cursor = cursorRequest.result;
        if (cursor) {
            openMedia(cursor.value);
        }
    }

    cursorRequest.onerror = function () {
        console.log("error");
    }
}


// full screen document
docFullScreenEle.addEventListener("click", function () {
    if (docFullScreenState == false) {
        document.documentElement.requestFullscreen();
        docFullScreenEle.innerHTML = `<i class="fas fa-compress-arrows-alt" style="font-size: xx-large; color: whitesmoke;"></i>`
    } else {
        document.exitFullscreen();
        docFullScreenEle.innerHTML = `<i class="fas fa-expand-arrows-alt" style="font-size: xx-large; color: whitesmoke;"></i>`
    }
    docFullScreenState = !docFullScreenState;
})