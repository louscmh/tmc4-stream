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

// SEEDING DATA /////////////////////////////////////////////////////////////////
let seedData = [];
let modpoolStageData = [];
let teamController;
(async () => {
    try {
        const jsonData = await $.getJSON("../../_data/seeding.json");
        jsonData.map((seed) => {
            seedData.push(seed);
        });
        const jsonData2 = await $.getJSON("../../_data/modpool.json");
        jsonData2.map((mod) => {
            modpoolStageData.push(mod);
        });
        console.log(seedData);
        console.log(modpoolStageData);
        setupInitial();
    } catch (error) {
        console.error("Could not read JSON file", error);
    }
})();

// API /////////////////////////////////////////////////////////////////
const file = [];
let api;
(async () => {
    try {
        const jsonData = await $.getJSON("../../_data/api.json");
        jsonData.map((num) => {
            file.push(num);
        });
        api = file[0].api;
    } catch (error) {
        console.error("Could not read JSON file", error);
    }
})();

// HTML VARS /////////////////////////////////////////////////////////////////
let controllerSeed = document.getElementById("controllerSeed");
let controllerNextSeed = document.getElementById("controllerNextSeed");
let controllerPreviousSeed = document.getElementById("controllerPreviousSeed");
let controllerNext10Seed = document.getElementById("controllerNext10Seed");
let controllerPrevious10Seed = document.getElementById("controllerPrevious10Seed");
let stinger = document.getElementById("transitionVideo");
let controllerSceneChange = document.getElementById("controllerSceneChange");

// PLACEHOLDER VARS /////////////////////////////////////////////////////////////////
let modAcronyms = ["rice Rice",'ln Long_Note',"hybrid Hybrid"];
let modpools = [];
let picks = [];
let currentSeed;



class Modpool {
    constructor(modpool, rank, modpoolAcronym) {
        this.modpoolText = modpool;
        this.modpoolAcronym = modpoolAcronym;
        this.rank = rank;
    }
    generate() {
        let resultContainer = document.getElementById(`result${this.modpoolAcronym}`);

        this.modpool = document.createElement("div");
        this.modpoolTitle = document.createElement("div");
        this.modpoolRank = document.createElement("div");

        this.modpool.id = `${this.modpoolText}modpool`;
        this.modpoolTitle.id = `${this.modpoolText}modpoolTitle`;
        this.modpoolRank.id = `${this.modpoolText}modpoolRank`;

        this.modpool.setAttribute("class", "modpool");
        this.modpoolTitle.setAttribute("class", "modpoolTitle");
        this.modpoolRank.setAttribute("class", "modpoolRank");

        this.modpoolTitle.innerHTML = this.modpoolText.replace(/_/g, ' ');;
        this.modpoolRank.innerHTML = `#${this.rank}`;

        resultContainer.appendChild(this.modpool);
        document.getElementById(this.modpool.id).appendChild(this.modpoolTitle);
        document.getElementById(this.modpool.id).appendChild(this.modpoolRank);
    }
    updateRank(newRank) {
        document.getElementById(this.modpoolRank.id).innerHTML = `#${newRank}`;;
    }
    fadeOut() {
        let container = document.getElementById(this.modpool.id);
        container.style.animation = "fadeOutDown 1s ease-in-out";
        container.style.opacity = 0;
    }
    fadeIn() {
        let container = document.getElementById(this.modpool.id);
        container.style.animation = "fadeInDown 1s ease-in-out";
        container.style.opacity = 1;
    }
    switch(newRank) {
        this.updateRank(newRank);
    }
}

