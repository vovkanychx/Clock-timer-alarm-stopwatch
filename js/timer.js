import { checkTime } from "../js/script.js";
export function timer () {
    const hoursList         = document.getElementById("hours");
    const minutesList       = document.getElementById("minutes");
    const secondsList       = document.getElementById("seconds");
    const showHour          = document.querySelector(".timer-clock .hour");
    const showMinute        = document.querySelector(".timer-clock .minute");
    const showSecond        = document.querySelector(".timer-clock .second");
    const showMilSec        = document.querySelector(".timer-clock .millisecond")
    const startButton       = document.getElementById("start-pause");
    const cancelButton      = document.getElementById("cancel");
    const circleColor       = document.querySelector(".meter");
    const timerActionBtn    = document.getElementById("timer_action");
    const timerActionLabel  = document.querySelector(".timer_action-label");
    const setSoundPopup     = document.querySelector(".timer .set_sound");
    const setSoundSetBtn    = document.querySelector(".timer #set_button");
    const setSoundCancelBtn = document.querySelector(".timer #cancel_button");
    const setSoundList      = document.querySelector(".timer .set_sound-ringtones");
    const noRingtoneBtn     = document.querySelector(".timer #button_none");

    const RINGTONES_URL = "https://api.github.com/repos/vovkanychx/Clock-timer-alarm-stopwatch/git/trees/master?recursive=1";
    let timerInterval;
    let timerStarted = false;
    let soundNames = [];
    let selectedSound;
    
    let selectedMilSec, selectedSecond, selectedMinute, selectedHour;
    selectedMilSec = selectedSecond = selectedMinute = selectedHour = 0;

    let activeHour, activeMinute, activeSecond; 
    activeHour = parseInt(localStorage.getItem("timerHour"))
    activeMinute = parseInt(localStorage.getItem("timerMinute"))
    activeSecond = parseInt(localStorage.getItem("timerSecond"))

    async function selectedSoundLocalStorage(list) {
        if (localStorage.getItem("selectedSound") === null) {
            timerActionLabel.innerText = "Alarm";
            list.querySelector("li").setAttribute("selected", true);
            localStorage.setItem("selectedSound", list.querySelector('[selected="true"').innerText.toLowerCase());
        } else {
            timerActionLabel.innerText = localStorage.getItem("selectedSound");
            list.querySelectorAll("li").forEach(li => {
                if (localStorage.getItem("selectedSound").toLowerCase() === li.innerText.toLowerCase()) {
                    li.setAttribute("selected", true);
                }
            })
        }
    }

    if (activeHour === undefined || activeMinute === undefined || activeSecond === undefined ||
        activeHour === null || activeMinute === null || activeSecond === null ||
        isNaN(activeHour) || isNaN(activeMinute) || isNaN(activeSecond)) 
    {
        activeHour = activeMinute = activeSecond = 0;
        callMultiple();
    } 
    else { callMultiple() }

    function scrollToActiveElement(list) {
        list.scrollTo({ top: list.querySelector("li").offsetHeight * Number(list.querySelector(".active").innerText) });
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

    function callMultiple() {
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
            scrollToActiveElement(list);
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
            scrollToActiveElement(hoursList);
            scrollToActiveElement(minutesList);
            scrollToActiveElement(secondsList);
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

    navigator.serviceWorker.register('../sw.js');
    Notification.requestPermission(function(result) {
    if (result === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
        registration.showNotification('Notification with ServiceWorker');
        });
    }
    });

    async function callAPI(url, list) {
        const response = await fetch(url);
        const responseData = await response.json();
        await getSoundNames(responseData);
        await renderArrToList(list);
        await handleSoundItemClick(list);
        await selectedSoundLocalStorage(list)
    }
    // callAPI(RINGTONES_URL, setSoundList);

    async function getSoundNames(data) {
        if (data?.tree) {
            for (let key in data.tree) {
                if (data.tree[key].path.includes("ringtones/")) {
                    let soundNameNoFormat = data.tree[key].path; // output: "ringtones/soundname.mp3"
                    let soundName = soundNameNoFormat.split("/")[1].split(".")[0]; // output: "soundname.mp3" -> "soundname"
                    soundNames.push(soundName);
                }
            }
            return soundNames;
        } else {
            return;
        }
    }

    async function renderArrToList(list) {
        const svg = `<svg class="set_sound-check_icon" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" fill="#ffa500"></path></svg>`;
        const mappedList = soundNames.map(soundName => {
            return `<li selected="false">${svg}<button>${soundName}</button></li>`;
        }).join("");
        list.innerHTML = mappedList;        
        // list.querySelector("li").setAttribute("selected", true);
        localStorage.getItem("selectedSound") === null ? timerActionLabel.innerText = list.querySelector("li").innerText : timerActionLabel.innerText = localStorage.getItem("selectedSound");
    }

    function playAudio(htmlElement, soundName, list) {
        soundName = soundName.toLowerCase();
        let audioElement;
        function createAudioAndAppend(soundName) {
            audioElement = document.createElement("audio");
            audioElement.setAttribute("id", `${soundName}-ringtone`);
            let audioElementSource = document.createElement("source");
            audioElementSource.setAttribute("src", `https://vovkanychx.github.io/Clock-timer-alarm-stopwatch/ringtones/${soundName}.mp3`);
            audioElementSource.setAttribute("type", "audio/mp3");
            audioElement.appendChild(audioElementSource);
            htmlElement.appendChild(audioElement);
        }
        htmlElement.querySelectorAll("audio").length === 0 ? createAudioAndAppend(soundName) : audioElement = htmlElement.querySelector(`#${soundName}-ringtone`);
        if (audioElement.paused) {
            list.querySelectorAll("audio").forEach(audio => {audio.pause()});
            audioElement.play();
        } else {
            audioElement.pause();
            audioElement.currentTime = 0;
        }
    }

    async function handleSoundItemClick (list) {
        list.querySelectorAll("li").forEach(li => {
            li.addEventListener("click", (e) => {
                e.preventDefault();
                // add check icon to selected list item
                noRingtoneBtn.querySelector("svg").style.visibility = "hidden";
                li.parentElement.querySelectorAll("svg").forEach(svg => svg.style.visibility = "hidden");
                list.querySelectorAll("li").forEach(li => li.setAttribute("selected", false));
                li.setAttribute("selected", true);
                li.querySelector("svg").style.visibility = "visible";
                selectedSound = li.innerText.toLowerCase();
                timerActionLabel.innerText = selectedSound;
            });
            li.onclick = () => {
                let soundName = li.innerText;
                return playAudio(li, soundName, list);
            }
        });
    }

    function resetOnClick(list) {
        list.querySelectorAll("li").forEach(li => {
            if (li.contains(li.querySelector("audio"))) {
                li.querySelector("audio").pause();
                li.querySelector("audio").currentTime = 0;
            }
        });
        noRingtoneBtn.querySelector("svg").style.visibility = "hidden";
    }

    function setSoundButtonsHandler() {
        setSoundPopup.style.top = "100%";
        resetOnClick(setSoundList);
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

    timerActionBtn.addEventListener("click", (e) => {
        setSoundPopup.style.top = "5%";
        selectedSecond = localStorage.getItem("selectedSound");
        if (!setSoundList.contains(setSoundList.querySelector('[selected="true"]'))) {
            setSoundList.querySelector("li").setAttribute("selected", true);
        }
        if (setSoundList.querySelector('[selected="true"]').innerText.toLowerCase() !== localStorage.getItem("selectedSound").toLowerCase()) {
            setSoundList.querySelectorAll("li").forEach(li => {
                li.setAttribute("selected", false);
                li.querySelector("svg").style.visibility = "hidden";
                if (li.innerText.toLowerCase() == localStorage.getItem("selectedSound").toLocaleLowerCase()) {
                    li.setAttribute("selected", true);
                    li.querySelector("svg").style.visibility = "visible";
                }
            })
        } else if (localStorage.getItem("selectedSound").toLowerCase() === noRingtoneBtn.innerText.toLowerCase()) {
            resetOnClick();
            timerActionLabel.innerText = localStorage.getItem("selectedSound");
        }
        else {
            setSoundList.querySelectorAll("svg").forEach(svg => svg.style.visibility = "hidden");
            setSoundList.querySelector('[selected="true"').querySelector("svg").style.visibility = "visible";
        }
        if (localStorage.getItem("selectedSound").toLowerCase() === noRingtoneBtn.innerText.toLowerCase()) {
            // have no clue why the same code is not working in the same else if statement
            noRingtoneBtn.querySelector("svg").style.visibility = "visible";
        }
    })

    setSoundSetBtn.addEventListener("click", (e) => {
        setSoundButtonsHandler();
        if (setSoundList.contains(setSoundList.querySelector('[selected="true"'))) {
            localStorage.setItem("selectedSound", setSoundList.querySelectorAll('[selected="true"]')[0].innerText);
            timerActionLabel.innerText = setSoundList.querySelectorAll('[selected="true"]')[0].innerText;
        } else {
            localStorage.setItem("selectedSound", noRingtoneBtn.innerText.toLowerCase());
            timerActionLabel.innerText = noRingtoneBtn.innerText;
        }
    })

    setSoundCancelBtn.addEventListener("click", (e) => { 
        setSoundButtonsHandler();
        timerActionLabel.innerText = localStorage.getItem("selectedSound");
    })

    noRingtoneBtn.addEventListener("click", (e) => {
        resetOnClick(setSoundList);
        setSoundList.querySelectorAll("li").forEach(li => {
            li.querySelector("svg").style.visibility = "hidden";
            li.setAttribute("selected", false);
        })
        e.target.querySelector("svg").style.visibility = "visible";
        selectedSound = e.target.innerText;
        timerActionLabel.innerText = selectedSound;
    })
}