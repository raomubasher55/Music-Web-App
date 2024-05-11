
let songs;
let currFolder;

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3001/${currFolder}`)
    let response = await a.text();
    // console.log(response);

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    // console.log(as);
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${currFolder}/`)[1])
        }
    }



    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    // console.log(songUL.innerHTML)
    songUL.innerHTML = ""
    for (let song of songs) {
        if (song) {
            songUL.innerHTML += `<li>
                <img class="invert" src="./svg/music.svg" alt="">   
                <div class="playNow">
                    <div class="info">
                        <div>${song.replaceAll("%20", " ")}</div>
                        <div>Song Singer</div>
                    </div>
                    <div class="palyNow_btn">
                        <div class="playNowText">Playnow</div>
                        <img class="invert" src="./svg/play.svg" alt="">
                    </div>
                </div>
            </li>`;
        }
    }
    
    //attach a eventlistner to all songs
    const songList = Array.from(document.querySelector(".songList").getElementsByTagName("li"))
    songList.forEach(e => {
        e.addEventListener("click", () => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            let currentPlayingsong = e.querySelector(".info").firstElementChild.innerHTML
            playMusic(currentPlayingsong)  /*agr na chle trim method use krna vo space ko remove krta hai*/
        })
    });

    return songs;
}

const play = document.querySelector("#play");
const previuos = document.querySelector("#previous");
const next = document.querySelector("#next");
let cardContainer = document.querySelector(".cardContainer");

const currentSong = new Audio();
const playMusic = (track, pause = false) => {
    // let audio = new Audio ("./songs/"+ track)
    currentSong.src = `http://127.0.0.1:3001/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "./svg/pause.svg"
    }
    // document.querySelector(".songinfo").innerHTML= currentSong.src.split("/songs/")[1].replace("%20" , " ")  // line 32 and 33 same function perform kr rahi hai
    document.querySelector(".songinfo").innerHTML = decodeURI(track);

}


async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3001/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let array = div.getElementsByTagName("a");
    

    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        

        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/songs/")[1]

            // get the meta data of tehe folder
            let a = await fetch(`http://127.0.0.1:3001/songs/${folder}/info.json`)
            let response = await a.json();


            // console.log(response);
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card ">
             <div  class="play">
                 <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                 <!-- Background Circle -->
                 <circle cx="12" cy="12" r="12" fill="#008000" />

                 <!-- Circle Outline -->
                 <circle cx="12" cy="12" r="10" stroke="#000000" stroke-width="1.5" fill="none" />

                 <!-- Inner play part -->
                 <path
                     d="M15.4531 12.3948C15.3016 13.0215 14.5857 13.4644 13.1539 14.3502C11.7697 15.2064 11.0777 15.6346 10.5199 15.4625C10.2893 15.3913 10.0793 15.2562 9.90982 15.07C9.5 14.6198 9.5 13.7465 9.5 12C9.5 10.2535 9.5 9.38018 9.90982 8.92995C10.0793 8.74381 10.2893 8.60868 10.5199 8.53753C11.0777 8.36544 11.7697 8.79357 13.1539 9.64983C14.5857 10.5356 15.3016 10.9785 15.4531 11.6052C15.5156 11.8639 15.5156 12.1361 15.4531 12.3948Z"
                     stroke="#000000" stroke-width="1.5" stroke-linejoin="round" fill="#333" />
                 </svg>
             </div>
         <img src="/songs/${folder}/cover.jpg" alt="card image">
         <h2>${response.title}</h2>
         <p>${response.description}</p>
     </div>`;
        }
    };

    //load the libaray whenever the card clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log(item.currentTarget.dataset.folder);
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })

}

async function main() {

    //getting all songs
    await getSongs("songs/ncs");
    playMusic(songs[0], true)

    //Display all the albums on the page
    displayAlbums()

    //Add eventlistner to previuos , paly and next
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "./svg/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "./svg/play.svg"
        }
    })

    previuos.addEventListener("click", () => {
        // console.log(currentSong.src.split("/songs/")[1]); 
        // console.log(currentSong.src.split("/").splice(-1)[0]);
        console.log(songs);
        let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0])
        console.log(index, songs)
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })


    next.addEventListener("click", () => {
        // console.log(currentSong.src.split("/songs/")[1]); 
        // console.log(currentSong.src.split("/").splice(-1)[0]);
        let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0])
        console.log(index, songs)
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })


    //Lister for time update event
    currentSong.addEventListener("timeupdate", (a) => {
        // console.log(currentSong.currentTime , currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToTime(currentSong.currentTime)}/${secondsToTime(currentSong.duration)}`
        // console.log(secondsToTime(currentSong.currentTime)) 

        //change the seekbar mean circle
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration * 100) + "%"
    })

    // eventlsiter at seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";    //getBoundingClientRect yhe batata hai k ham page pr kn si jahga h

        currentSong.currentTime = (currentSong.duration * percent) / 100;
    })

    //add event to humburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        console.log("btn was clicked");
        document.querySelector(".left").style.left = "0";
    })

    //event to cancel
    document.querySelector(".cancel").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })
    //event to change the volume
    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    })

    //add event to mute the volume
    document.querySelector(".volume-img").addEventListener("click" ,(e) =>{
        console.log(e.target.src);
        if(e.target.src.includes("volume.svg")){
            e.target.src ="./svg/mute.svg"
            currentSong.volume = 0;
            document.querySelector(".volume").getElementsByTagName("input")[0].value= 0;
        }
        else{
            e.target.src = "./svg/volume.svg"
            currentSong.volume = 0.1;
            document.querySelector(".volume").getElementsByTagName("input")[0].value = 10;
        }
    })

   
}

main();




//time convetor function
function secondsToTime(seconds) {
    // Calculate minutes and remaining seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds with leading zeros
    var formattedMinutes = (minutes < 10 ? '0' : '') + minutes;
    var formattedSeconds = (remainingSeconds < 10 ? '0' : '') + remainingSeconds;

    // Return formatted time string
    return formattedMinutes + ':' + formattedSeconds;
}