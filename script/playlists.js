createPlayListBtn.addEventListener("click", function () {
    for (let i = 0; i < lowerBtns.length; i++) {
        lowerBtns[i].classList.remove("active");
    }

    for (let i = 0; i < upperBtns.length; i++) {
        upperBtns[i].classList.remove("active");
    }

    createPlayListBtn.classList.add("active");

    let valCopy;

    let transaction = db.transaction("lastPlayedSong", "readonly");
    let lastPlayedSong = transaction.objectStore("lastPlayedSong");

    let cursorRequest = lastPlayedSong.openCursor();

    cursorRequest.onsuccess = function () {
        let cursor = cursorRequest.result;

        if (cursor) {
            let key = cursor.key;
            let value = cursor.value;

            valCopy = { ...value };
            transaction = db.transaction("playListsDB", "readwrite");
            let playListsDB = transaction.objectStore("playListsDB");

            let addRequest = playListsDB.add(valCopy);

            addRequest.onsuccess = function () {
                console.log(addRequest.result);
            }

            addRequest.onerror = function () {
                console.log("error");
            }
            cursor.continue();
        }
    }

    cursorRequest.onerror = function () {
        console.log("error");
    }

})


openLibraryBtn.addEventListener("click", function () {
    for (let i = 0; i < lowerBtns.length; i++) {
        lowerBtns[i].classList.remove("active");
    }

    for (let i = 0; i < upperBtns.length; i++) {
        upperBtns[i].classList.remove("active");
    }

    openLibraryBtn.classList.add("active");
    playListsSongsList.innerHTML = `<div class="table-row heading">
    <div class="table-row-element sno-heading">#</div>
    <div class="table-row-element title-heading">TITLE</div>
    <div class="table-row-element date-heading">DATE ADDED</div>
    <div class="table-row-element duration-heading">DURATION</div>
</div>`;
    createPlayListPage.style.display = "block";
    mainAudioPage.style.display = "none";
    likedVideosPage.style.display = "none";
    mainVideoPage.style.display = "none";

    let transaction = db.transaction("playListsDB", "readonly");
    let playListsDB = transaction.objectStore("playListsDB");

    let cursorRequest = playListsDB.openCursor();

    let idx = 1;
    cursorRequest.onsuccess = function () {
        let cursor = cursorRequest.result;
        if (cursor) {
            let key = cursor.key;
            let value = cursor.value;

            playListsSongsList.innerHTML += `<div class="table-row">
            <div class="table-row-element sno-heading">${idx}</div>
            <div class="table-row-element title-heading">${value.name}</div>
            <div class="table-row-element date-heading">${String(value.created).trim().split("GMT")[0]}</div>
            <div class="table-row-element duration-heading"><i class="fas fa-times" style="font-size: 25px; margin: 5px"></i>
                </svg>${value.totalDuration}</div>
        </div>`


            // 
            let allTableRows = playListsSongsList.querySelectorAll(".title-heading");
            for (let i = 1; i < allTableRows.length; i++) {
                allTableRows[i].addEventListener("click", function () {
                    let transaction = db.transaction("playListsDB", "readwrite");
                    let playListsDB = transaction.objectStore("playListsDB");
            
                    let request = playListsDB.openCursor();
            
                    request.onsuccess = function () {
                        let cursor = request.result;
                        if (cursor) {
                            let key = cursor.key;
                            let value = cursor.value;
                            if (value.name == allTableRows[i].innerText) {
                                openMedia(value);
                            }
                            cursor.continue();
                        }
                    };
                })
            }

            let allDurations = playListsSongsList.querySelectorAll(".duration-heading");
            for (let i = 1; i < allDurations.length; i++) {
                allDurations[i].addEventListener("click", function () {
                    let transaction = db.transaction("playListsDB", "readwrite");
                    let playListsDB = transaction.objectStore("playListsDB");
            
                    let request = playListsDB.openCursor();
            
                    request.onsuccess = function () {
                        let cursor = request.result;
                        if (cursor) {
                            let key = cursor.key;
                            let value = cursor.value;
                            if (value.name == allTableRows[i].innerText) {
                                playListsDB.delete(key);
                            }
                            cursor.continue();
                        }
                    };
                })
            }
            // 
            idx++;
            cursor.continue();
        }
    }

    cursorRequest.onerror = function () {
        console.log("error");
    }
})


playAllBtns[1].addEventListener("click", function () {
    let songsArray = [];
    let transaction = db.transaction("playListsDB", "readwrite");
    let playListsDB = transaction.objectStore("playListsDB");

    let request = playListsDB.openCursor();

    request.onsuccess = function () {
        let cursor = request.result;
        if (cursor) {
            let key = cursor.key;
            let value = cursor.value;
            songsArray.push(value);
            cursor.continue();
        }
        
            mainVideoPage.style.display = "block";
            createPlayListPage.style.display = "none";

            let i = 0;
        
            function next() {
                if (i === songsArray.length - 1) {
                    i = 0;
                } else {
                    i++;
                }
        
                openMedia(songsArray[i]);
            }
        
            openMedia(songsArray[i]);
        
            videoEle.addEventListener('ended', next, false);
    };
})