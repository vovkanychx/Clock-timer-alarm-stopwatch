// container = document.querySelector(".container");
// hoursList = document.getElementById("hours");
// minutesList = document.getElementById("minutes");
// secondsList = document.getElementById("seconds");
// selected = document.querySelector(".selected");
// listItem = document.querySelector("#hours > div");

// container.onwheel = function() { return false; } // disable window scroll when scrolling on container

// selected.style.top = (container.offsetHeight / 2) - (listItem.offsetHeight / 2) + "px"; //dynamic center vertically
// hoursList.style.transform = minutesList.style.transform = secondsList.style.transform = "translateY(0px)"; //dynamic center vertically
// hoursList.style.paddingTop = minutesList.style.paddingTop = secondsList.style.paddingTop = 
//         ((container.offsetHeight / 2) - (listItem.offsetHeight / 2)) + "px";

// function scrollList(active, list, computed, topoffset) {
//     active = 0;
//     list.getElementsByTagName("div")[active].classList.add("active");
//     list.addEventListener('wheel', function(event) {
//         computed = parseInt(window.getComputedStyle(list).getPropertyValue("transform").split(", ")[5]);
//         if (event.deltaY < 0) {
//             if (computed >= 0) {
//                 return
//             } else {
//                 list.style.transform = `translateY(calc(${computed}px + ${listItem.offsetHeight}px))`;
//                 console.log('scrolling up');
//                 --active;
//                 list.getElementsByTagName("div")[active + 1].classList.remove("active");
//                 list.getElementsByTagName("div")[active].classList.add("active");
//             }
//         } else if (event.deltaY > 0) {
//             if (computed <= (topoffset - list.scrollHeight)) {
//                 hoursList.getElementsByTagName("div")[23].style.height = minutesList.getElementsByTagName("div")[59].style.height = secondsList.getElementsByTagName("div")[59].style.height = 
//                     ((container.offsetHeight / 2) + (listItem.offsetHeight / 2)) + "px"
//                 return
//             } else {
//                 list.style.transform = `translateY(calc(${computed}px - ${listItem.offsetHeight}px))`;
//                 console.log('scrolling down');
//                 active++;
//                 list.getElementsByTagName("div")[active - 1].classList.remove("active");
//                 list.getElementsByTagName("div")[active].classList.add("active");
//             }
//         }
//     }, {passive: true});
// }

// scrollList(0, hoursList, parseInt(window.getComputedStyle(hoursList).getPropertyValue("transform").split(", ")[5]), topOffset);
// scrollList(0, minutesList, parseInt(window.getComputedStyle(minutesList).getPropertyValue("transform").split(", ")[5]), topOffset);
// scrollList(0, secondsList, parseInt(window.getComputedStyle(secondsList).getPropertyValue("transform").split(", ")[5]), topOffset);
// selected
// function scrollToClick(list) {
//     for (let i = 0; i < list.getElementsByTagName("div").length; i++) {
//         computed = parseInt(window.getComputedStyle(list).getPropertyValue("transform").split(", ")[5]);
//         list.getElementsByTagName("div")[i].addEventListener("click", function() {
//             for (let i = 0; i < list.getElementsByTagName("div").length; i++){
//                 list.getElementsByTagName("div")[i].classList.remove("active");
//             }
//             list.getElementsByTagName("div")[i].classList.add("active");
//             selected = parseInt(list.getElementsByTagName("div")[i].innerText);
//             list.style.transform = `translateY(calc(${computed}px - ${listItem.offsetHeight * selected}px))`;
//         });
//     }
// }

// scrollToClick(hoursList);
// scrollToClick(minutesList);
// scrollToClick(secondsList);


// document.querySelector(".scroll").addEventListener('wheel', (e) => {
//     e.preventDefault();
//     if (e.deltaY < 0) {
//         document.querySelector(".scroll").scrollBy({top: -(document.querySelector(".scroll > div").scrollHeight)});
//     } 
//     else if (e.deltaY > 0) {
//         document.querySelector(".scroll").scrollBy({top: (document.querySelector(".scroll > div").scrollHeight)});
//     }
// });


//show selected hours and minutes on digital clock when started timer
// showHour.innerHTML = "00";
// showMinute.innerHTML = "00";

// for (let i = 0; i < document.querySelectorAll("#hours div").length; i++) {
//     document.querySelectorAll("#hours div")[i].addEventListener("click", function() {
//         selectedHour = parseInt(document.querySelectorAll("#hours div")[i].innerText);
//         if (selectedHour < 10) {
//             showHour.innerHTML = "0" + selectedHour;
//         } else {
//             showHour.innerHTML = selectedHour;
//         }
//     });
// }
// for (let i = 0; i < document.querySelectorAll("#minutes div").length; i++) {
//     document.querySelectorAll("#minutes div")[i].addEventListener("click", function() {
//         selectedMinute = parseInt(document.querySelectorAll("#minutes div")[i].innerText);
//         if (selectedMinute < 10) {
//             showMinute.innerHTML = "0" + selectedMinute;
//         } else {
//             showMinute.innerHTML = selectedMinute;
//         }
//     });
// }

// STOPWATCH
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
