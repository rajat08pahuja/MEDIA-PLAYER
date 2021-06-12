// opening new file
homeBtn.addEventListener("click", function () {
    console.log("hello");
    mainVideoPage.style.display = "block";
    mainAudioPage.style.display = "none";
    likedVideosPage.style.display = "none";
    createPlayListPage.style.display = "none";
    for (let i = 0; i < lowerBtns.length; i++) {
        lowerBtns[i].classList.remove("active");
    }

    for (let i = 0; i < upperBtns.length; i++) {
        upperBtns[i].classList.remove("active");
    }

    homeBtn.classList.add("active");
})

fileInputBtn.addEventListener("change", function (e) {
    let file = e.target.files[0];
    fileType = file.type.split("/")[0].trim();

    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    videoNameElement.innerText = file.name;

    reader.onload = function (e) {
        let buffer = e.target.result;
        videoBlob = new Blob([new Uint8Array(buffer)]);
        let url = window.URL.createObjectURL(videoBlob);
        videoEle.src = url;
        if (fileType == "audio") {
            mainVideoPage.style.display = "none";
            mainAudioPage.style.display = "flex";
            audioCardTitle.innerText = file.name;
        } else {
            mainVideoPage.style.display = "block";
            mainAudioPage.style.display = "none";
        }

        completedTimeElement.innerHTML = `00:00:00`;
        playState = false;
        progressState = false;
        playBtn.innerHTML = `<svg role="img" height="16" width="16" viewBox="0 0 16 16" class="control-btn-svg">
        <path d="M4.018 14L14.41 8 4.018 2z"></path>
        </svg>`;

        openMedia();
    }
})

