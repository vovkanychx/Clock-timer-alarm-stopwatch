import { clock } from "../js/clock.js";
import { stopwatch } from "../js/stopwatch.js";
import { timer } from "../js/timer.js";
import { alarm } from "../js/alarm.js";

document.body.onload = menu();
document.querySelector(".clock").onload     = clock();
document.querySelector(".stopwatch").onload = stopwatch();
document.querySelector(".timer").onload     = timer();
document.querySelector(".alarm").onload     = alarm();

function menu() {
    // show latest used section when opened an app
    if (localStorage.getItem("show-content") === null) {
        document.querySelector("section.clock").style.display = "block";
        document.getElementById("clock").classList.add("visited");
    } else if (localStorage.getItem("show-content") === "clock") {
        document.querySelector("section.clock").style.display = "block";
        document.getElementById("clock").classList.add("visited");
    } else if (localStorage.getItem("show-content") === "stopwatch") {
        document.querySelector("section.stopwatch").style.display = "block";
        document.getElementById("stopwatch").classList.add("visited");
    } else if (localStorage.getItem("show-content") === "timer") {
        document.querySelector("section.timer").style.display = "block";
        document.getElementById("timer").classList.add("visited");
    } else if (localStorage.getItem("show-content") === "alarm") {
        document.querySelector("section.alarm").style.display = "block";
        document.getElementById("alarm").classList.add("visited");
    }
    // add/remove active class to menu buttons
    let menuItems = document.getElementsByClassName("menu-item");
    Array.from(menuItems).forEach(item => {
        item.addEventListener("click", function (event) {
            // remove class from previous menu item
            Array.from(menuItems).forEach(item => { item.classList.remove("visited") });
            // add class to current clicked menu item
            item.classList.add("visited");
            showSection();
        });
    })
    function showSection() {
        if (document.getElementById("clock").classList.contains("visited")) {
            hideSection();
            document.querySelector("section.clock").style.display = "block";
            localStorage.setItem("show-content", "clock");
        } else if (document.getElementById("stopwatch").classList.contains("visited")) {
            hideSection();
            document.querySelector("section.stopwatch").style.display = "block";
            localStorage.setItem("show-content", "stopwatch");
        } else if (document.getElementById("timer").classList.contains("visited")) {
            hideSection();
            document.querySelector("section.timer").style.display = "block";
            localStorage.setItem("show-content", "timer");
        } else if (document.getElementById("alarm").classList.contains("visited")) {
            hideSection();
            document.querySelector("section.alarm").style.display = "block";
            localStorage.setItem("show-content", "alarm");
        }
        function hideSection() {
            Array.from(document.getElementsByTagName("section")).forEach(section => {
                section.style.display = "none";
                localStorage.removeItem("show-content");
            })
        }
    }
}

export function checkTime(i) { //add a zero to have 2 digits in clock
    if (i < 10) {i = "0" + i}; 
    return i;
}
// Q/A: https://stackoverflow.com/a/29956714/8122390
export function isScrollable(element) {
    return element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;
};

export function fadeOnScroll(list) {
    list.addEventListener("wheel", function (e) { 
        if (Math.abs(list.scrollHeight - list.scrollTop - list.clientHeight) <= document.querySelector("menu").scrollHeight) {
            document.querySelector("menu").style.cssText = "background-color: #010101";
            document.querySelector("menu").style.cssText = "backdrop-filter: unset; background-color: #010101";
            list.lastChild.style.marginBottom = 0;
            document.querySelectorAll("section").forEach(item => { item.style.paddingBottom = 60 + "px" });
        } else {
            document.querySelector("menu").style.cssText = "backdrop-filter: blur(20px); background-color: #1f1f1f80";
            document.querySelectorAll("section").forEach(item => { item.style.paddingBottom = 0 });
            list.lastChild.style.marginBottom = document.querySelector("menu").scrollHeight + "px";
        }
    });
}
// fadeOnScroll(document.querySelector(".laps"));
// fadeOnScroll(document.querySelector(".alarm-list"));