class Map {
    constructor(mapData, index, modpoolAcronym) {
        this.score = mapData.score;
        this.stage = mapData.pick;
        this.rank = mapData.rank;
        this.index = index;
        this.modpoolAcronym = modpoolAcronym;
    }
    generate() {
        let resultContainer = document.getElementById(`result${this.modpoolAcronym}`);

        this.map = document.createElement("div");
        this.leftDetail = document.createElement("div");
        this.songTitle = document.createElement("div");
        this.artistTitle = document.createElement("div");
        this.rightDetail = document.createElement("div");
        this.scoreContainer = document.createElement("div");
        this.mapDetail = document.createElement("div");
        this.stageText = document.createElement("div");
        this.mapRank = document.createElement("div");
        this.overlay = document.createElement("div");
        this.sourceBG = document.createElement("div");

        this.map.id = `${this.index}map`;
        this.leftDetail.id = `${this.index}leftDetail`;
        this.songTitle.id = `${this.index}songTitle`;
        this.artistTitle.id = `${this.index}artistTitle`;
        this.rightDetail.id = `${this.index}rightDetail`;
        this.scoreContainer.id = `${this.index}scoreContainer`;
        this.mapDetail.id = `${this.index}mapDetail`;
        this.stageText.id = `${this.index}stageText`;
        this.mapRank.id = `${this.index}mapRank`;
        this.overlay.id = `${this.index}overlay`;
        this.sourceBG.id = `${this.index}sourceBG`;

        this.map.setAttribute("class", "map");
        this.leftDetail.setAttribute("class", "leftDetail");
        this.songTitle.setAttribute("class", "songTitle");
        this.artistTitle.setAttribute("class", "artistTitle");
        this.rightDetail.setAttribute("class", "rightDetail");
        this.scoreContainer.setAttribute("class", "score");
        this.mapDetail.setAttribute("class", "mapDetail");
        this.stageText.setAttribute("class", "stageText");
        this.mapRank.setAttribute("class", "mapRank");
        this.overlay.setAttribute("class", "overlay");
        this.sourceBG.setAttribute("class", "sourceBG");

        this.scoreContainer.innerHTML = this.score.toLocaleString('en-US');
        this.stageText.innerHTML = this.stage;
        this.mapRank.innerHTML = `#${this.rank}`;

        resultContainer.appendChild(this.map);

        document.getElementById(this.map.id).appendChild(this.leftDetail);
        document.getElementById(this.map.id).appendChild(this.rightDetail);
        document.getElementById(this.map.id).appendChild(this.overlay);
        document.getElementById(this.map.id).appendChild(this.sourceBG);

        document.getElementById(this.leftDetail.id).appendChild(this.songTitle);
        document.getElementById(this.leftDetail.id).appendChild(this.artistTitle);

        document.getElementById(this.rightDetail.id).appendChild(this.scoreContainer);
        document.getElementById(this.rightDetail.id).appendChild(this.mapDetail);

        document.getElementById(this.mapDetail.id).appendChild(this.stageText);
        document.getElementById(this.mapDetail.id).appendChild(this.mapRank);
    }
    updateBeatmapDetails(title, artist, bgSource) {
        document.getElementById(this.songTitle.id).innerHTML = title;
        document.getElementById(this.artistTitle.id).innerHTML = artist;
        document.getElementById(this.sourceBG.id).style.backgroundImage = bgSource;
        adjustFont(document.getElementById(this.songTitle.id),720,38.57)
    }
    updateDetails(mapData) {
        document.getElementById(this.scoreContainer.id).innerHTML = mapData.score.toLocaleString('en-US');
        document.getElementById(this.mapRank.id).innerHTML = `#${mapData.rank}`;
    }
    fadeOut() {
        let container = document.getElementById(this.map.id);
        container.style.animation = "fadeOutDown 1s ease-in-out";
        container.style.opacity = 0;
    }
    fadeIn() {
        let container = document.getElementById(this.map.id);
        container.style.animation = "fadeInDown 1s ease-in-out";
        container.style.opacity = 1;
    }
    switch(mapData) {
        this.updateDetails(mapData);
    }
}

class Team {
    constructor(seedNumber,teamName,playersData) {
        this.seed = seedNumber;
        this.team = teamName;
        this.playersData = playersData;
        // this.flagSource = flagSource;
        this.seedContainer = document.getElementById("seed");
        this.seedNumber = document.getElementById("seedNumber");
        this.teamSection = document.getElementById("teamSection");
        this.teamName = document.getElementById("teamName");
        this.teamMembers = document.getElementById("teamMembers");
        // this.teamFlag = document.getElementById("teamFlag");
        this.seedText = document.getElementById("seedText");
        this.players = [];
    }
    async generate() {
        this.seedNumber.innerHTML = this.seed;
        this.seedText.innerHTML = this.getNumberSuffix(Number(this.seed));

        this.teamName.innerHTML = this.team;
        // this.teamFlag.style.backgroundImage = this.flagSource != null ? `url(${this.flagSource})`:`url(../../_shared_assets/design/main_banner.png)`;

        for (let i=0; i < 4; i++) {
            let player = new Player(i);
            player.generate(player);
            if (this.playersData[i] != null) {
                let playerData = await this.getUserDataSet(this.playersData[i]);
                player.updatePlayerDetails(`url("http://s.ppy.sh/a/${playerData.user_id}")`,playerData.username,playerData.pp_rank);
            }
            this.players.push(player);
        }
    }
    async getUserDataSet(user_id) {
        try {
            const data = (
                await axios.get("/get_user", {
                    baseURL: "https://osu.ppy.sh/api",
                    params: {
                        k: api,
                        u: user_id,
                        m: 3,
                    },
                })
            )["data"];
            return data.length !== 0 ? data[0] : null;
        } catch (error) {
            console.error(error);
        }
    }
    getNumberSuffix(num) {
        const lastDigit = num % 10;
        const lastTwoDigits = num % 100;
    
        if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
            return 'th';
        }
    
