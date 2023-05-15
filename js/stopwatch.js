import { checkTime } from "../js/script.js";
export function stopwatch() {
    const stopwatchClock  = document.querySelector(".stopwatch-clock");
    const startButton     = document.getElementById("start");
    const resetButton     = document.getElementById("reset");
    const listLaps        = document.querySelector(".laps");
    var stopwatchInterval; // setInterval for stopwatch clock
    var stopwatchStorage = localStorage.getItem("stopwatchStorage"); // Stopwatch time
    var lapStorage       = localStorage.getItem("lapStorage");
    var firstLapStorage  = localStorage.getItem("firstLapStorage");
    var lapCount; // Laps counter
    var ms, s, m, msLap, sLap, mLap;
    
    stopwatchClock.innerText = "00:00,00";
    window.addEventListener("load", function () {
        if (stopwatchStorage == null) { // Stopwatch not started
            m = s = ms = 0;
            mLap = sLap = msLap = 0;
            stopwatchClock.innerText = `${checkTime(m)}:${checkTime(s)},${checkTime(ms)}`; // Set stopwatch clock at "00:00,00"
            // startButton.addEventListener("click", addLap, {once: true} );
        } else { // Stopwatch was started so using localStorage data for clock and laps
            ms = parseInt(stopwatchStorage.split(",")[1]);
            s = parseInt(stopwatchStorage.split(":")[1].split(",")[0]);
            m = parseInt(stopwatchStorage.split(":")[0]);
            // Get first lap data when window is loaded after it was closed/refreshed
            msLap = parseInt(firstLapStorage.split("\n")[1].split(",")[1]);
            sLap = parseInt(firstLapStorage.split("\n")[1].split(":")[1].split(",")[0]);
            mLap = parseInt(firstLapStorage.split("\n")[1].split(":")[0]);
            stopwatchClock.innerText = `${checkTime(m)}:${checkTime(s)},${checkTime(ms)}`; // Set stopwatch clock
            listLaps.innerHTML = lapStorage; // Set list of laps from latest session
            lapCount = Number(listLaps.getElementsByTagName("li").length); // Lap count
            listLaps.firstChild.innerHTML = `<span>Lap ${lapCount}</span>${checkTime(mLap)}:${checkTime(sLap)},${checkTime(msLap)}`; // Set first lap
        }
    })

    setTimeout(() => {
        if (listLaps.scrollHeight > listLaps.clientHeight) {document.querySelector("menu").classList.add("scrolling")}
    }, 20);
    
    function addLap() { // Add lap on startButton click when list of laps is empty and clock was started yet
        let li = document.createElement("li");
        listLaps.prepend(li);
        lapCount = 1;
        li.innerHTML = `<span>Lap ${lapCount}</span>${checkTime(m)}:${checkTime(s)},${checkTime(ms)}`;
        localStorage.removeItem("lapStorage");
        localStorage.removeItem("firstLapStorage");
        localStorage.setItem("lapStorage", listLaps.innerHTML);
        localStorage.setItem("firstLapStorage", listLaps.firstChild.innerText);
    }
    
    function reset() { // Remove setInterval, set time to 0, remove laps from list, clear localStorage
        clearInterval(stopwatchInterval);
        m = s = ms = 0;
        mLap = sLap = msLap = 0;
        stopwatchClock.innerText = `${checkTime(m)}:${checkTime(s)},${checkTime(ms)}`;
        listLaps.querySelectorAll("li").forEach(item => {
            item.remove();
        });
        localStorage.removeItem("stopwatchStorage");
        localStorage.removeItem("lapStorage");
        localStorage.removeItem("firstLapStorage");
    }

    function startStopwatch() { // main function that runs stopwatch
        ms++;
        if (ms >= 100) { ms = 0; s = s + 1 }
        if (s >= 60) { s = 0; m = m + 1 }
        msLap++;
        if (msLap >= 100) { msLap = 0; sLap = sLap + 1 }
        if (sLap >= 60) { sLap = 0; mLap = mLap + 1 }
        stopwatchClock.innerText = `${checkTime(m)}:${checkTime(s)},${checkTime(ms)}`;
        listLaps.firstChild.innerHTML = `<span>Lap ${lapCount}</span>${checkTime(mLap)}:${checkTime(sLap)},${checkTime(msLap)}`;
        localStorage.setItem("stopwatchStorage", stopwatchClock.innerText);
        localStorage.setItem("firstLapStorage", listLaps.firstChild.innerText);
    }
    
    startButton.addEventListener("click", function () {
        if (this.classList.contains("stop")) { // Stop
            clearInterval(stopwatchInterval);
            this.classList.remove("stop");
            this.innerText = "Start";
            resetButton.classList.remove("lap");
            resetButton.innerText = "Reset";
            localStorage.removeItem("lapStorage");
            localStorage.setItem("lapStorage", listLaps.innerHTML);
        } else { // Start
            this.classList.add("stop");
            this.innerText = "Stop";
            resetButton.classList.add("lap");
            resetButton.innerText = "Lap";
            clearInterval(stopwatchInterval);
            stopwatchInterval = setInterval(startStopwatch, 10);
        }
        if (listLaps.childElementCount == 0) { // Create first lap in list if list is empty
            addLap();
        }
    })
    resetButton.addEventListener("click", function () {
        if (this.classList.contains("lap")) { // Lap
            let li = document.createElement("li");
            listLaps.prepend(li);
            lapCount = Number(listLaps.getElementsByTagName("li").length);
            li.innerHTML = `<span>Lap ${lapCount}</span>${checkTime(mLap)}:${checkTime(sLap)},${checkTime(msLap)}`;
            localStorage.removeItem("lapStorage");
            localStorage.removeItem("firstLapStorage");
            localStorage.setItem("lapStorage", listLaps.innerHTML);
            // Start new lap with new stopwatch
            msLap = sLap = mLap = 0;
        } else { // Reset
            this.classList.remove("lap");
            this.innerText = "Reset";
            startButton.classList.remove("stop");
            startButton.innerText = "Start";
            reset();
        }
    })
    
    listLaps.addEventListener("scroll", function () {
        if (this.scrollTop >= (this.scrollHeight - this.offsetHeight)) {
            document.querySelector("menu").classList.remove("scrolling");
        } else {
            document.querySelector("menu").classList.add("scrolling");
        }
    })

    function observeChanges() {
        // code here used from MDN Web Docs https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
        const targetNode = listLaps;
        // Options for the observer (which mutations to observe)
        const config = { attributes: false, childList: true, subtree: false };
        // Callback function to execute when mutations are observed
        const callback = (mutationList, observer) => {
            const menu = document.querySelector("menu");
            for (const mutation of mutationList) {
                if (mutation.type === "childList" && targetNode.scrollHeight > targetNode.clientHeight) {
                    menu.classList.add("scrolling");
                } else {
                    menu.classList.remove("scrolling");
                }
            }
        };
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);
        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    }
    observeChanges();
}