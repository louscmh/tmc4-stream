// HTML VARS /////////////////////////////////////////////////////////////////
let currentStage;
let stageTime;
let stageElement = document.getElementById("stageText");
let matchButton = document.getElementById("matchButton");
let pauseButton = document.getElementById("pauseButton");
let resetButton = document.getElementById("resetButton");
let addButton = document.getElementById("addButton");
let reduceButton = document.getElementById("reduceButton");
let addButton2 = document.getElementById("addButton2");
let hideButton = document.getElementById("hideButton");
let currentPhaseMatch = "starting";
let currentPhaseEnding = "match";

// BUTTONS //////////////////////////////////////////
matchButton.addEventListener("click", function(event) {
    if (currentPhaseEnding == "match") {
        if (currentPhaseMatch == "starting") {
            currentPhaseMatch = "maps";
            matchButton.innerHTML = "GO BACK TO INTRO";
            matchButton.style.backgroundColor = "#3f3f3f";
            toggleMatch();
        } else if (currentPhaseMatch == "maps") {
            currentPhaseMatch = "starting";
            matchButton.innerHTML = "REVEAL MATCH";
            matchButton.style.backgroundColor = "rgb(149, 59, 45)";
            endingButton.style.backgroundColor = "#3f3f3f";
            unToggleMatch();
        }
    }
})
matchButton.onmouseover = function() {
	matchButton.style.transform = "translateY(-5px)";
}
matchButton.onmouseleave = function() {
	matchButton.style.transform = "translateY(0px)";
}
// END
endingButton.addEventListener("click", function(event) {
    if (currentPhaseMatch == "maps") {
        if (currentPhaseEnding == "match") {
            currentPhaseEnding = "ending";
            endingButton.innerHTML = "GO BACK TO MATCH";
            matchButton.style.backgroundColor = "#3f3f3f";
            toggleEnding();
        } else if (currentPhaseEnding == "ending") {
            currentPhaseEnding = "match";
            endingButton.innerHTML = "REVEAL ENDING";
            matchButton.style.backgroundColor = "rgb(149, 59, 45)";
            unToggleEnding();
        }
    }
})
endingButton.onmouseover = function() {
	endingButton.style.transform = "translateY(-5px)";
}
endingButton.onmouseleave = function() {
	endingButton.style.transform = "translateY(0px)";
}
// RESET
let isPaused = false;
pauseButton.addEventListener("click", function(event) {
    pauseButton.innerHTML = isPaused ? "PAUSE TIMER" : "UNPAUSE TIMER";
    isPaused = isPaused ? false : true;
})
pauseButton.onmouseover = function() {
	pauseButton.style.transform = "translateY(-5px)";
}
pauseButton.onmouseleave = function() {
	pauseButton.style.transform = "translateY(0px)";
}
// RESET
resetButton.addEventListener("click", function(event) {
    resetTimer();
})
resetButton.onmouseover = function() {
	resetButton.style.transform = "translateY(-5px)";
}
resetButton.onmouseleave = function() {
	resetButton.style.transform = "translateY(0px)";
}
// ADD
addButton.addEventListener("click", function(event) {
    addTimer();
})
addButton.onmouseover = function() {
	addButton.style.transform = "translateY(-5px)";
}
addButton.onmouseleave = function() {
	addButton.style.transform = "translateY(0px)";
}
// REDUCE
reduceButton.addEventListener("click", function(event) {
    removeTimer();
})
reduceButton.onmouseover = function() {
	reduceButton.style.transform = "translateY(-5px)";
}
reduceButton.onmouseleave = function() {
	reduceButton.style.transform = "translateY(0px)";
}
// ADD 5 MINUTES
addButton2.addEventListener("click", function(event) {
    addTimerMinute();
})
addButton2.onmouseover = function() {
	addButton2.style.transform = "translateY(-5px)";
}
addButton2.onmouseleave = function() {
	addButton2.style.transform = "translateY(0px)";
}
// HIDE
let isHidden = false;
hideButton.addEventListener("click", function(event) {
    const countdownElement = document.getElementById("countdown");
    isHidden ? countdownElement.style.display = "initial" : countdownElement.style.display = "none";
    isHidden ? hideButton.innerHTML = "HIDE TIMER" : hideButton.innerHTML = "REVEAL TIMER";
    isHidden ? isHidden = false : isHidden = true;
})
hideButton.onmouseover = function() {
	hideButton.style.transform = "translateY(-5px)";
}
hideButton.onmouseleave = function() {
	hideButton.style.transform = "translateY(0px)";
}

let timeRemaining = 5 * 60; // 5 minutes in seconds