        switch (lastDigit) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    }
    async updateDetails(seedNumber,teamName,playersData) {
        this.seed = seedNumber;
        this.team = teamName;
        this.playersData = playersData;
        // this.flagSource = flagSource;
        
        for (let i=0; i < 4; i++) {
            if (this.playersData[i] != null) {
                let playerData = await this.getUserDataSet(this.playersData[i]);
                this.players[i].updatePlayerDetails(`url("http://s.ppy.sh/a/${playerData.user_id}")`,playerData.username,playerData.pp_rank);
            }
        }

        this.seedNumber.innerHTML = this.seed;
        this.seedText.innerHTML = this.getNumberSuffix(Number(this.seed));
        this.teamName.innerHTML = this.team;
        // this.teamFlag.style.backgroundImage = this.flagSource != null ? `url(${this.flagSource})`:`url(../../_shared_assets/design/main_banner.png)`;
        this.fadeIn();
    }
    async switch(seedNumber,teamName,playersData,modpools,seed) {
        this.fadeOut();
        for(let i=0; i<modpools.length;i++) {
            modpools[i].fadeOut();
        }
        seed.maps.map(async (map,index) => {
            picks[index].fadeOut();
        })
        setTimeout(async function() {
            for(let i=0; i<modpools.length;i++) {
                modpools[i].switch(seed.overallRank[modpools[i].modpoolAcronym]);
            }
            seed.maps.map(async (map,index) => {
                picks[index].switch(map);
            })
            await this.updateDetails(seedNumber, teamName, playersData);
            this.fadeIn();
            for(let i=0; i<modpools.length;i++) {
                modpools[i].fadeIn();
            }
            seed.maps.map(async (map,index) => {
                picks[index].fadeIn();
            })
        }.bind(this),1000);
    }
    fadeIn() {        
        this.seedContainer.style.animation = "fadeInRight 1s ease-in-out";
        this.seedContainer.style.opacity = 1;
        this.teamSection.style.animation = "fadeInRight 1s ease-in-out";
        this.teamSection.style.opacity = 1;
        this.teamMembers.style.animation = "fadeInRight 1s ease-in-out";
        this.teamMembers.style.opacity = 1;
    }
    fadeOut() {
        this.seedContainer.style.animation = "fadeOutRight 1s ease-in-out";
        this.seedContainer.style.opacity = 0;
        this.teamSection.style.animation = "fadeOutRight 1s ease-in-out";
        this.teamSection.style.opacity = 0;
        this.teamMembers.style.animation = "fadeOutRight 1s ease-in-out";
        this.teamMembers.style.opacity = 0;
    }
}

class Player {
    constructor(index) {
        this.index = index;
    }
    generate() {
        let playerContainer = document.getElementById("teamMembers");

        this.player = document.createElement("div");
        this.playerPic = document.createElement("div");
        this.playerDetails = document.createElement("div");
        this.playerName = document.createElement("div");
        this.playerRank = document.createElement("div");

        this.player.id = `${this.index}player`;
        this.playerPic.id = `${this.index}playerPic`;
        this.playerDetails.id = `${this.index}playerDetails`;
        this.playerName.id = `${this.index}playerName`;
        this.playerRank.id = `${this.index}playerRank`;

        this.player.setAttribute("class", "player");
        this.playerPic.setAttribute("class", "playerPic");
        this.playerDetails.setAttribute("class", "playerDetails");
        this.playerName.setAttribute("class", "playerName");
        this.playerRank.setAttribute("class", "playerRank");

        playerContainer.appendChild(this.player);
        document.getElementById(this.player.id).appendChild(this.playerPic);
        document.getElementById(this.player.id).appendChild(this.playerDetails);
        document.getElementById(this.playerDetails.id).appendChild(this.playerName);
        document.getElementById(this.playerDetails.id).appendChild(this.playerRank);
    }
    updatePlayerDetails(pic,name,rank) {
        document.getElementById(this.playerName.id).innerHTML = name;
        document.getElementById(this.playerRank.id).innerHTML = `#${rank}`;
        document.getElementById(this.playerPic.id).style.backgroundImage = pic;
    }
    setNull() {
        document.getElementById(this.playerName.id).innerHTML = "";
        document.getElementById(this.playerRank.id).innerHTML = "";
        document.getElementById(this.playerPic.id).style.backgroundImage = "";
    }
}