// open Media 
function openMedia(songObj) {
    likedVideosPage.style.display = "none";
    createPlayListPage.style.display = "none";
    if (songObj != undefined) {
        fileType = songObj.fileType;
        videoNameElement.innerText = songObj.name;
        videoBlob = songObj.Blob;
        videoEle.src = window.URL.createObjectURL(songObj.Blob);
        if (fileType == "audio") {
            mainVideoPage.style.display = "none";
            mainAudioPage.style.display = "flex";
            audioCardTitle.innerText = songObj.name;
        } else {
            mainVideoPage.style.display = "block";
            mainAudioPage.style.display = "none";
        }

        completedTimeElement.innerHTML = `00:00:00`;
        totalTimeElement.innerText = songObj.duration
        totalTimeElement.innerText = songObj.totalDuration;
        playState = false;
        progressState = false;
        playBtn.innerHTML = `<svg role="img" height="16" width="16" viewBox="0 0 16 16" class="control-btn-svg">
    <path d="M4.018 14L14.41 8 4.018 2z"></path>
</svg>`;

        
    }

    playBtn.addEventListener("click", function () {
        if (playState == false) {
            videoEle.play();
            progressState = true;
            playBtn.innerHTML = `<svg role="img" height="16" width="16" viewBox="0 0 16 16" class="control-btn-svg">
    <path fill="none" d="M0 0h16v16H0z"></path>
    <path d="M3 2h3v12H3zm7 0h3v12h-3z"></path>
</svg>`
        } else {
            playBtn.innerHTML = `<svg role="img" height="16" width="16" viewBox="0 0 16 16" class="control-btn-svg">
    <path d="M4.018 14L14.41 8 4.018 2z"></path>
</svg>`
            progressState = false;
            videoEle.pause();
            let transaction = db.transaction("lastPlayedSong", "readwrite");
            let lastPlayedSong = transaction.objectStore("lastPlayedSong");

            lastPlayedSong.clear();

            let song;
            if (songObj == undefined) {
                song = {
                    id: uid(),
                    name: videoNameElement.innerText,
                    created: new Date(),
                    totalDuration: totalTimeElement.innerText,
                    Blob: videoBlob,
                    lastPlayed: completedTimeElement.innerText,
                    fileType: fileType
                }
            } else {
                song = {
                    id: uid(),
                    name: videoNameElement.innerText,
                    created: new Date(),
                    totalDuration: totalTimeElement.innerText,
                    Blob: songObj.Blob,
                    lastPlayed: completedTimeElement.innerText,
                    fileType: fileType
                }
            }


            let request = lastPlayedSong.add(song);

            request.onsuccess = function () { // (4)
                console.log(request.result);
            };

            request.onerror = function () {
                console.log(request.error);
            };
        }
        playState = !playState;
    })


    videoEle.addEventListener("loadedmetadata", function (e) {
        videoEle.style.display = "block";
        totalDuration = videoEle.duration;
        progressSlider.min = 0;
        progressSlider.max = totalDuration;
        progressSlider.value = 0;

        let th = totalDuration / 3600;
        hrs = Number.parseInt(th);

        let tm = (th - hrs) * 60;
        mins = Number.parseInt(tm);

        let secs = Number.parseInt((tm - mins) * 60);
        hrs = (hrs > 9) ? hrs : `0${hrs}`;
        mins = (mins > 9) ? mins : `0${mins}`;
        secs = (secs > 9) ? secs : `0${secs}`;
        totalTimeElement.innerText = `${hrs}:${mins}:${secs}`;
        mediaDuration = `${hrs}:${mins}:${secs}`;

        let song;
        song = {
            id: uid(),
            name: videoNameElement.innerText,
            created: new Date(),
            totalDuration: totalTimeElement.innerText,
            Blob: videoBlob,
            lastPlayed: completedTimeElement.innerText,
            fileType: fileType
        }

        let transaction = db.transaction("lastPlayedSong", "readwrite");
        let lastPlayedSong = transaction.objectStore("lastPlayedSong");
        lastPlayedSong.clear();

        let request = lastPlayedSong.add(song);

        request.onsuccess = function () { // (4)
            console.log(request.result);
        };

        request.onerror = function () {
            console.log(request.error);
        };

        
    })

    // video elem fullscreen
    videoFullScreenEle.addEventListener("click", function () {
        videoEle.requestFullscreen();
    })

    // change volume
    volumeSlideEle.addEventListener("change", function () {
        let cVol = Number.parseInt(volumeSlideEle.value) / 100;
        videoEle.volume = cVol;
    })

    progressSlider.addEventListener("change", function () {
        let val = progressSlider.value;
        videoEle.currentTime = val;

        let duration = val;

        let th = duration / 3600;
        hrs = Number.parseInt(th);

        let tm = (th - hrs) * 60;
        mins = Number.parseInt(tm);

        let secs = Number.parseInt((tm - mins) * 60);
        hrs = (hrs > 9) ? hrs : `0${hrs}`;
        mins = (mins > 9) ? mins : `0${mins}`;
        secs = (secs > 9) ? secs : `0${secs}`;

        completedTimeElement.innerText = `${hrs}:${mins}:${secs}`;

        let transaction = db.transaction("lastPlayedSong", "readwrite");
        let lastPlayedSong = transaction.objectStore("lastPlayedSong");

        lastPlayedSong.clear();

        let song;

        song = {
            id: uid(),
            name: videoNameElement.innerText,
            created: new Date(),
            totalDuration: totalTimeElement.innerText,
            Blob: videoBlob,
            lastPlayed: completedTimeElement.innerText,
            fileType: fileType
        }



        let request = lastPlayedSong.add(song);

        request.onsuccess = function () { // (4)
            console.log(request.result);
        };

        request.onerror = function () {
            console.log(request.error);
        };
    })

    // measuring progress of media element
    let progressTimer = setInterval(progressTimerFn, 1000);

    function progressTimerFn() {
        if (progressState == true) {
            progressSlider.value = Number.parseInt(progressSlider.value) + 1;

            let duration = Number.parseInt(progressSlider.value);
            let th = duration / 3600;
            hrs = Number.parseInt(th);

            let tm = (th - hrs) * 60;
            mins = Number.parseInt(tm);

            let secs = Number.parseInt((tm - mins) * 60);

            hrs = (hrs > 9) ? hrs : `0${hrs}`;
            mins = (mins > 9) ? mins : `0${mins}`;
            secs = (secs > 9) ? secs : `0${secs}`;

            completedTimeElement.innerText = `${hrs}:${mins}:${secs}`;
            if (duration == totalDuration) {
                if (loopState == true) {
                    completedTimeElement.innerText = `00:00:00`;
                    progressSlider.value = progressSlider.min;
                    videoEle.loop = true;
                } else {
                    clearInterval(progressTimer);
                }
            }
        }
    }

}