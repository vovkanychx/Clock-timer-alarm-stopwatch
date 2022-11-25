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