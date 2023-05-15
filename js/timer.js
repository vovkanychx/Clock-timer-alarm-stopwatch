import { checkTime } from "../js/script.js";
export function timer () {
    const hoursList        = document.getElementById("hours");
    const minutesList      = document.getElementById("minutes");
    const secondsList      = document.getElementById("seconds");
    const showHour         = document.querySelector(".timer-clock .hour");
    const showMinute       = document.querySelector(".timer-clock .minute");
    const showSecond       = document.querySelector(".timer-clock .second");
    const showMilSec       = document.querySelector(".timer-clock .millisecond")
    const startButton      = document.getElementById("start-pause");
    const cancelButton     = document.getElementById("cancel");
    let timerInterval;
    var activeHour, activeMinute, activeSecond;
    activeHour   = parseInt(localStorage.getItem("activeHour"));
    activeMinute = parseInt(localStorage.getItem("activeMinute"));
    activeSecond = parseInt(localStorage.getItem("activeSecond"));
    console.log("hour: "+activeHour)
    console.log("minute: "+activeMinute)
    console.log("second: "+activeSecond)

    window.addEventListener("unload", function () {
        localStorage.removeItem("activeHour");
        localStorage.removeItem("activeMinute");
        localStorage.removeItem("activeSecond");
        localStorage.setItem("activeHour", parseInt(hoursList.querySelector(".active").textContent));
        localStorage.setItem("activeMinute", parseInt(minutesList.querySelector(".active").textContent));
        localStorage.setItem("activeSecond", parseInt(secondsList.querySelector(".active").textContent));
    })

    window.addEventListener("load", function () {
        if (isNaN(activeHour) || isNaN(activeMinute) || isNaN(activeSecond)) { // means parseInt'ed localStorage items are NaN (null)
            localStorage.removeItem("activeHour");
            localStorage.removeItem("activeMinute");
            localStorage.removeItem("activeSecond");
            activeHour = activeMinute = activeSecond = 0; // backup alternate
        } else {
            hoursList.scrollTop   = hoursList.querySelector("div").offsetHeight * activeHour + 1;
            minutesList.scrollTop = minutesList.querySelector("div").offsetHeight * activeMinute + 1;
            secondsList.scrollTop = secondsList.querySelector("div").offsetHeight * activeSecond + 1;
            hoursList.getElementsByTagName("div")[activeHour].classList.add("active");
            minutesList.getElementsByTagName("div")[activeMinute].classList.add("active");
            secondsList.getElementsByTagName("div")[activeSecond].classList.add("active");
        }
    })
    
    document.querySelector(".timer-container").onwheel = (e) => { e.preventDefault(); } // disable default scroll when scrolling on container
    //create list select options (list items 0-23h 0-59m/s)
    function createListItems(list, lastItem) {
        for(let i = 0; i < lastItem; i++ ) {
            list.appendChild(document.createElement("div"));
            list.lastChild.innerHTML = i;
        }
    }

    function displaySelected() {
        showHour.innerHTML   = checkTime(parseInt(hoursList.querySelector(".active").textContent));
        showMinute.innerHTML = checkTime(parseInt(minutesList.querySelector(".active").textContent));
        showSecond.innerHTML = checkTime(parseInt(secondsList.querySelector(".active").textContent));
        showMilSec.innerHTML = checkTime(0)
    }

    function scrollClick (active, list) {
        // list.scrollTop = list.querySelector("div").offsetHeight * active + 1;
        // list.getElementsByTagName("div")[Math.abs(active)].classList.add("active");
        list.addEventListener("wheel", (e) => {
            e.preventDefault(); //disable scrolling
            if (e.deltaY < 0) { //if scrolling up
                if (active <= parseInt(list.firstElementChild.textContent)) { //stop scrolling if it's top
                    return
                } else {
                    let i = active - 1;
                    list.scrollTo({top: list.querySelector(".active").offsetHeight * i, behavior: "smooth"});
                    // list.getElementsByTagName("div")[Math.abs(active - 1)].scrollIntoView({behavior: "smooth", block: "center"})
                    --active;
                    list.getElementsByTagName("div")[Math.abs(active + 1)].classList.remove("active");
                    list.getElementsByTagName("div")[Math.abs(active)].classList.add("active");
                }
            } 
            else if (e.deltaY > 0) { //if scrolling down
                if (active >= parseInt(list.lastElementChild.textContent)) { //stop scrolling if it's bottom
                    return
                } else {
                    let i = active + 1;
                    list.scrollTo({top: list.querySelector(".active").offsetHeight * i, behavior: "smooth"});
                    // list.getElementsByTagName("div")[Math.abs(active + 1)].scrollIntoView({behavior: "smooth", block: "center"})
                    active++;
                    list.getElementsByTagName("div")[Math.abs(active - 1)].classList.remove("active");
                    list.getElementsByTagName("div")[Math.abs(active)].classList.add("active");
                }
            }
            //display selected time on digital clock
            displaySelected();
        });
        for (let i = 0; i < list.getElementsByTagName("div").length; i++){
            list.getElementsByTagName("div")[i].onclick = function () { //move to option if clicked
                list.querySelectorAll("div").forEach(el => { //if clicked remove any current active class
                    el.classList.remove("active");
                });
                active = i; //new assign so we can scroll and click without having an error
                list.scrollTo({top: list.querySelector(".active").offsetHeight * i, behavior: "smooth"});
                // list.getElementsByTagName("div")[Math.abs(active)].scrollIntoView({behavior: "smooth", block: "center"});
                list.getElementsByTagName("div")[Math.abs(active)].classList.add("active");
            }
        }
    }
    
    createListItems(hoursList, 24), createListItems(minutesList, 60), createListItems(secondsList, 60);
    scrollClick(parseInt(activeHour), hoursList), scrollClick(parseInt(activeMinute), minutesList), scrollClick(parseInt(activeSecond), secondsList);
    
    let selectedMilSec, selectedSecond, selectedMinute, selectedHour;
    selectedMilSec = selectedSecond = selectedMinute = selectedHour = 0;

    function startTimer() { 
        selectedMilSec--;
        if (selectedHour == 0 && selectedMinute == 0 && selectedSecond == 0 && selectedMilSec == 0) {
            clearInterval(timerInterval);
            startButton.classList.remove("pause");
            cancelButton.classList.remove("cancel");
            startButton.innerHTML = "Start";
            document.querySelector(".timer-clock").style.display = "none";
            document.querySelector(".timer-container").style.display = "block";
            displaySelected();
            return
        }
        if (selectedMilSec < 0) {
            selectedMilSec = 99;
            if (selectedSecond >= 0) {selectedSecond--}
            else {selectedSecond = 0}
        }
        if (selectedSecond < 0) {
            selectedSecond = 59; 
            if (selectedMinute >= 0) {selectedMinute--} 
            else {selectedMinute = 0}
        }
        if (selectedMinute < 0) {
            selectedMinute = 59;
            if (selectedHour >= 0) {selectedHour--}
            else (selectedHour = 0)
        }
        if (selectedHour > 0 && selectedMinute == 0 && selectedSecond == 0) {
            selectedHour   = selectedHour;
            selectedMinute = 59;
            selectedSecond = 59;
            selectedHour   = selectedHour - 1;
        }
        (selectedHour <= 0) ? selectedHour = 0 : selectedHour = selectedHour;
        showHour.innerHTML   = checkTime(selectedHour);
        showMinute.innerHTML = checkTime(selectedMinute);
        showSecond.innerHTML = checkTime(selectedSecond);
        showMilSec.innerHTML = checkTime(selectedMilSec);
    }

    startButton.addEventListener("click", function () {
        clearInterval(timerInterval);
        if (parseInt(hoursList.querySelector(".active").textContent) == 0 && 
            parseInt(minutesList.querySelector(".active").textContent) == 0 && 
            parseInt(secondsList.querySelector(".active").textContent) == 0) {
            return;
        } //disable start button if no time specified
        selectedHour   = parseInt(hoursList.querySelector(".active").textContent);
        selectedMinute = parseInt(minutesList.querySelector(".active").textContent);
        selectedSecond = parseInt(secondsList.querySelector(".active").textContent);
        let convertTime = ((((selectedHour * 60) + selectedMinute) * 60) + selectedSecond) * 1000;
        if (!startButton.classList.contains("pause") && !cancelButton.classList.contains("cancel")) {
            timerInterval = setInterval(startTimer, 10);
            document.querySelector(".meter").style.animation = `animateProgress linear ${convertTime}ms`;
            document.querySelector(".meter").style.webkitAnimation = `animateProgress linear ${convertTime}ms`;
            document.querySelector(".timer-container").style.cssText = "-webkit-animation: fadeIn 0.5s; animation: fadeIn 0.5s;";
            cancelButton.classList.add("cancel");
            startButton.classList.add("pause");
            startButton.innerHTML = "Pause";
            document.querySelector(".timer-clock").style.display = "flex";
            document.querySelector(".timer-container").style.display = "none";
        } else if (startButton.classList.contains("pause") && cancelButton.classList.contains("cancel")) {
            clearInterval(timerInterval); //pause timer
            document.querySelector(".meter").style.animationPlayState = 'paused';
            startButton.innerHTML = "Resume";
            startButton.classList.remove("pause");
            startButton.classList.add("resume");
        } else if (startButton.classList.contains("resume") && cancelButton.classList.contains("cancel")) {
            selectedHour   = parseInt(document.querySelector("span.hour").textContent);
            selectedMinute = parseInt(document.querySelector("span.minute").textContent);
            selectedSecond = parseInt(document.querySelector("span.second").textContent);
            selectedMilSec = parseInt(document.querySelector("span.millisecond").textContent);
            clearInterval(timerInterval); //resume timer after pause
            timerInterval = setInterval(startTimer, 10);
            document.querySelector(".meter").style.animationPlayState = 'running';
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
        displaySelected();
    })
}