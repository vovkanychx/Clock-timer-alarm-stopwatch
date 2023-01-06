document.querySelector(".clock").onload     = clock();
document.querySelector(".stopwatch").onload = stopWatch();
document.querySelector(".timer").onload     = timer();
// document.querySelector(".alarm").onload     = alarm();

function checkTime(i) { //add a zero to have 2 digits in clock
    if (i < 10) {i = "0" + i}; 
    return i;
}

function clock() {
    let clockEdit     = document.getElementById("clock-edit");
    let clockAdd      = document.getElementById("clock-add");
    let searchInput   = document.getElementById("search");
    let cancelSearch  = document.getElementById("search-cancel");
    let clearSearch   = document.getElementById("clear-search-input");
    let timeZoneList  = document.querySelector(".timezone-list");
    let timeZoneItem  = document.getElementsByClassName("timezone-item");
    let clockList     = document.querySelector(".clock-list");
    let GMToffsetArray        = [];
    let unSortedCities        = [];
    let formatedGMTArray      = [];
    let unformatedGMTArray    = [];
    let clockItemsArray       = [];
    let clockEditEnable = false;

    clockAdd.onclick = () => {
        document.querySelector(".timezone.fade-up").classList.add("opened");
        document.querySelector(".block-top").style.visibility = "hidden";
        clearSearch.style.visibility = "hidden";
        //make http request for json data
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onload = function() {
            const jsonData = JSON.parse(this.responseText);
            //create list with list items as "city, country"
            let listItem = "<ul>";
            for (let i in jsonData) {
                listItem += `<li class="timezone-item">
                                <span>${jsonData[i].city}</span>, ${jsonData[i].country}
                            </li>`;
                unSortedCities.push(jsonData[i].city);
                GMToffsetArray.push(jsonData[i].offset);
            }
            listItem += "</ul>";
            timeZoneList.innerHTML = listItem;
            addCityToList();
            Array.from(document.querySelector(".timezone-list ul").getElementsByTagName("li"))
                .sort((a, b) => a.textContent.localeCompare(b.textContent))
                .forEach(li => { document.querySelector(".timezone-list ul").appendChild(li);
            }); //sort cities alphabetically in list
        }
        xmlhttp.open("GET", "js/data.json");
        xmlhttp.send();
    }

    cancelSearch.onclick = () => {
        document.querySelector(".timezone.fade-up").classList.remove("opened");
        document.querySelector(".block-top").style.visibility = "visible";
        timeZoneList.classList.remove("no-match");
        searchInput.value = null;
    }

    clockEdit.addEventListener("click", function () {
        let clockItems = document.getElementsByClassName("clock-item");
        if (!clockEdit.classList.contains("done-edit")) {
            clockEdit.innerHTML = "Done";
            clockEdit.classList.add("done-edit");
            Array.from(clockItems).forEach(item => {
                item.classList.add("delete");
                let child = document.createElement("div");
                child.style.animation = "clockItemDelete 0.5s ease";
                child.classList.add("clock-item-delete");
                item.prepend(child);
            })
        } else if (clockEdit.classList.contains("done-edit")) {
            clockEdit.innerHTML = "Edit";
            deleteItem();
        }
        let clockItemsDelete = document.getElementsByClassName("clock-item-delete");
        for (let i = 0; i < clockItemsDelete.length; i++) {
            let itemToDelete = i;
            clockItemsDelete[i].addEventListener("click", function () { //on click on removebutton of item delete confirmation button pops
                if (clockList.contains(document.querySelector(".delete-items-button"))) {
                    return //can not add confirm delete button if there's already one in clocklist
                } else if (!clockList.contains(document.querySelector(".delete-items-button"))) {
                    let deleteButton = document.createElement("button");
                    deleteButton.style.animation = "deleteItem 0.5s ease";
                    deleteButton.classList.add("delete-items-button");
                    clockItems[i].appendChild(deleteButton);
                    deleteButton.innerText = "Delete";
                    for (let i = 0; i < document.getElementsByClassName("delete-items-button").length; i++) {
                        //delete clock item on delete confirmation button
                        document.getElementsByClassName("delete-items-button")[i].onclick = () => {
                            clockEdit.innerHTML = "Edit";
                            //deleted clock item's transitions
                            document.getElementsByClassName("clock-item-add")[itemToDelete].style.cssText = "margin: 0; padding: 0; width: 0; height: 0; transform: scale(0);";
                            document.getElementsByClassName("clock-item-delete")[itemToDelete].style.cssText = "margin: 0; padding: 0; max-width: 0; min-width: 0; width: 0; height: 0; transform: scale(0);";
                            document.getElementsByClassName("delete-items-button")[i].style.cssText = "min-width: 100%; width: 100%; max-width: 100%; transition: width 1.5s ease; animation: none;";
                            document.getElementsByClassName("clock-item")[itemToDelete].style.cssText = "transform: scaleY(0); transition: all 0.5s ease; margin: 0;"
                            setTimeout(()=>{
                                //remove list item and it's content from arrays
                                clockItems[itemToDelete].remove();
                                clockItemsArray.splice(itemToDelete, 1);
                                formatedGMTArray.splice(itemToDelete, 1);
                                unformatedGMTArray.splice(itemToDelete, 1);
                                showEdit();
                                deleteItem();
                            }, 550);
                        }
                        clickOutsideDeleteButton();
                    }
                }
            });
        }
        cancelEditing();
    });

    //remove supportive divs and buttons from other clock items after deleting one of them
    function deleteItem() {
        clockEdit.classList.remove("done-edit");
        Array.from(document.getElementsByClassName("clock-item")).forEach(item => {item.classList.remove("delete");});
        Array.from(document.getElementsByClassName("clock-item-delete")).forEach(item => {
            item.style.cssText = "opacity: 0; min-width: 0; width: 0; max-width: 0; margin-right: 0; transiton all 0.25s ease;";
            setTimeout(() => {
                item.remove();
            }, 250);})
        Array.from(document.getElementsByClassName("delete-items-button")).forEach(item => {
            item.style.cssText = "min-width: 0; width: 0; max-width: 0; margin: 0; padding: 0; max-height: 0; min-height: 0; height: 0; background-color: transparent; color: transparent; transition: all 0.25s ease;";
            setTimeout(() => {
                item.remove();
            }, 500);})
        return
    }

    //if edit button clicked (if then any other button clicked aswell) and then add button clicked: open popup and cancel edit
    function cancelEditing() {
        if (document.querySelector(".clock-item").classList.contains("delete")) {
            clockAdd.onclick = () => {
                document.querySelector(".timezone.fade-up").classList.add("opened");
                document.querySelector(".block-top").style.visibility = "hidden";
                clearSearch.style.visibility = "hidden";
                setTimeout(() => {
                    clockEdit.innerText = "Edit";
                    clockEdit.classList.remove("done-edit");
                    Array.from(document.querySelectorAll(".clock-item"))
                        .forEach(item => {item.classList.remove("delete")})
                    Array.from(document.getElementsByClassName("clock-item-delete"))
                        .forEach(item => {item.remove();})
                    Array.from(document.getElementsByClassName("delete-items-button"))
                        .forEach(item => {item.remove();})
                }, 550);
            }
        }
    }

    // listen for click outside of delete confirm button
    function clickOutsideDeleteButton() {
        let click = 0;
        window.addEventListener("click", function(e){
            click++;
            if (document.querySelector(".delete-items-button") != null) {
                if (click == 2) {
                    if (document.querySelector(".delete-items-button").contains(e.target)) { // Clicked the delete button
                        clockEdit.innerText = "Edit";
                        setTimeout(() => {
                            deleteItem();
                        }, 500);
                    } else { // Clicked outside the delete button
                        Array.from(document.getElementsByClassName("delete-items-button")).forEach(item => {
                            item.style.cssText = "min-width: 0; width: 0; max-width: 0; margin: 0; padding: 0; max-height: 39px; min-height: 39px; height: 39px; background-color: transparent; color: transparent; transition: all 0.25s ease;";
                            setTimeout(() => {
                                item.remove();
                            }, 500);
                        })
                    }
                }
            } else { click = 0 }
        });
    }

    //show clock edit button
    function showEdit() {
        (clockList.childElementCount !== 0) ? clockEditEnable = true : clockEditEnable = false;
        if (clockEditEnable === true) {
            clockEdit.style.visibility = "visible";
        } else if (clockEditEnable === false) {
            clockEdit.style.visibility = "hidden";
        }
    }
    
    //create clock list item
    function addCityToList() {
        let clockLabelDay;
        let clockLabelOffset;
        let res;
        //create formatted dynamic clock list item
        for (let i = 0; i < timeZoneItem.length; i++) {
            //add clock items when user select city from timezone list
            timeZoneItem[i].onclick = () => {
                formatClockLabel();
                let item = clockList.appendChild(document.createElement("li"));
                item.className = "clock-item item";
                item.innerHTML = 
                    `<div class="clock-item-add">
                        <div class="clock-box">
                            <span class="clock-label" title="UTC: ${clockLabelOffset}">${clockLabelDay}, ${checkTime(clockLabelOffset)}</span>
                            <p class="clock-city">${unSortedCities[i]}</p>
                        </div>
                        <p class="clock-time">${res}</p>
                    </div>`;
                formatedGMTArray.push(clockLabelOffset);
                unformatedGMTArray.push(GMToffsetArray[i]);
                clockItemsArray.push(item);
                document.querySelector(".timezone.fade-up").classList.remove("opened");
                document.querySelector(".block-top").style.visibility = "visible";
                searchInput.value = null;
                showEdit()
            }
            //format clockitem time, clockLabelDay, and time difference
            function formatClockLabel () {
                const date = new Date();
                let h, m;
                h = date.getUTCHours() + Math.floor(GMToffsetArray[i] / 60);
                m = (Math.floor(GMToffsetArray[i] % 60) == 0) ? date.getUTCMinutes() : (date.getUTCMinutes() + (Math.floor(GMToffsetArray[i] % 60)));    
                // //format labelclock time difference if there is only offset in hours
                if (Math.floor(GMToffsetArray[i] % 60) == 0) {
                    if (Math.floor(GMToffsetArray[i] / 60) >= 0) {
                        clockLabelOffset = `+${Math.floor(GMToffsetArray[i] / 60)}HRS`;
                    } else if (Math.floor(GMToffsetArray[i] / 60) < 0) {
                        clockLabelOffset = `${Math.floor(GMToffsetArray[i] / 60)}HRS`;
                    }
                    if (Math.floor(GMToffsetArray[i] / 60) == 1) {
                        clockLabelOffset = `+${Math.floor(GMToffsetArray[i] / 60)}HR`;
                    } else if (Math.floor(GMToffsetArray[i] / 60) == -1) {
                        clockLabelOffset = `${Math.floor(GMToffsetArray[i] / 60)}HR`;
                    }
                }
                // //format the clocklabel time difference if there is offset in hours and minutes
                if (Math.floor(GMToffsetArray[i] % 60) !== 0) {
                    if (Math.floor(GMToffsetArray[i] / 60) >= 0) {
                        clockLabelOffset = `+${Math.floor(GMToffsetArray[i] / 60)}:${Math.floor(Math.abs(GMToffsetArray[i] % 60))}HRS`;
                    } else if (Math.floor(GMToffsetArray[i] / 60) < 0) {
                        clockLabelOffset = `${Math.floor(GMToffsetArray[i] / 60)}:${Math.floor(Math.abs(GMToffsetArray[i] % 60))}HRS`;
                    }
                }
                //format clockLabelDay of the city in the clocklabel
                if (m >= 60) {h = h + 1; m = m % 60;} 
                else if (m < 0) {h = h - 1; m = m % 60;}
                if (h >= 0 && h < 24) {clockLabelDay = "Today";}
                if (h >= 24) {h = h % 24; clockLabelDay = "Tomorrow";}
                if (h < 0) {h = 24 + h; clockLabelDay = "Yesterday";}
                res = `${checkTime(Math.abs(h))}:${checkTime(Math.abs(m))}`;
                //calculate the time of a choosen city
            }
        }
    }

    //refresh clock list items time
    function refreshTime() {
        const date = new Date();
        let clockItems = document.querySelectorAll(".clock-item");
        let h; let m; let day;
        for (let i = 0; i < clockItems.length; i++) {
            function formatTime() {
                day = document.querySelectorAll(".clock-label")[i].innerText.split(',', 1)[0];
                h = Math.floor(((date.getUTCHours() * 60) + unformatedGMTArray[i]) / 60);
                m = date.getUTCMinutes() + (unformatedGMTArray[i] % 60);
                if (m >= 60) {h = h + 1; m = m % 60;} 
                else if (m < 0) {h = h - 1; m = m % 60;}
                if (h >= 0 && h < 24) {day = "Today";}
                if (h >= 24) {h = h % 24; day = "Tomorrow";}
                if (h < 0) {h = 24 + h; day = "Yesterday";}
            }
            formatTime();
            document.querySelectorAll(".clock-label")[i].innerText = day + ", " + formatedGMTArray[i];
            document.querySelectorAll(".clock-time")[i].innerText = checkTime(h) + ":" + checkTime(m);
        }
    }
    setInterval(refreshTime, 1000);
    
    searchInput.addEventListener("keyup", function () { //searchbar, function triggers when user starts typing
        let hasAnyMatch = false;
        for (let i = 0; i < timeZoneItem.length; i++) { //case insensitive search
            if (!timeZoneItem[i].innerHTML.toLowerCase().match(new RegExp(searchInput.value, "i"))) {
                timeZoneItem[i].style.display = "none";
            } else {
                hasAnyMatch = true;
                timeZoneItem[i].style.display = "list-item";
                timeZoneList.classList.remove("no-match");
            }
        }
        if (searchInput.value == null || searchInput.value == "") { //show/hide clear search button
            clearSearch.style.visibility = "hidden";
        } else {
            clearSearch.style.visibility = "visible";
            clearSearch.onclick = () => {
                searchInput.value = null;
                clearSearch.style.visibility = "hidden";
                timeZoneList.classList.remove("no-match");
                Array.from(document.querySelector(".timezone-list ul").getElementsByTagName("li")).
                    forEach((element) => {element.style.display = "list-item";
                }); //show list items after click on button to clear search value
            }
        }
        //if searching result has no matches show user that nothing is found
        if (!hasAnyMatch) {
            timeZoneList.classList.add("no-match");
        }
    });

    function displayTime() {
        const date = new Date();
        let hours    = date.getHours();
        let minutes  = date.getMinutes();
        let seconds  = date.getSeconds();

        hours   = checkTime(hours);
        minutes = checkTime(minutes);
        seconds = checkTime(seconds);

        document.querySelector(".display-time").innerHTML =  hours + ":" + minutes + ":" + seconds;
    }
    setInterval(displayTime, 100);
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
    showMilSec       = document.querySelector(".timer-clock .millisecond")
    let startButton  = document.getElementById("start-pause");
    let cancelButton = document.getElementById("cancel");
    let timerInterval;

    document.querySelector(".timer-container").onwheel = () => { return false; } // disable window scroll when scrolling on container
    //create list select options (list items 0-23h 0-59m/s)
    function createListItems(list, lastItem) {
        for(let i = 0; i < lastItem; i++ ) {
            list.appendChild(document.createElement("div"));
            list.lastChild.innerHTML = i + " ";
        }
    }
    //place "hours", "min", "sec" near scrollable lists
    function centerText() {
        for (let i = 0; i < document.querySelectorAll(".box p").length; i++) {
            document.querySelectorAll(".box p")[i].style.left = (document.querySelector(".wrap").clientWidth / 2 + document.querySelector(".box p").clientWidth / 2) + "px";
        }
        return
    }

    function displaySelected() {
        showHour.innerHTML   = checkTime(parseInt(hoursList.querySelector(".active").textContent));
        showMinute.innerHTML = checkTime(parseInt(minutesList.querySelector(".active").textContent));
        showSecond.innerHTML = checkTime(parseInt(secondsList.querySelector(".active").textContent));
        showMilSec.innerHTML = checkTime(0)
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
            //display selected time on digital clock
            displaySelected();
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
    centerText();
    window.addEventListener("resize", centerText);
    
    let selectedMilSec = 0;
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
        if (parseInt(hoursList.querySelector(".active").textContent) == 0 && 
            parseInt(minutesList.querySelector(".active").textContent) == 0 && 
            parseInt(secondsList.querySelector(".active").textContent) == 0) {
            return;
        } //disable start button if no time specified
        selectedHour   = parseInt(hoursList.querySelector(".active").textContent);
        selectedMinute = parseInt(minutesList.querySelector(".active").textContent);
        selectedSecond = parseInt(secondsList.querySelector(".active").textContent);
        convertTime = (((((selectedHour * 60) + selectedMinute) * 60) + selectedSecond) * 1000) + selectedMilSec + 100;   

        if (!startButton.classList.contains("pause") && !cancelButton.classList.contains("cancel")) {
            timerInterval = setInterval(startTimer, 10);
            document.querySelector(".meter").style.animation = `animateProgress linear ${convertTime}ms`
            document.querySelector(".meter").style.webkitAnimation = `animateProgress linear ${convertTime}ms`
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