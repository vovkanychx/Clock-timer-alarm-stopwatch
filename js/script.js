import { clock } from "../js/clock.js";
import { stopwatch } from "../js/stopwatch.js";
import { timer } from "../js/timer.js";
import { alarm } from "../js/alarm.js";

export const menu      = document.querySelector("menu")
const menuClock        = document.getElementById("clock");
const menuStopwatch    = document.getElementById("stopwatch");
const menuTimer        = document.getElementById("timer");
const menuAlarm        = document.getElementById("alarm");
const sectionClock     = document.querySelector(".clock");
const sectionStopwatch = document.querySelector(".stopwatch");
const sectionTimer     = document.querySelector(".timer");
const sectionAlarm     = document.querySelector(".alarm");

document.body.onload = main();

function main() {
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
        item.addEventListener("click", function (e) {
            Array.from(menuItems).forEach(item => { item.classList.remove("visited") }); // remove class from previous menu item
            item.classList.add("visited"); // add class to current clicked menu item
            const menu = document.querySelector("menu");
            // document.querySelector(".meter").style.setProperty("--strokeOffset", `${parseFloat(localStorage.getItem("timerDashOffset"))}`);
            switch (e.currentTarget) {
                case menuClock : {
                    hideSection()
                    sectionClock.style.display = "block";
                    localStorage.setItem("show-content", "clock");
                    let list = document.querySelector(".clock-list");
                    menuAddScrollingClass(list)
                    if (list.childElementCount > 1) {
                        list.querySelectorAll("li").forEach((li, index) => {
                            li.style.top = (li.offsetHeight * index) + list.querySelector("h1").offsetHeight + "px";
                            li.style.transition = "top 0s";
                        })
                    }
                    break;
                }
                case menuStopwatch : {
                    hideSection()
                    sectionStopwatch.style.display = "block";
                    localStorage.setItem("show-content", "stopwatch");
                    let list = document.querySelector(".laps");
                    menuAddScrollingClass(list)
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
                    sectionTimer.querySelector("#hours").scrollTop = Number(sectionTimer.querySelector("#hours .active").innerText) * sectionTimer.querySelector("#hours .active").offsetHeight
                    sectionTimer.querySelector("#minutes").scrollTop = Number(sectionTimer.querySelector("#minutes .active").innerText) * sectionTimer.querySelector("#minutes .active").offsetHeight
                    sectionTimer.querySelector("#seconds").scrollTop = Number(sectionTimer.querySelector("#seconds .active").innerText) * sectionTimer.querySelector("#seconds .active").offsetHeight
                    break;
                }
                case menuAlarm : {
                    hideSection()
                    sectionAlarm.style.display = "block";
                    localStorage.setItem("show-content", "alarm");
                    let list = document.querySelector(".alarm-list");
                    menuAddScrollingClass(list)
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
    return element.scrollHeight > element.clientHeight
}

function menuAddScrollingClass(list) {
    if (isScrollable(list)) {
        menu.classList.add("scrolling");
        if (Math.floor(list.scrollTop) === Math.floor(list.scrollHeight - list.offsetHeight)) {
            menu.classList.remove("scrolling");
        }
    } else {
        menu.classList.remove("scrolling");
    }
}