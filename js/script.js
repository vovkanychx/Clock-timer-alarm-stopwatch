import { clock } from "../js/clock.js";
import { stopwatch } from "../js/stopwatch.js";
import { timer } from "../js/timer.js";
import { alarm } from "../js/alarm.js";

const menuClock        = document.getElementById("clock");
const menuStopwatch    = document.getElementById("stopwatch");
const menuTimer        = document.getElementById("timer");
const menuAlarm        = document.getElementById("alarm");
const sectionClock     = document.querySelector(".clock");
const sectionStopwatch = document.querySelector(".stopwatch");
const sectionTimer     = document.querySelector(".timer");
const sectionAlarm     = document.querySelector(".alarm");

document.body.onload = menu();

function menu() {
    clock();
    stopwatch();
    timer();
    alarm();
    // show latest used section when opened an app
    switch (localStorage.getItem("show-content")) {
        case "clock" :
            sectionClock.style.display = "block";
            menuClock.classList.add("visited");
            break;
        case "stopwatch" :
            sectionStopwatch.style.display = "block";
            menuStopwatch.classList.add("visited");
            break;
        case "timer" :
            sectionTimer.style.visibility = "visible";
            sectionTimer.style.minHeight = "550px";
            sectionTimer.style.height = "100dvh";
            sectionTimer.style.maxHeight = "100vh";
            menuTimer.classList.add("visited");
            break;
        case "alarm" :
            sectionAlarm.style.display = "block";
            menuAlarm.classList.add("visited");
            break;
        default :
            sectionClock.style.display = "block";
            menuClock.classList.add("visited");
    }
    // show/hide section on menu button click; styles for section's list scrolling (top and bottom)
    let menuItems = document.getElementsByClassName("menu-item");
    Array.from(menuItems).forEach(item => {
        item.addEventListener("click", function (event) {
            Array.from(menuItems).forEach(item => { item.classList.remove("visited") }); // remove class from previous menu item
            item.classList.add("visited"); // add class to current clicked menu item
            const menu = document.querySelector("menu");
            // document.querySelector(".meter").style.setProperty("--strokeOffset", `${parseFloat(localStorage.getItem("timerDashOffset"))}`);
            switch (this) {
                case menuClock : {
                    hideSection()
                    sectionClock.style.display = "block";
                    localStorage.setItem("show-content", "clock");
                    let list = document.querySelector(".clock-list");
                    if (list.scrollHeight > list.clientHeight) {
                        menu.classList.add("scrolling");
                        if (list.scrollTop >= (list.scrollHeight - list.offsetHeight)) {
                            menu.classList.remove("scrolling");
                        }
                    } else {
                        menu.classList.remove("scrolling");
                    }
                    break;
                }
                case menuStopwatch : {
                    hideSection()
                    sectionStopwatch.style.display = "block";
                    localStorage.setItem("show-content", "stopwatch");
                    let list = document.querySelector(".laps");
                    if (list.scrollHeight > list.clientHeight) {
                        menu.classList.add("scrolling");
                        if (list.scrollTop >= (list.scrollHeight - list.offsetHeight)) {
                            menu.classList.remove("scrolling");
                        }
                    } else {
                        menu.classList.remove("scrolling");
                    }
                    break;
                }
                case menuTimer : {
                    hideSection()
                    sectionTimer.style.visibility = "visible";
                    sectionTimer.style.minHeight = "550px";
                    sectionTimer.style.height = "100dvh";
                    sectionTimer.style.maxHeight = "100vh";
                    localStorage.setItem("show-content", "timer");
                    menu.classList.remove("scrolling");
                    break;
                }
                case menuAlarm : {
                    hideSection()
                    sectionAlarm.style.display = "block";
                    localStorage.setItem("show-content", "alarm");
                    let list = document.querySelector(".alarm-list");
                    if (list.scrollHeight > list.clientHeight) {
                        menu.classList.add("scrolling");
                        if (list.scrollTop >= (list.scrollHeight - list.offsetHeight)) {
                            menu.classList.remove("scrolling");
                        }
                    } else {
                        menu.classList.remove("scrolling");
                    }
                    break;
                }
            }
            function hideSection() {
                Array.from(document.getElementsByTagName("section")).forEach(section => {
                    if (section.className === "timer") {
                        section.style.visibility = "hidden";
                        section.style.minHeight = "0";
                        section.style.height = "0";
                        section.style.maxHeight = "0";
                    } else {
                        section.style.display = "none";
                    }
                    localStorage.removeItem("show-content");
                })
            }
        });
    })
}

export function checkTime(i) { //add a zero to have 2 digits in clock
    if (i < 10) {i = "0" + i}; 
    return i;
}
// Q/A: https://stackoverflow.com/a/29956714/8122390
export function isScrollable(element) {
    return element.scrollHeight > element.clientHeight;
};