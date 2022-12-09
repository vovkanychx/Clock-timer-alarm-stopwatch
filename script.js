document.querySelector(".clock").onload = clock();
document.querySelector(".stopwatch").onload = stopWatch();
document.querySelector(".timer").onload = timer();

function checkTime(i) { //add a zero to have 2 digits in clock
    if (i < 10) {i = "0" + i}; 
    return i;
}

function clock() {
    const date  = new Date();
    hours   = date.getHours();
    minutes = date.getMinutes();
    seconds = date.getSeconds();

    hours   = checkTime(hours);
    minutes = checkTime(minutes);
    seconds = checkTime(seconds);

    document.querySelector(".clock").innerHTML =  hours + ":" + minutes + ":" + seconds;
    setTimeout(clock, 1000);
}

function stopWatch() {
    let m = 0, s = 0, ms = 0;
    let min = 0, sec = 0, millsec = 0;
    let stopWatchInterval, stopLapInterval;
    let zero = "0";

    stopWatchClock  = document.querySelector(".stopwatch-clock");
    let startButton = document.getElementById("start");
    let resetButton = document.getElementById("reset");
    listLaps        = document.querySelector(".laps");

    stopWatchClock.innerHTML = "00:00,00";

    function startStopWatch() {
        ms++;
        if (s == 0) {s = "00"};
        if (m == 0) {m = "00"};
        if (ms > 99) {
            ms = 0;
            s++;
            (s < 10) ? s = zero + s : s;
        }
        if (s > 59) {
            s = 0;
            m++;
            (m < 10) ? m = zero + m : m;
        }
        (ms < 10) ? ms = zero + ms : ms;
        
        stopWatchClock.innerHTML = m + ":" + s + "," + ms;
    }
    
    function startLapWatch() {
        millsec++;
        if (sec == 0) {sec = "00"};
        if (min == 0) {min = "00"};
        if (millsec > 99) {
            millsec = 0;
            sec++;
            (sec < 10) ? sec = zero + sec : sec;
        }
        if (sec > 59) {
            sec = 0;
            min++;
            (min < 10) ? min = zero + min : min;
        }
        (millsec < 10) ? millsec = zero + millsec : millsec;

        lapCount = (Number(listLaps.getElementsByTagName("li").length) - 1);     //laps counter
        listLaps.lastChild.innerHTML =
        "<span>" + "Lap: " + lapCount + "</span>" +  min + ":" + sec + "," + millsec;
    }
      
    startButton.addEventListener("click", function () {
        if (startButton.classList.contains("stop")) {   //if startbutton is red (available to stop)
            startButton.onclick = function () { 
                startButton.innerHTML = "Start";
                resetButton.innerHTML = "Reset";
                clearInterval(stopWatchInterval);    //pause stopwatch if startbutton is red (stop)
                clearInterval(stopLapInterval);     //pause lap's stopwatch
                startButton.classList.remove("stop"); 
            };
        } else if (!startButton.classList.contains("stop")) {   //if startbutton is not red (no stop available)
            startButton.innerHTML = "Start"; 
            startButton.onclick = function () {     //on click of startbutton and it is not red
                startButton.innerHTML = "Stop";
                resetButton.innerHTML = "Lap";
                clearInterval(stopWatchInterval);
                stopWatchInterval = setInterval(startStopWatch, 10); 
                clearInterval(stopLapInterval);
                stopLapInterval = setInterval(startLapWatch, 10);   //start stopwatch (only in this case)
                startButton.classList.add("stop");
                resetButton.classList.add("reset-click");
                if (Number(listLaps.getElementsByTagName("li").length) == 1) {  //start first lap with stopwatch's start
                    clearInterval(stopLapInterval);
                    min = 0; sec = 0; millsec = 0;
                    stopLapInterval = setInterval(startLapWatch, 10);
                    listLaps.appendChild(document.createElement("li"));
                    lapCount = (Number(listLaps.getElementsByTagName("li").length) - 1);
                    listLaps.lastChild.innerHTML =
                    "<span>" + "Lap: " + lapCount + "</span>" +  m + ":" + s + "," + ms;
                }
                resetButton.onclick = function () {     //reset only available if stopwatch started
                    if (!startButton.classList.contains("stop")) {
                        clearInterval(stopWatchInterval);   //stopwatch started so we can reset only if startbutton is not red
                        m = 0; s = 0; ms = 0;
                        stopWatchClock.innerHTML = "00:00,00";
                        startButton.innerHTML = "Start";
                        startButton.classList.remove("stop");
                        resetButton.classList.remove("reset-click");
                        for (let i = 0; li = document.querySelector(".laps li"); i++) {     //reset means delete all previous laps
                            li.parentNode.removeChild(li);
                        }
                        listLaps.appendChild(document.createElement("li")).innerHTML = "00:00,00";
                    } else if (startButton.classList.contains("stop")){     //if startbutton is red then no reset, but create a lap
                        listLaps.appendChild(document.createElement("li"));     //create new lap in list
                        clearInterval(stopLapInterval);
                        min = 0; sec = 0; millsec = 0;
                        stopLapInterval = setInterval(startLapWatch, 10); //start new timer in every new list item
                        lapCount = (Number(listLaps.getElementsByTagName("li").length) - 1);
                        listLaps.lastChild.innerHTML =
                        "<span>" + "Lap: " + lapCount + "</span>" +  m + ":" + s + "," + ms;
                    }   
                }
            }
        }
    });

    startButton.onclick = function () { 
        clearInterval(stopWatchInterval);
        startButton.classList.toggle("stop")
    }
}

