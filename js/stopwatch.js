import { checkTime } from "../js/script.js";
export function stopwatch() {
    const stopwatchClock  = document.querySelector(".stopwatch-clock");
    const startButton     = document.getElementById("start");
    const resetButton     = document.getElementById("reset");
    const listLaps        = document.querySelector(".laps");
    var stopwatchInterval; // setInterval for stopwatch clock
    var stopwatchStorage = localStorage.getItem("stopwatchStorage"); // Stopwatch time
    var lapStorage = localStorage.getItem("lapStorage");
    var lapCount; // Laps counter
    var ms, s, m, msLap, sLap, mLap;
    
    window.addEventListener("load", function () {
        if (stopwatchStorage == null) { // Stopwatch not started
            m = s = ms = 0;
            stopwatchClock.innerText = `${checkTime(m)}:${checkTime(s)},${checkTime(ms)}`; // Set stopwatch clock at "00:00,00"
            // startButton.addEventListener("click", addLap, {once: true} );
        } else { // Stopwatch was started so using localStorage data for clock and laps
            ms = parseInt(stopwatchStorage.split(",")[1]);
            s = parseInt(stopwatchStorage.split(":")[1].split(",")[0]);
            m = parseInt(stopwatchStorage.split(":")[0]);
            // Save first lap if window reloaded, closed, or loaded
            this.addEventListener("unload", function () {
                localStorage.setItem("firstLapStorage", listLaps.firstChild.innerText);
            })
            // Get first lap data when window is loaded after it was closed/refreshed
            msLap = parseInt(localStorage.getItem("firstLapStorage").split("\n")[1].split(",")[1]);
            sLap = parseInt(localStorage.getItem("firstLapStorage").split("\n")[1].split(":")[1].split(",")[0]);
            mLap = parseInt(localStorage.getItem("firstLapStorage").split("\n")[1].split(":")[0]);
            stopwatchClock.innerText = `${checkTime(m)}:${checkTime(s)},${checkTime(ms)}`; // Set stopwatch clock
            listLaps.innerHTML = lapStorage; // Set list of laps from latest session
            let firstChild = listLaps.firstChild; // First lap in list
            lapCount = Number(listLaps.getElementsByTagName("li").length); // Lap count
            firstChild.innerHTML = `<span>Lap ${lapCount}</span>${checkTime(mLap)}:${checkTime(sLap)},${checkTime(msLap)}`; // Set first lap
        }
    })

    function addLap() { // Add lap on startButton click when list of laps is empty and clock was started yet
        let li = document.createElement("li");
        listLaps.prepend(li);
        lapCount = 1;
        li.innerHTML = `<span>Lap ${lapCount}</span>${checkTime(m)}:${checkTime(s)},${checkTime(ms)}`;
        localStorage.removeItem("lapStorage");
        localStorage.setItem("lapStorage", listLaps.innerHTML);
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
    
    // OLD VERSION NOT SUPPORTING LOCALSTORAGE
    // const zero = "0";
    // let m = 0, s = 0, ms = 0;
    // let min = 0, sec = 0, millsec = 0;
    // let stopwatchInterval, stopLapInterval;
    // var lapCount;
    // stopwatchClock.innerHTML = "00:00,00";
    
    // var stopwatchStorage = localStorage.getItem("stopwatchStorage");
    // stopwatchStorage = stopwatchStorage ? stopwatchStorage.split(",") : [];

    // window.addEventListener("load", function () {
    //     if (localStorage.getItem("stopwatchStorage") !== null) {
    //         // Array.from(localStorage.getItem("stopwatchStorage").split(">,")).forEach(item => {
    //         //     let li = listLaps.appendChild(document.createElement("li"));
    //         //     li.outerHTML = item;
    //         // });
    //         document.querySelector(".stopwatch-clock").innerText = localStorage.getItem("stopwatchStorage");
    //         startButton.innerHTML = "Start";
    //         resetButton.innerHTML = "Reset";
    //         resetButton.classList.add("reset-click");
    //         let ms = parseInt(localStorage.getItem("stopwatchStorage").split(",")[1]);
    //         let s = parseInt(localStorage.getItem("stopwatchStorage").split(":")[1].split(",")[0]);
    //         let m = parseInt(localStorage.getItem("stopwatchStorage").split(":")[0]);
    //         ms++;
    //     } else {
    //         return
    //     }
    // });

    // function startStopwatch() {
    //     ms++;
    //     if (s == 0) {s = "00"};
    //     if (m == 0) {m = "00"};
    //     if (ms > 99) {
    //         ms = 0;
    //         s++;
    //         (s < 10) ? s = zero + s : s;
    //     }
    //     if (s > 59) {
    //         s = 0;
    //         m++;
    //         (m < 10) ? m = zero + m : m;
    //     }
    //     (ms < 10) ? ms = zero + ms : ms;
    //     stopwatchClock.innerHTML = m + ":" + s + "," + ms;
    //     localStorage.setItem("stopwatchStorage", stopwatchClock.innerText);
    // }
    
    // function startLapStopwatch() {
    //     millsec++;
    //     if (sec == 0) {sec = "00"};
    //     if (min == 0) {min = "00"};
    //     if (millsec > 99) {
    //         millsec = 0;
    //         sec++;
    //         (sec < 10) ? sec = zero + sec : sec;
    //     }
    //     if (sec > 59) {
    //         sec = 0;
    //         min++;
    //         (min < 10) ? min = zero + min : min;
    //     }
    //     (millsec < 10) ? millsec = zero + millsec : millsec;

    //     lapCount = (Number(listLaps.getElementsByTagName("li").length) - 1);     //laps counter
    //     listLaps.lastChild.innerHTML =
    //         "<span>" + "Lap: " + lapCount + "</span>" +  min + ":" + sec + "," + millsec;
    // }
      
    // startButton.addEventListener("click", function () {
    //     if (startButton.classList.contains("stop")) {   //if startbutton is red (available to stop)
    //         startButton.onclick = function () { 
    //             startButton.innerHTML = "Start";
    //             resetButton.innerHTML = "Reset";
    //             clearInterval(stopwatchInterval);    //pause stopwatch if startbutton is red (stop)
    //             clearInterval(stopLapInterval);     //pause lap's stopwatch
    //             startButton.classList.remove("stop"); 
    //         };
    //     } else if (!startButton.classList.contains("stop")) {   //if startbutton is not red (no stop available)
    //         startButton.innerHTML = "Start"; 
    //         startButton.onclick = function () {     //on click of startbutton and it is not red
    //             startButton.innerHTML = "Stop";
    //             resetButton.innerHTML = "Lap";
    //             clearInterval(stopwatchInterval);
    //             stopwatchInterval = setInterval(startStopwatch, 10); 
    //             clearInterval(stopLapInterval);
    //             stopLapInterval = setInterval(startLapStopwatch, 10);   //start stopwatch (only in this case)
    //             startButton.classList.add("stop");
    //             resetButton.classList.add("reset-click");
    //             if (Number(listLaps.getElementsByTagName("li").length) == 1) {  //start first lap with stopwatch's start
    //                 clearInterval(stopLapInterval);
    //                 min = 0; sec = 0; millsec = 0;
    //                 stopLapInterval = setInterval(startLapStopwatch, 10);
    //                 listLaps.appendChild(document.createElement("li"));
    //                 lapCount = (Number(listLaps.getElementsByTagName("li").length) - 1);
    //                 listLaps.lastChild.innerHTML =
    //                     "<span>" + "Lap: " + lapCount + "</span>" +  m + ":" + s + "," + ms;
    //             }
    //             resetButton.onclick = function () {     //reset only available if stopwatch started
    //                 if (!startButton.classList.contains("stop")) {
    //                     clearInterval(stopwatchInterval);   //stopwatch started so we can reset only if startbutton is not red
    //                     m = 0; s = 0; ms = 0;
    //                     stopwatchClock.innerHTML = "00:00,00";
    //                     startButton.innerHTML = "Start";
    //                     startButton.classList.remove("stop");
    //                     resetButton.classList.remove("reset-click");
    //                     //reset clicked so delete all laps
    //                     document.querySelectorAll(".laps li").forEach(item => {
    //                         item.remove()
    //                         //remove items from storage
    //                         // stopwatchStorage = [];
    //                         // localStorage.removeItem("stopwatchStorage");
    //                     });
    //                     listLaps.appendChild(document.createElement("li")).innerHTML = "00:00,00";
    //                 } else if (startButton.classList.contains("stop")){     //if startbutton is red then no reset, but create a lap
    //                     let li = listLaps.appendChild(document.createElement("li"));     //create new lap in list
    //                     clearInterval(stopLapInterval);
    //                     min = 0; sec = 0; millsec = 0;
    //                     stopLapInterval = setInterval(startLapStopwatch, 10); //start new timer in every new list item
    //                     lapCount = (Number(listLaps.getElementsByTagName("li").length) - 1);
    //                     listLaps.lastChild.innerHTML =
    //                     "<span>" + "Lap: " + lapCount + "</span>" +  m + ":" + s + "," + ms;
    //                     // stopwatchStorage.push(li.outerHTML);
    //                     // localStorage.setItem("stopwatchStorage", stopwatchStorage.toString());
    //                 }   
    //             }
    //         }
    //     }
    // });

    // startButton.onclick = function () { 
    //     clearInterval(stopwatchInterval);
    //     startButton.classList.toggle("stop")
    // }
}