function setupInitial() {
    let lastSeed = seedData.find(seed => seed["seed"] === seedData.length) ?? seedData[seedData.length-1];
    for (let mod of modAcronyms) {
        let acronym = mod.split(" ")[0];
        let modpoolText = mod.split(" ")[1];
        const modpool = new Modpool(modpoolText,lastSeed.overallRank[acronym],acronym)
        modpool.generate();
        modpools.push(modpool);
    }

    lastSeed.maps.map(async (map,index) => {
        const pick = new Map(map,index,modpoolStageData.find(mod => mod["stages"].includes(map.pick))["modpool"])
        pick.generate();
        const mapData = await getDataSet(map.beatmapID);
        pick.updateBeatmapDetails(mapData.title,mapData.artist,`url('https://assets.ppy.sh/beatmaps/${mapData.beatmapset_id}/covers/cover.jpg')`);
        picks.push(pick);
    })

    teamController = new Team(lastSeed.seed,lastSeed.teamName,lastSeed.players);
    teamController.generate();
    controllerSeed.innerHTML = teamController.seed;
    currentSeed = teamController.seed;

    console.log(modpools);
    console.log(picks);
}

async function getDataSet(beatmapID) {
    try {
        const data = (
            await axios.get("/get_beatmaps", {
                baseURL: "https://osu.ppy.sh/api",
                params: {
                    k: api,
                    b: beatmapID,
                },
            })
        )["data"];
        return data.length !== 0 ? data[0] : null;
    } catch (error) {
        console.error(error);
    }
};

async function adjustFont(title, boundaryWidth, originalFontSize) {
    if (title.scrollWidth > boundaryWidth) {
		let ratio = (title.scrollWidth/boundaryWidth);
        title.style.fontSize = `${originalFontSize/ratio}px`;
    } else {
		title.style.fontSize = `${originalFontSize}px`;
	}
}

async function updateSeed(currentSeed) {
    let seed = seedData.find(seed => seed["seed"] === currentSeed) ?? seedData[currentSeed-1];
    console.log(seed);
    await teamController.switch(seed.seed,seed.teamName,seed.players,modpools,seed);
}

// BUTTONS //////////////////////////////////////////
controllerNextSeed.addEventListener("click", function(event) {
 if (currentSeed < 2) return;
 currentSeed--;
 controllerSeed.innerHTML = currentSeed;
 updateSeed(currentSeed);
})
controllerPreviousSeed.addEventListener("click", function(event) {
 if (currentSeed >= seedData.length) return;
 currentSeed++;
 controllerSeed.innerHTML = currentSeed;
 updateSeed(currentSeed);
})
controllerNext10Seed.addEventListener("click", function(event) {
    if (currentSeed < 11) return;
    currentSeed-=10;
    controllerSeed.innerHTML = currentSeed;
    updateSeed(currentSeed);
})
controllerPrevious10Seed.addEventListener("click", function(event) {
    if (currentSeed >= seedData.length-9) return;
    currentSeed+=10;
    controllerSeed.innerHTML = currentSeed;
    updateSeed(currentSeed);
})
let sceneController = "seed";
controllerSceneChange.addEventListener("click", function(event) {
    if (sceneController == "seed") {
        sceneController = "showcase";
        controllerSceneChange.style.display = "none";
        stinger.play();
        setTimeout(function() {
            document.getElementById("main").style.opacity = 0;
        },300);
    }
})
controllerNextSeed.onmouseover = function() {
	controllerNextSeed.style.transform = "translateY(-5px)";
}
controllerNextSeed.onmouseleave = function() {
	controllerNextSeed.style.transform = "translateY(0px)";
}
controllerPreviousSeed.onmouseover = function() {
	controllerPreviousSeed.style.transform = "translateY(-5px)";
}
controllerPreviousSeed.onmouseleave = function() {
	controllerPreviousSeed.style.transform = "translateY(0px)";
}
controllerNext10Seed.onmouseover = function() {
	controllerNext10Seed.style.transform = "translateY(-5px)";
}
controllerNext10Seed.onmouseleave = function() {
	controllerNext10Seed.style.transform = "translateY(0px)";
}
controllerPrevious10Seed.onmouseover = function() {
	controllerPrevious10Seed.style.transform = "translateY(-5px)";
}
controllerPrevious10Seed.onmouseleave = function() {
	controllerPrevious10Seed.style.transform = "translateY(0px)";
}
controllerSceneChange.onmouseover = function() {
	controllerSceneChange.style.transform = "translateY(-5px)";
}
controllerSceneChange.onmouseleave = function() {
	controllerSceneChange.style.transform = "translateY(0px)";
}