function timer () {
    hoursList        = document.getElementById("hours");
    minutesList      = document.getElementById("minutes");
    secondsList      = document.getElementById("seconds");
    showHour         = document.querySelector(".timer-clock .hour");
    showMinute       = document.querySelector(".timer-clock .minute");
    showSecond       = document.querySelector(".timer-clock .second");
    let startButton  = document.getElementById("start-pause");
    let cancelButton = document.getElementById("cancel");
    let timerInterval;

    document.querySelector(".timer-container").onwheel = function() { return false; } // disable window scroll when scrolling on container

    //create list select options (list items 0-23h 0-59m/s)
    function createListItems(list, lastItem) {
        for(let i = 0; i < lastItem; i++ ) {
            list.appendChild(document.createElement("div"));
            list.lastChild.innerHTML = i + " ";
        }
    }

    function scrollClick (active, list) {
        active = 0;
        list.getElementsByTagName("div")[Math.abs(active)].classList.add("active"); //first elements are active (00:00,00)
        list.addEventListener('wheel', (e) => {
            e.preventDefault(); //disable scrolling
            if (e.deltaY < 0) { //if scrolling up
                if (active <= parseInt(list.firstElementChild.textContent)) { //stop scrolling if it's top
                    return
                } else {
                    list.getElementsByTagName("div")[Math.abs(active - 1)].scrollIntoView({behavior: "smooth", block: "center"})
                    --active;
                    list.getElementsByTagName("div")[Math.abs(active + 1)].classList.remove("active");
                    list.getElementsByTagName("div")[Math.abs(active)].classList.add("active");
                }
            } 
            else if (e.deltaY > 0) { //if scrolling down
                if (active >= parseInt(list.lastElementChild.textContent)) { //stop scrolling if it's bottom
                    return
                } else {
                    list.getElementsByTagName("div")[Math.abs(active + 1)].scrollIntoView({behavior: "smooth", block: "center"})
                    active++;
                    list.getElementsByTagName("div")[Math.abs(active - 1)].classList.remove("active");
                    list.getElementsByTagName("div")[Math.abs(active)].classList.add("active");
                }
            }
        });

        for (let i = 0; i < list.getElementsByTagName("div").length; i++){
            list.getElementsByTagName("div")[i].onclick = function () { //move to option if clicked
                list.querySelectorAll("div").forEach(el => { //if clicked remove any current active class
                    el.classList.remove("active");
                });
                active = i; //new assign so we can scroll and click without having an error
                list.getElementsByTagName("div")[Math.abs(active)].scrollIntoView({behavior: "smooth", block: "center"});
                list.getElementsByTagName("div")[Math.abs(active)].classList.add("active");
            }
        }
    }

    createListItems(hoursList, 24), createListItems(minutesList, 60), createListItems(secondsList, 60);
    scrollClick(0, hoursList), scrollClick(0, minutesList), scrollClick(0, secondsList);

    function startTimer() {
        if (selectedHour == 0 && selectedMinute == 0 && selectedSecond == 0) {
            showHour.innerHTML   = "00";
            showMinute.innerHTML = "00";
            showSecond.innerHTML = "00";
            startButton.classList.remove("pause");
            cancelButton.classList.remove("cancel");
            startButton.innerHTML = "Start";
            return
        }
        if (selectedSecond < 0) {
            selectedSecond = 59; 
            if (selectedMinute > 0) {selectedMinute-- } 
            else {selectedMinute = 0}
        }
        if (selectedMinute < 0) {
            selectedMinute = 59;
            if (selectedHour > 0) {selectedHour--}
            else (selectedHour = 0)
        }
        if (selectedHour > 0 && selectedMinute == 0 && selectedSecond == 0) {
            selectedHour   = selectedHour;
            selectedMinute = 59;
            selectedSecond = 59;
            selectedHour   = selectedHour - 1;
        }

        showHour.innerText   = checkTime(selectedHour);
        showMinute.innerText = checkTime(selectedMinute);
        showSecond.innerText = checkTime(selectedSecond);
        
        --selectedSecond
    }

    startButton.addEventListener("click", function () {
        selectedHour   = parseInt(hoursList.querySelector(".active").textContent);
        selectedMinute = parseInt(minutesList.querySelector(".active").textContent);
        selectedSecond = parseInt(secondsList.querySelector(".active").textContent);
        
        if (!startButton.classList.contains("pause") && !cancelButton.classList.contains("cancel")) {
            timerInterval = setInterval(startTimer, 1000);
            cancelButton.classList.add("cancel");
            startButton.classList.add("pause");
            startButton.innerHTML = "Pause";
            document.querySelector(".timer-clock").style.display = "flex";
            document.querySelector(".timer-container").style.display = "none";
        } else if (startButton.classList.contains("pause") && cancelButton.classList.contains("cancel")) {
            clearInterval(timerInterval);
            startButton.innerHTML = "Resume";
            startButton.classList.remove("pause");
            startButton.classList.add("resume");

        } else if (startButton.classList.contains("resume") && cancelButton.classList.contains("cancel")) {
            selectedHour   = parseInt(document.querySelector("span.hour").textContent);
            selectedMinute = parseInt(document.querySelector("span.minute").textContent);
            selectedSecond = parseInt(document.querySelector("span.second").textContent);
            clearInterval(timerInterval);
            timerInterval = setInterval(startTimer, 1000);
            startButton.innerHTML = "Pause";
            startButton.classList.remove("resume");
            startButton.classList.add("pause");
        }
    })
    
    cancelButton.addEventListener("click", function () {
        document.querySelector(".timer-clock").style.display = "none";
        document.querySelector(".timer-container").style.display = "block";
        clearInterval(timerInterval);
        cancelButton.classList.remove("cancel");
        if (startButton.classList.contains("resume")) {
            startButton.classList.remove("resume");
        } else if (startButton.classList.contains("pause")) {
            startButton.classList.remove("pause");
        }
        startButton.innerHTML = "Start";
        showHour.innerText    = checkTime(parseInt(hoursList.querySelector(".active").textContent));
        showMinute.innerText  = checkTime(parseInt(minutesList.querySelector(".active").textContent));
        showSecond.innerText  = checkTime(parseInt(secondsList.querySelector(".active").textContent));
    })

}


// function alarm() {
//     const date  = new Date();
//     let hours   = date.getHours();
//     let minutes = date.getMinutes();
//     let seconds = date.getSeconds();

//     startButton.addEventListener("click", function () {
//         console.log(hours + parseInt(hoursList.getElementsByClassName("active")[0].textContent))
//         console.log(parseInt(minutesList.getElementsByClassName("active")[0].textContent))
//         console.log(parseInt(secondsList.getElementsByClassName("active")[0].textContent))
//     })
// }