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

// SHOWCASE DATES DATA /////////////////////////////////////////////////////////////////
let dates = [];
(async () => {
    try {
        const jsonData = await $.getJSON("../../_data/showcase_dates.json");
        jsonData.map((stage) => {
            dates.push(stage);
        });
        [currentStage, stageTime] = await getCurrentStage()
        console.log(currentStage);
        console.log(stageTime);
        stageElement.innerHTML = currentStage;
        startCountdown(stageTime);
    } catch (error) {
        console.error("Could not read JSON file", error);
    }
})();

// HTML VARS /////////////////////////////////////////////////////////////////
let currentStage;
let stageTime;
let stageElement = document.getElementById("stageText");
let showcaseButton = document.getElementById("showcaseButton");
let stinger = document.getElementById("transitionVideo");
let currentPhase = "starting";
let showcase_1 = document.getElementById("showcase_asset_1");
let showcase_2 = document.getElementById("showcase_asset_2");

// BUTTONS //////////////////////////////////////////
showcaseButton.addEventListener("click", function(event) {
    if (currentPhase == "starting") {
        showcaseButton.innerHTML = "SHOW CLIENT";
        showcaseButton.style.backgroundColor = "#3f3f3f";
        toggleShowcase();
    } else if (currentPhase == "showcase") {
        currentPhase = "maps";
        showcaseButton.innerHTML = "ENDING";
        showcaseButton.style.backgroundColor = "rgb(149, 59, 45)";
        stinger.play();
        setTimeout(function() {
            document.getElementById("main").style.opacity = "0";
        },300)
        // fadeOut();
    } else if (currentPhase == "maps") {
        currentPhase = "ending";
        toggleEnding();
    }
})
showcaseButton.onmouseover = function() {
	showcaseButton.style.transform = "translateY(-5px)";
}
showcaseButton.onmouseleave = function() {
	showcaseButton.style.transform = "translateY(0px)";
}

async function getCurrentStage() {
    try {
        var date = new Date();
        var day = date.getUTCDate();
        var month = date.getUTCMonth() + 1;
        var year = date.getUTCFullYear();

        for (let i = 0; i < dates.length; i++) {
            let stage = dates[i];
            let stageDate = parseDateTime(stage["time"]);

            let stageDay = stageDate.getUTCDate();
            let stageMonth = stageDate.getUTCMonth() + 1;
            let stageYear = stageDate.getUTCFullYear();

            if (stageDay === day && stageMonth === month && stageYear === year) {
                return [stage["stage"], stageDate];
            }
        }

        return ["No Stage Detected",null];
    } catch (e) {
        console.error("An error occurred:", e);
        return ["Error",null];
    }
}

function parseDateTime(dateTimeString) {
    // console.log(dateTimeString);
    if (dateTimeString == "") return null;

    const [datePart, timePart] = dateTimeString.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);
    return new Date(Date.UTC(year, month - 1, day, hours, minutes));
}

function startCountdown(targetDate) {
    const countdownElement = document.getElementById("countdown");
    const countdownElement2 = document.getElementById("countdown2");

    function updateCountdown() {
        const now = new Date();
        const timeDifference = targetDate - now;

        if (timeDifference <= 0) {
            // Stop the countdown when the time is up
            countdownElement.textContent = "00:00";
            clearInterval(interval);
            return;
        }

        // Calculate minutes and seconds
        const minutes = Math.floor((timeDifference / 1000 / 60) % 60);
        const seconds = Math.floor((timeDifference / 1000) % 60);
        const hours = Math.floor((timeDifference / 1000 / 60 / 60) % 24);

        // Format as 2-digit strings
        const formattedMinutes = String(minutes).padStart(2, "0");
        const formattedSeconds = String(seconds).padStart(2, "0");
        const formattedHours = String(hours).padStart(2, "0");

        // Update the countdown element
        countdownElement.textContent = `${formattedMinutes}:${formattedSeconds}`;
        countdownElement2.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }

    // Start the interval to update every second
    const interval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Run immediately to avoid initial delay
}

function toggleShowcase() {
    console.log("happened");
    let countdownElement = document.getElementById("countdown");
    let showcaseScene = document.getElementById("main");

    countdownElement.style.animation = "countdownMove 1.5s ease-in-out";
    countdownElement.style.transform = "scaleX(0.65437) translateY(1200px)";
    countdownElement.style.opacity = "0";

    setTimeout(function() {
        showcaseScene.style.animation = "showcaseMove 2s cubic-bezier(0.000, 0.125, 0.000, 1.005)";
        showcaseScene.style.transform = "scale(0.906458333)";
        showcaseScene.style.clipPath = "inset(43px 0 43px 0)";
    },1500);

    setTimeout(function() {
        showcase_1.style.animation = "fadeInUp 1s cubic-bezier(0.000, 0.125, 0.000, 1.005)";
        showcase_1.style.opacity = 1;
        showcase_2.style.animation = "fadeInDown 1s cubic-bezier(0.000, 0.125, 0.000, 1.005)";
        showcase_2.style.opacity = 1;
        currentPhase = "showcase";
        showcaseButton.style.backgroundColor = "#a3276d";
    },3000);

};

function toggleEnding() {
    console.log("happened");
    let showcaseScene = document.getElementById("main");
    let bgVideoStart = document.getElementById("bgVideoStart");
    let bgStarting = document.getElementById("bgStarting");
    let bgVideoEnd = document.getElementById("bgVideoEnd");
    let bgEnding = document.getElementById("bgEnding");
    let center = document.getElementById("center");
    let side = document.getElementById("side");

    bgVideoStart.pause();
    bgStarting.style.opacity = 0;
    bgVideoEnd.play();
    bgEnding.style.opacity = 1;
    center.style.opacity = 0;
    side.style.opacity = 0;

    showcaseScene.style.zIndex = 5;
    showcaseScene.style.transform = "scale(1)";
    showcaseScene.style.clipPath = "";
    showcaseScene.style.animation = "endingIn 1.5s cubic-bezier(0.000, 0.125, 0.000, 1.005)";
    showcaseScene.style.opacity = 1;

    setTimeout(function() {
        side.style.opacity = 1;
        side.style.animation = "endingScaleIn 1s  cubic-bezier(0.000, 0.990, 0.320, 1.010)";
        center.style.opacity = 1;
        center.style.animation = "endingScaleInTwo 1s  cubic-bezier(0.000, 0.990, 0.320, 1.010)";
    },1700);
};

function fadeOut() {
    console.log("happened");
    let showcaseScene = document.getElementById("main");
    showcaseScene.style.animation = "fadeOut 2s ease-in-out";
    
    setTimeout(function() {
        showcaseScene.style.opacity = "0";
    },1500);

};