function startCountdown() {

    function updateCountdown() {
        const countdownElement = document.getElementById("countdown");
        const countdownElement2 = document.getElementById("countdown2");
        
        if (timeRemaining <= 0) {
            countdownElement.textContent = "00:00";
            countdownElement2.textContent = "00:00:00";
            clearInterval(interval);
            return;
        }

        if (!isPaused) {
            // Calculate hours, minutes, and seconds
            const minutes = Math.floor((timeRemaining / 60) % 60);
            const seconds = timeRemaining % 60;
            const hours = Math.floor((timeRemaining / 3600) % 24);
    
            // Format as 2-digit strings
            const formattedMinutes = String(minutes).padStart(2, "0");
            const formattedSeconds = String(seconds).padStart(2, "0");
            const formattedHours = String(hours).padStart(2, "0");
    
            // Update the countdown elements
            countdownElement.textContent = `${formattedMinutes}:${formattedSeconds}`;
            countdownElement2.textContent = `${formattedMinutes}:${formattedSeconds}`;
            
            timeRemaining--; // Decrease time
        }
    }

    // Start the interval to update every second
    const interval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Run immediately to avoid initial delay
}

function resetTimer() {
    timeRemaining = 5 * 60;
}

function addTimer() {
    timeRemaining += 60;
}

function removeTimer() {
    timeRemaining -= 60;
}

function addTimerMinute() {
    timeRemaining += 5 * 60;
}

function toggleMatch() {
    let bgVideoStart = document.getElementById("bgVideoStart");
    let countdownElement = document.getElementById("countdown");
    let showcaseScene = document.getElementById("main");

    countdownElement.style.animation = "countdownMove 1.5s ease-in-out";
    countdownElement.style.transform = "scaleX(0.65437) translateY(1200px)";
    countdownElement.style.opacity = "0";

    setTimeout(function() {
        showcaseScene.style.animation = "endingOut 2s cubic-bezier(0.000, 0.125, 0.000, 1.005)";
        showcaseScene.style.clipPath = "polygon(0% 0%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%, 100% 100%, 100% 0%)";
        matchButton.style.backgroundColor = "rgb(149, 59, 45)";
        endingButton.style.backgroundColor = "rgb(149, 59, 45)";
    },1500);

    setTimeout(function() {
        bgVideoStart.pause();
    },3000);
};

function unToggleMatch() {
    let bgVideoStart = document.getElementById("bgVideoStart");
    let countdownElement = document.getElementById("countdown");
    let showcaseScene = document.getElementById("main");

    bgVideoStart.play();
    countdownElement.style.animation = "";
    countdownElement.style.transform = "scaleX(0.65437) translateY(84px)";
    countdownElement.style.opacity = "0.4";
    showcaseScene.style.animation = "endingIn 2s cubic-bezier(0.000, 0.125, 0.000, 1.005)";
    showcaseScene.style.clipPath = "polygon(0% 0%, 0 50%, 100% 50%, 100% 50%, 0 50%, 0 100%, 100% 100%, 100% 0%)";
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
    showcaseScene.style.animation = "endingIn 2s cubic-bezier(0.000, 0.125, 0.000, 1.005)";
    showcaseScene.style.opacity = 1;

    setTimeout(function() {
        side.style.opacity = 1;
        side.style.animation = "endingScaleIn 1s  cubic-bezier(0.000, 0.990, 0.320, 1.010)";
        center.style.opacity = 1;
        center.style.animation = "endingScaleInTwo 1s  cubic-bezier(0.000, 0.990, 0.320, 1.010)";
    },2200);
};

function unToggleEnding() {
    console.log("happened");
    let showcaseScene = document.getElementById("main");
    let bgVideoStart = document.getElementById("bgVideoStart");
    let bgStarting = document.getElementById("bgStarting");
    let bgVideoEnd = document.getElementById("bgVideoEnd");
    let bgEnding = document.getElementById("bgEnding");

    showcaseScene.style.animation = "endingOut 2s cubic-bezier(0.000, 0.125, 0.000, 1.005)";
    showcaseScene.style.clipPath = "polygon(0% 0%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%, 100% 100%, 100% 0%)";
    side.style.animation = "";
    center.style.animation = "";

    setTimeout(function() {
        bgVideoEnd.pause();
        bgEnding.style.opacity = 0;
        bgVideoStart.play();
        bgStarting.style.opacity = 1;
    },2200);

};

function fadeOut() {
    console.log("happened");
    let showcaseScene = document.getElementById("main");
    showcaseScene.style.animation = "fadeOut 2s ease-in-out";
    
    setTimeout(function() {
        showcaseScene.style.opacity = "0";
    },1500);

};

startCountdown();