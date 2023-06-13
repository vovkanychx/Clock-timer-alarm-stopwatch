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
    const circleColor      = document.querySelector(".meter");
    let timerInterval;
    let timerStarted = false;
    
    let selectedMilSec, selectedSecond, selectedMinute, selectedHour;
    selectedMilSec = selectedSecond = selectedMinute = selectedHour = 0;

    let activeHour, activeMinute, activeSecond; 
    activeHour = parseInt(localStorage.getItem("timerHour"))
    activeMinute = parseInt(localStorage.getItem("timerMinute"))
    activeSecond = parseInt(localStorage.getItem("timerSecond"))

    if (activeHour === undefined || activeMinute === undefined || activeSecond === undefined ||
        activeHour === null || activeMinute === null || activeSecond === null ||
        isNaN(activeHour) || isNaN(activeMinute) || isNaN(activeSecond)) 
    {
        activeHour = activeMinute = activeSecond = 0;
        callMuliple();
    } 
    else { callMuliple() }

    function scrollToActiveElement(list, active) {
        list.scrollTop = list.querySelector("li").offsetHeight * active;
    }

    if (localStorage.getItem("timerStarted") === "true") {
        document.querySelector(".timer-clock").style.display = "flex";
        document.querySelector(".timer-container").style.display = "none";
        circleColor.style.animation = `animateProgress linear ${parseFloat(localStorage.getItem("timerAnimationTime"))}ms`;
        circleColor.style.webkitAnimation = `animateProgress linear ${parseFloat(localStorage.getItem("timerAnimationTime"))}ms`;
        circleColor.style.animationPlayState = 'paused';
        circleColor.style.setProperty("--strokeOffset", `${parseFloat(localStorage.getItem("timerDashOffset"))}`);
        cancelButton.classList.add("cancel");
        startButton.classList.add("resume");
        startButton.innerText = "Resume";
        showHour.innerText   = checkTime(parseInt(localStorage.getItem("timerShowHour")));
        showMinute.innerText = checkTime(parseInt(localStorage.getItem("timerShowMinute")));
        showSecond.innerText = checkTime(parseInt(localStorage.getItem("timerShowSecond")));
        showMilSec.innerText = checkTime(parseInt(localStorage.getItem("timerShowMilSec")));
        selectedHour = parseInt(localStorage.getItem("timerShowHour"));
        selectedSecond = parseInt(localStorage.getItem("timerShowMinute"));
        selectedMinute = parseInt(localStorage.getItem("timerShowSecond"));
        selectedMilSec = parseInt(localStorage.getItem("timerShowMilSec"));
    } else if (localStorage.getItem("timerStarted") === "false") {
        document.querySelector(".timer-clock").style.display = "none";
        document.querySelector(".timer-container").style.display = "block";
    }
    
    // disable default scroll when scrolling on container
    document.querySelector(".timer-container").addEventListener("wheel", (e) => { e.preventDefault(); })

    //create list select options (list items 0-23h 0-59m/s)
    function createListItems(list, lastItem) {
        for(let i = 0; i < lastItem; i++ ) {
            list.appendChild(document.createElement("li"));
            list.lastChild.innerHTML = i;
        }
        return 
    }

    function setLocalStorage() {
        localStorage.setItem("timerHour", hoursList.querySelector(".active").innerText);
        localStorage.setItem("timerMinute", minutesList.querySelector(".active").innerText);
        localStorage.setItem("timerSecond", secondsList.querySelector(".active").innerText);
        return
    }

    function callMuliple() {
        createListItems(hoursList, 24)
        createListItems(minutesList, 60); 
        createListItems(secondsList, 60);
        
        scrollClick(hoursList, activeHour);
        scrollClick(minutesList, activeMinute);
        scrollClick(secondsList, activeSecond);
    }

    function displaySelected() {
        showHour.innerText   = checkTime(parseInt(hoursList.querySelector(".active").textContent));
        showMinute.innerText = checkTime(parseInt(minutesList.querySelector(".active").textContent));
        showSecond.innerText = checkTime(parseInt(secondsList.querySelector(".active").textContent));
        showMilSec.innerText = checkTime(0)
    }

    function scrollClick (list, active) {
        list.getElementsByTagName("li")[Math.abs(active)].classList.add("active");
        setTimeout(() => {
            scrollToActiveElement(list, active);
        }, 0);
        list.addEventListener("wheel", (e) => {
            // e.preventDefault(); //disable scrolling
            if (e.deltaY < 0) { //if scrolling up
                if (active <= parseInt(list.firstElementChild.textContent)) { //stop scrolling if it's top
                    return
                } else {
                    let i = active - 1;
                    list.scrollTo({top: list.querySelector("li").offsetHeight * i, behavior: "smooth"});
                    // list.getElementsByTagName("li")[Math.abs(active - 1)].scrollIntoView({behavior: "smooth", block: "center"})
                    --active;
                    list.getElementsByTagName("li")[Math.abs(active + 1)].classList.remove("active");
                    list.getElementsByTagName("li")[Math.abs(active)].classList.add("active");
                }
            } 
            else if (e.deltaY > 0) { //if scrolling down
                if (active >= parseInt(list.lastElementChild.textContent)) { //stop scrolling if it's bottom
                    return
                } else {
                    let i = active + 1;
                    list.scrollTo({top: list.querySelector("li").offsetHeight * i, behavior: "smooth"});
                    // list.getElementsByTagName("li")[Math.abs(active + 1)].scrollIntoView({behavior: "smooth", block: "center"})
                    active++;
                    list.getElementsByTagName("li")[Math.abs(active - 1)].classList.remove("active");
                    list.getElementsByTagName("li")[Math.abs(active)].classList.add("active");
                }
            }
            //display selected time on digital clock
            displaySelected();
            hoursTextChange();
            setLocalStorage();
        }, {passive: true});
        for (let i = 0; i < list.getElementsByTagName("li").length; i++){
            list.getElementsByTagName("li")[i].addEventListener("click", function () { //move to option if clicked
                list.querySelectorAll("li").forEach(el => { //if clicked remove any current active class
                    el.classList.remove("active");
                });
                active = i; //new assign so we can scroll and click without having an error
                list.scrollTo({top: list.querySelector("li").offsetHeight * i, behavior: "smooth"});
                // list.getElementsByTagName("li")[Math.abs(active)].scrollIntoView({behavior: "smooth", block: "center"});
                list.getElementsByTagName("li")[Math.abs(active)].classList.add("active");
                hoursTextChange();
                setLocalStorage();
            })
        }
    }

    function hoursTextChange() {
        if (parseInt(hoursList.querySelector(".active").innerText) === 1) {
            hoursList.parentElement.style.setProperty("--hoursText", "'hour'");
        } else {
            hoursList.parentElement.style.setProperty("--hoursText", "'hours'");
        }
    }

    function startTimer() { 
        selectedMilSec--;
        if (selectedHour == 0 && selectedMinute == 0 && selectedSecond == 0 && selectedMilSec == 0) {
            clearInterval(timerInterval);
            startButton.classList.remove("pause");
            cancelButton.classList.remove("cancel");
            startButton.innerText = "Start";
            document.querySelector(".timer-clock").style.display = "none";
            document.querySelector(".timer-container").style.display = "block";
            displaySelected();
            scrollToActiveElement(hoursList, activeHour);
            scrollToActiveElement(minutesList, activeMinute);
            scrollToActiveElement(secondsList, activeSecond);
            timerStarted = false;
            localStorage.setItem("timerStarted", timerStarted);
            circleColor.style.setProperty("--strokeOffset", '0');
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
        showHour.innerText   = checkTime(selectedHour);
        showMinute.innerText = checkTime(selectedMinute);
        showSecond.innerText = checkTime(selectedSecond);
        showMilSec.innerText = checkTime(selectedMilSec);
        localStorage.setItem("timerShowHour", selectedHour);
        localStorage.setItem("timerShowMinute", selectedMinute);
        localStorage.setItem("timerShowSecond", selectedSecond);
        localStorage.setItem("timerShowMilSec", selectedMilSec);
        localStorage.setItem("timerAnimationTime", (((((selectedHour * 60) + selectedMinute) * 60) + selectedSecond) * 1000) + selectedMilSec);
        localStorage.setItem("timerDashOffset", window.getComputedStyle(circleColor).strokeDashoffset);
        localStorage.setItem("timerInterval", timerInterval);
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
        let convertTime = ((((selectedHour * 60) + selectedMinute) * 60) + selectedSecond) * 1000 + selectedMilSec;
        if (!startButton.classList.contains("pause") && !cancelButton.classList.contains("cancel")) {
            timerInterval = setInterval(startTimer, 10); //start timer
            circleColor.style.animation = `animateProgress linear ${convertTime}ms`;
            circleColor.style.webkitAnimation = `animateProgress linear ${convertTime}ms`;
            document.querySelector(".timer-container").style.cssText = "-webkit-animation: fadeIn 0.5s; animation: fadeIn 0.5s;";
            cancelButton.classList.add("cancel");
            startButton.classList.add("pause");
            startButton.innerText = "Pause";
            document.querySelector(".timer-clock").style.display = "flex";
            document.querySelector(".timer-container").style.display = "none";
            timerStarted = true;
            localStorage.setItem("timerStarted", timerStarted);
        } else if (startButton.classList.contains("pause") && cancelButton.classList.contains("cancel")) {
            clearInterval(timerInterval); //pause timer
            circleColor.style.animationPlayState = 'paused';
            startButton.innerText = "Resume";
            startButton.classList.remove("pause");
            startButton.classList.add("resume");
        } else if (startButton.classList.contains("resume") && cancelButton.classList.contains("cancel")) {
            selectedHour   = parseInt(document.querySelector("span.hour").textContent);
            selectedMinute = parseInt(document.querySelector("span.minute").textContent);
            selectedSecond = parseInt(document.querySelector("span.second").textContent);
            selectedMilSec = parseInt(document.querySelector("span.millisecond").textContent);
            clearInterval(timerInterval); //resume timer after pause
            timerInterval = setInterval(startTimer, 10);
            circleColor.style.animationPlayState = 'running';
            startButton.innerText = "Pause";
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
        startButton.innerText = "Start";
        displaySelected();
        timerStarted = false;
        localStorage.setItem("timerStarted", timerStarted);
        selectedMilSec = 0;
        circleColor.style.setProperty("--strokeOffset", "0");
    })
}