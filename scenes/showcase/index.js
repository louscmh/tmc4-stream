// SOCKET /////////////////////////////////////////////////////////////////
let socket = new ReconnectingWebSocket("ws://" + location.host + "/ws");
socket.onopen = () => {
    console.log("Successfully Connected");
};
socket.onclose = event => {
    console.log("Socket Closed Connection: ", event);
    socket.send("Client Closed!");
};
socket.onerror = error => {
    console.log("Socket Error: ", error);
};

// BEATMAP DATA /////////////////////////////////////////////////////////////////
let beatmapSet = [];
let beatmaps = [];
(async () => {
    try {
        const jsonData = await $.getJSON("../../_data/beatmaps.json");
        jsonData.map((beatmap) => {
            beatmapSet.push(beatmap);
        });
    } catch (error) {
        console.error("Could not read JSON file", error);
    }
    for (index = 0; index < beatmapSet.length; index++) {
        beatmaps.push(beatmapSet[index]["beatmapId"]);
    }
})();
console.log(beatmapSet);

// HTML VARS /////////////////////////////////////////////////////////////////
let beatmapTitle = document.getElementById("songTitle");
let beatmapArtist = document.getElementById("artistTitle");
let beatmapMapper = document.getElementById("mapperTitle");
let beatmapDifficulty = document.getElementById("difficultyTitle");

let beatmapTitleDelay = document.getElementById("songTitleDelay");
let beatmapArtistDelay = document.getElementById("artistTitleDelay");
let beatmapDifficultyDelay = document.getElementById("difficultyTitleDelay");

let pickID = document.getElementById("center");
let pickIDLeft = document.getElementById("leftTwo");
let pickIDRight = document.getElementById("rightTwo");
let mapOD = document.getElementById("od");
let mapSR = document.getElementById("sr");
let mapBPM = document.getElementById("bpm");
let mapLength = document.getElementById("length");
let modpoolText = document.getElementById("modpoolText");
let bgSource = document.getElementById("bgSource");
let stinger = document.getElementById("transitionVideo");

// PLACEHOLDER VARS /////////////////////////////////////////////////////////////////
let currentFile = "";
let currentStats;
let currentStage;
let tempBG;

socket.onmessage = event => {
    let data = JSON.parse(event.data);

    let file = data.menu.bm.path.file;
    let tempStats = data.menu.bm.stats;
    
    if (currentFile != file && currentStats != tempStats) {
        currentFile = file;
        currentStats = tempStats;
        stinger.play();
        setTimeout(function() {
            updateDetails(data);
        },1000)
    }
}

stinger.addEventListener('ended', () => {
    stinger.pause(); // Ensure the video stops playing
    stinger.currentTime = 0; // Optionally reset the video to the start
  });

async function updateDetails(data) {
	let { id } = data.menu.bm;
	let { memoryOD, fullSR, BPM: { min, max } } = data.menu.bm.stats;
	let { full } = data.menu.bm.time;
    let { difficulty, mapper, artist, title } = data.menu.bm.metadata;
    let file = data.menu.bm.path.file;
    let index;
    let pick;
    let modpool;

    console.log(file);

    // CHECKER FOR MAPPICK
    if (beatmaps.includes(id)) {
        index = beatmapSet.findIndex(beatmap => beatmap["beatmapId"] === id);
        pick = beatmapSet[index]["pick"];
        modpool = beatmapSet[index]["modpool"];
    } else if (beatmaps.includes(file)) {
        index = beatmapSet.findIndex(beatmap => beatmap["beatmapId"] === file);
        pick = beatmapSet[index]["pick"];
        modpool = beatmapSet[index]["modpool"];
    }
    pickID.innerHTML = pick == null ? "N.A" : pick;
    pickIDLeft.innerHTML = pick == null ? null : index == 0 ? ">>>" : beatmapSet[index-1]["pick"];
    pickIDRight.innerHTML = pick == null ?  null : index == beatmapSet.length-1 ? "<<<" : beatmapSet[index+1]["pick"];
    modpoolText.innerHTML = modpool == null ? "N.A" : modpool;

    beatmapTitle.innerHTML = title;
    beatmapArtist.innerHTML = artist;
    beatmapMapper.innerHTML = mapper;
    beatmapDifficulty.innerHTML = difficulty;
    mapOD.innerHTML = memoryOD.toFixed(1);
    mapSR.innerHTML = fullSR.toFixed(2);
    mapBPM.innerHTML = min === max ? min : `${min} - ${max}`;
    mapLength.innerHTML = parseTime(full);

    
	// BG
    if(tempBG !== data.menu.bm.path.full){
        tempBG = data.menu.bm.path.full;
        data.menu.bm.path.full = data.menu.bm.path.full.replace(/#/g,'%23').replace(/%/g,'%25');
		bgSource.setAttribute('src',`http://` + location.host + `/Songs/${data.menu.bm.path.full}?a=${Math.random(10000)}`);
		bgSource.onerror = function() {
			bgSource.setAttribute('src',`https://cdn.discordapp.com/attachments/793324125723820086/1204380886213337158/bwc_mainbanner_2.png?ex=65d4861b&is=65c2111b&hm=1fe2aefa6667cedebf4908a692d87cf36962b4ab344f1e4a98a1a5cfc0b6d4de&`);
		};
    }

    makeScrollingText(beatmapTitle, beatmapTitleDelay,20,460,40);
    makeScrollingText(beatmapArtist, beatmapArtistDelay,20,460,40);
    makeScrollingText(difficultyTitle, difficultyTitleDelay,20,460,40);
}

const parseTime = ms => {
	const second = Math.floor(ms / 1000) % 60 + '';
	const minute = Math.floor(ms / 1000 / 60) + '';
	return `${'0'.repeat(2 - minute.length) + minute}:${'0'.repeat(2 - second.length) + second}`;
}

async function makeScrollingText(title, titleDelay, rate, boundaryWidth, padding) {
    if (title.scrollWidth > boundaryWidth) {
        titleDelay.innerHTML = title.innerHTML;
		let ratio = (title.scrollWidth/boundaryWidth)*rate
		title.style.animation = `scrollText ${ratio}s linear infinite`;
		titleDelay.style.animation = `scrollText ${ratio}s linear infinite`;
		titleDelay.style.animationDelay = `${-ratio/2}s`;
		titleDelay.style.paddingRight = `${padding}px`;
		title.style.paddingRight = `${padding}px`;
        titleDelay.style.marginTop = `-${title.offsetHeight}px`;
        titleDelay.style.display = "initial";
    } else {
        titleDelay.style.display = "none";
		title.style.animation = "none";
		titleDelay.style.animation = "none";
		titleDelay.style.paddingRight = "0px";
        titleDelay.style.marginTop = `0px`;
		title.style.paddingRight = "0px";
	}
}