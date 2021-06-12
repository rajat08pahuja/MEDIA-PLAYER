likeSongIcon.addEventListener("click", function () {
    let transaction = db.transaction("likedSongsDB", "readwrite");
    let likedSongsDB = transaction.objectStore("likedSongsDB");

    let request = likedSongsDB.openCursor();

    request.onsuccess = function () {
        let cursor = request.result;
        if (cursor) {
            let key = cursor.key;
            let value = cursor.value;
            if (value.name == videoNameElement.innerText) {
                likeSongIconSVG.style.fill = "white";
                likedSongsDB.delete(key);
                return;
            }
            cursor.continue();
        } else {
            likeSongIconSVG.style.fill = "#1db954";
            let song = {
                id: uid(),
                name: videoNameElement.innerText,
                Blob: videoBlob,
                created: new Date(),
                duration: mediaDuration,
            }

            let request = likedSongsDB.add(song);

            request.onsuccess = function () { // (4)
                console.log(request.result);
            };

            request.onerror = function () {
                console.log(request.error);
            };
        }
    };

})


likedSongsListBtn.addEventListener("click", function () {
    for (let i = 0; i < lowerBtns.length; i++) {
        lowerBtns[i].classList.remove("active");
    }

    for (let i = 0; i < upperBtns.length; i++) {
        upperBtns[i].classList.remove("active");
    }

    likedSongsListBtn.classList.add("active");
    
    mainVideoPage.style.display = "none";
    likedVideosPage.style.display = "block";
    mainAudioPage.style.display = "none";
    createPlayListPage.style.display = "none";
    likedSongsListEle.innerHTML = `<div class="table-row heading">
                    <div class="table-row-element sno-heading">#</div>
                    <div class="table-row-element title-heading">TITLE</div>
                    <div class="table-row-element date-heading">DATE ADDED</div>
                    <div class="table-row-element duration-heading">DURATION</div>
                </div>`;

    // 
    let transaction = db.transaction("likedSongsDB");
    let likedSongsDB = transaction.objectStore("likedSongsDB");

    let request = likedSongsDB.openCursor();
    let idx = 1;

    request.onsuccess = function () {
        let cursor = request.result;
        if (cursor) {
            let value = cursor.value;
            // 
            likedSongsListEle.innerHTML += `<div class="table-row">
            <div class="table-row-element sno-heading">${idx}</div>
            <div class="table-row-element title-heading">${value.name.trim()}</div>
            <div class="table-row-element date-heading">${String(value.created).trim().split("GMT")[0]}</div>
            <div class="table-row-element duration-heading"><svg role="img" height="16" width="16" viewBox="0 0 16 16"
                    class="like-icon-svg like-icon" style="fill: #1db954;">
                    <path fill="none" d="M0 0h16v16H0z"></path>
                    <path
                        d="M13.797 2.727a4.057 4.057 0 00-5.488-.253.558.558 0 01-.31.112.531.531 0 01-.311-.112 4.054 4.054 0 00-5.487.253c-.77.77-1.194 1.794-1.194 2.883s.424 2.113 1.168 2.855l4.462 5.223a1.791 1.791 0 002.726 0l4.435-5.195a4.052 4.052 0 001.195-2.883 4.057 4.057 0 00-1.196-2.883z">
                    </path>
                </svg>${value.duration}</div>
        </div>`

            let titleHeadingEle = likedSongsListEle.querySelectorAll(".title-heading");
            let allLikeIcons = likedSongsListEle.querySelectorAll(".like-icon");
            for (let i = 0; i < allLikeIcons.length; i++) {
                allLikeIcons[i].addEventListener("click", function () {
                    let transaction = db.transaction("likedSongsDB", "readwrite");
                    let likedSongsDB = transaction.objectStore("likedSongsDB");

                    let request = likedSongsDB.openCursor();

                    request.onsuccess = function () {
                        let cursor = request.result;
                        if (cursor) {
                            let key = cursor.key; 
                            let value = cursor.value; 
                            if (value.name == titleHeadingEle[i + 1].innerText) {
                                likeSongIconSVG.style.fill = "white";
                                likedSongsDB.delete(key);
                            }
                            cursor.continue();
                        }
                    };
                })
            }

            let allTableRows = likedSongsListEle.querySelectorAll(".table-row");
            for (let i = 1; i < allTableRows.length; i++) {
                allTableRows[i].addEventListener("click", function () {
                    let transaction = db.transaction("likedSongsDB", "readwrite");
                    let likedSongsDB = transaction.objectStore("likedSongsDB");

                    let request = likedSongsDB.openCursor();

                    request.onsuccess = function () {
                        let cursor = request.result;
                        if (cursor) {
                            let key = cursor.key;
                            let value = cursor.value;
                            if (value.name == allTableRows[i].querySelector(".title-heading").innerText) {
                                openMedia(value);
                            }
                            cursor.continue();
                        }
                    };
                })
            }
            // 
            console.log(value);
            idx++;
            cursor.continue();
        } 
    };
    // 
})

playAllBtns[0].addEventListener("click", function () {
    let blobArray = [];
    let transaction = db.transaction("likedSongsDB", "readwrite");
    let likedSongsDB = transaction.objectStore("likedSongsDB");

    let request = likedSongsDB.openCursor();

    request.onsuccess = function () {
        let cursor = request.result;
        if (cursor) {
            let key = cursor.key;
            let value = cursor.value;
            blobArray.push(value.Blob);
            cursor.continue();
        }
        
            mainVideoPage.style.display = "block";
            likedVideosPage.style.display = "none";
            let i = 0;
        
            function next() {
                if (i === blobArray.length - 1) {
                    i = 0;
                } else {
                    i++;
                }
        
                videoEle.src = window.URL.createObjectURL(blobArray[i]);
            }
        
            videoEle.src = window.URL.createObjectURL(blobArray[i]);
        
            videoEle.addEventListener('ended', next, false);
    };
})
