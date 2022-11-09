document.body.onload = showTime(), stopWatch();

function showTime() {
    const date       = new Date();
    let hours        = date.getHours();
    let minutes      = date.getMinutes();
    let seconds      = date.getSeconds();

    hours   = checkTime(hours);
    minutes = checkTime(minutes);
    seconds = checkTime(seconds);

    document.querySelector(".clock").innerHTML =  hours + ":" + minutes + ":" + seconds;
    setTimeout(showTime, 1000);

    function checkTime(i) {
        if (i < 10) {i = "0" + i};
        return i;
    }
}

function stopWatch() {
    var m = 0, s = 0, ms = 0;
    var stopWatchInterval;
    var zero = "0";
    
    stopWatchClock = document.querySelector(".stopwatch-clock");
    startButton    = document.getElementById("start");
    stopButton     = document.getElementById("stop");
    resetButton    = document.getElementById("reset");

    stopWatchClock.innerHTML = "00:00,00";

    function startStopWatch() {
        ms++;
        if (s == 0) {s = "00"};
        if (m == 0) {m = "00"};
        if (ms > 99) {
            ms = 0;
            s++;
            (s < 10) ? s = zero + s: s;
        }
        if (s > 59) {
            s = 0;
            m++;
            (m < 10) ? m = zero + m : m;
        }
        (ms < 10) ? ms = zero + ms : ms;
        stopWatchClock.innerHTML = m + ":" + s + "," + ms;
    }
    
    startButton.addEventListener("click", function () {
        if (startButton.classList.contains("stop")) {
            startButton.onclick = function () { 
                startButton.innerHTML = "Start";
                resetButton.innerHTML = "Reset";
                clearInterval(stopWatchInterval);
                startButton.classList.remove("stop");
            };
        } else if (!startButton.classList.contains("stop")) {
            startButton.innerHTML = "Start";
            startButton.onclick = function () {
                startButton.innerHTML = "Stop";
                resetButton.innerHTML = "Lap";
                clearInterval(stopWatchInterval);
                stopWatchInterval = setInterval(startStopWatch, 10);
                startButton.classList.add("stop");
                resetButton.classList.add("reset-click");
                resetButton.onclick = function () {
                    if (!startButton.classList.contains("stop")) {
                        clearInterval(stopWatchInterval); 
                        m = 0; s = 0; ms = 0;
                        stopWatchClock.innerHTML = "00:00,00";
                        startButton.innerHTML = "Start";
                        startButton.classList.remove("stop");
                        resetButton.classList.remove("reset-click");
                        for(var i = 0; li = document.querySelector(".laps li"); i++) {
                            li.parentNode.removeChild(li);
                        }
                    } else {
                        document.querySelector(".laps").appendChild(document.createElement("li")).innerHTML = m + ":" + s + "," + ms;
                    } 
                    convertStringToInteger();
                    // for(var i = 0; li = document.querySelector(".laps li"); i++) {
                        // return console.log(Math.max(m),Math.max(s),Math.max(ms))
                    // }
                    function convertStringToInteger () {
                        secondLastLap        = document.querySelector(".laps").lastChild.previousSibling.innerHTML;
                        lastLap              = document.querySelector(".laps").lastChild.innerHTML;
                        minSecondLastLap     = parseInt(secondLastLap.slice(0, 2), 10);
                        secSecondLastLap     = parseInt(secondLastLap.slice(3, 5), 10);
                        millsecSecondLastLap = parseInt(secondLastLap.slice(6, 8), 10);
                        minLastLap           = parseInt(lastLap.slice(0, 2), 10);
                        secLastLap           = parseInt(lastLap.slice(3, 5), 10);
                        millsecLastLap       = parseInt(lastLap.slice(6, 8), 10);
                        console.log(Math.abs((m - minSecondLastLap)) + ":" + Math.abs((s - secSecondLastLap)) + "," + Math.abs((ms - millsecSecondLastLap)))
                    }
                }
            };
        };
    });

    

    startButton.onclick = function () { 
        clearInterval(stopWatchInterval);
        startButton.classList.toggle("stop")
    };
}