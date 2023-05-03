import { checkTime } from "../js/script.js";
export function alarm() {
    const date = new Date();
    const alarmAddBtn  = document.getElementById("alarm-add");
    const alarmEditBtn = document.getElementById("alarm-edit");
    const alarmCancel  = document.getElementById("alarm-cancel");
    const alarmSaveBtn = document.getElementById("alarm-save");
    const alarmsList   = document.querySelector(".alarm-list");
    const alarmListHour   = document.getElementById("alarm-select-hour");
    const alarmListMinute = document.getElementById("alarm-select-minute");
    let alarmEditEnable = false;
 
    var alarmStorage = localStorage.getItem("alarmStorage");
    alarmStorage = alarmStorage ? alarmStorage.split(',') : [];

    window.addEventListener("load", function () {
        if (localStorage.getItem("alarmStorage") !== null) {
            alarmEditEnable = true;
            Array.from(localStorage.getItem("alarmStorage").split(",")).forEach(item => {
                let li = alarmsList.appendChild(document.createElement("li")); // list item
                li.outerHTML = item;
            })
        } else {
            return alarmEditEnable = false;
        }
        showEdit();
    });

    // create new alarm and add it to alarm list
    function addToList() {
        let li = alarmsList.appendChild(document.createElement("li")); // list item
        let alarmTime = li.appendChild(document.createElement("p")); // list item time
        let createAlarmToggle = li.appendChild(document.createElement("button")); // list item toggle button
        createAlarmToggle.appendChild(document.createElement("span")).classList.add("circle");
        li.setAttribute("class", "alarm-item item");
        alarmTime.setAttribute("class", "alarm-time");
        createAlarmToggle.setAttribute("class", "alarm-toggle toggle");
        let selectedHour = parseInt(document.getElementById("alarm-select-hour").querySelector(".active").innerText); // get hour from list of options
        let selectedMinute = parseInt(document.getElementById("alarm-select-minute").querySelector(".active").innerText); // get minute from list of options
        li.querySelector(".alarm-time").innerText = checkTime(selectedHour) + ":" + checkTime(selectedMinute);
        // add item to an array and alarmstorage
        alarmStorage.push(li.outerHTML);
        localStorage.setItem("alarmStorage", alarmStorage.toString());
    }

    function showEdit() {
        (alarmsList.childElementCount !== 0) ? alarmEditEnable = true : alarmEditEnable = false;
        if (alarmEditEnable === true) {
            alarmEditBtn.style.visibility = "visible";
        } else if (alarmEditEnable === false) {
            alarmEditBtn.style.visibility = "hidden";
        }
    }

    function removeDeleteButtons(button, delButtonsClass) {
        button.classList.remove("toggle-edit");
        button.innerText = "Edit";
        // remove delete buttons when "done" button clicked
        Array.from(document.getElementsByClassName(`${delButtonsClass}`)).forEach(item => {
            item.style.cssText = "opacity: 0; width: 0; margin-right: 0; visibility: hidden; transiton all 0.5s ease;";
            setTimeout(() => {
                item.remove();
        }, 500);})
    }

    function observeChanges() {
        // code here used from MDN Web Docs https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
        const targetNode = alarmsList;
        // Options for the observer (which mutations to observe)
        const config = { attributes: false, childList: true, subtree: false };
        // Callback function to execute when mutations are observed
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === "childList") {
                    Array.from(document.getElementsByClassName("alarm-toggle")).forEach(item => {
                        item.onclick = () => {
                            item.classList.toggle("toggle");
                        }
                    });
                }
            }
        };
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);
        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    }
    observeChanges();

    // listen for click outside of delete confirm button
    function clickOutsideDeleteButton() {
        let click = 0;
        window.addEventListener("click", function(e){
            click++;
            if (document.querySelector(".confirm-delete") != null) {
                if (click == 2) {
                    if (document.querySelector(".confirm-delete").contains(e.target)) { // Clicked the delete button
                        return
                    } else { // Clicked outside the delete button
                        Array.from(document.getElementsByClassName("confirm-delete")).forEach(item => {
                            item.style.cssText = "width: 0;";
                            item.parentElement.getElementsByTagName("button")[1].style.cssText = "margin-right: 0; opacity: 1;";
                            setTimeout(() => {
                                item.remove();
                            }, 500);
                        })
                    }
                }
            } else { return click = 0 }
        });
    }  

    function createListItems(list, lastItem) {
        for(let i = 0; i < lastItem; i++ ) {
            list.appendChild(document.createElement("li"));
            list.lastChild.innerHTML = checkTime(i);
        }
    }
    createListItems(alarmListHour, 24);
    createListItems(alarmListMinute, 60);

    function removeActiveClass(list) {
        list.querySelectorAll(".active").forEach(item => {
            item.classList.remove("active");
        })
    }

    function clone(list, topValue) {
        let bottomClone = document.createElement("div");
        bottomClone.innerHTML = `<span>00</span><span>01</span><span>02</span>`;
        bottomClone.classList.add("clone", "bottom");
        list.appendChild(bottomClone);
        let upperClone = document.createElement("div");
        upperClone.innerHTML = `<span>${topValue - 2}</span><span>${topValue - 1}</span><span>${topValue}</span>`;
        upperClone.classList.add("clone", "upper");
        list.prepend(upperClone);
    }
    clone(alarmListHour, 23);
    clone(alarmListMinute, 59);

    function loopScroll (startPosition, list, topValue) {
        let counter = startPosition;
        list.getElementsByTagName("li")[startPosition].classList.add("active");
        list.scrollTop = counter * list.firstElementChild.offsetHeight;
        return list.addEventListener("wheel", function (e) {
            const elementHeight = list.firstElementChild.offsetHeight;
            e.preventDefault();
            if (e.deltaY < 0) { 
                // scrolling up
                if (counter == 0) {
                    removeActiveClass(list);
                    counter = topValue;
                    list.getElementsByTagName("li")[counter].classList.add("active");
                    list.scrollTop = counter * list.firstElementChild.offsetHeight;
                } else {
                    counter--;
                    list.scrollBy({top: -elementHeight, left: 0, behavior: "auto"});
                    removeActiveClass(list);
                    list.getElementsByTagName("li")[counter].classList.add("active");
                }
            } else if (e.deltaY > 0) {
                // scrolling down
                if (counter == topValue) {
                    removeActiveClass(list);
                    counter = 0;
                    list.getElementsByTagName("li")[counter].classList.add("active");
                    list.scrollTop = counter * list.firstElementChild.offsetHeight;
                } else {
                    counter++;
                    list.scrollBy({top: elementHeight, left: 0, behavior: "auto"});
                    removeActiveClass(list);
                    list.getElementsByTagName("li")[counter].classList.add("active");
                }
            }
        });
    }

    function toggleEdit(list, button, buttonClass, listItems, delButtonsClass, delButtonsAnimation, cssHideDelButtons, confirmButtonClass, confirmButtonAnimation) {
        if (button.classList.contains(`${buttonClass}`)) { // if edit was already clicked 
            button.innerText = "Edit";
            button.classList.remove(`${buttonClass}`);
            // hide delete buttons
            Array.from(listItems).forEach(item => {
                item.firstChild.style.cssText = cssHideDelButtons;
                setTimeout(() => {
                    item.firstChild.remove();
                }, 250);
            });
        } else if (!button.classList.contains(`${buttonClass}`)) { // if edit was not already clicked 
            button.classList.add(`${buttonClass}`);
            button.innerText = "Done";
            // create 1st delete button on each list item
            Array.from(listItems).forEach(item => {
                let deleteAsk = document.createElement("button"); 
                item.prepend(deleteAsk);
                deleteAsk.classList.add(`${delButtonsClass}`);
                deleteAsk.style.animation = `${delButtonsAnimation}`;
            });
        }
        for (let i = 0; i < listItems.length; i++) {
            let delButtons = document.getElementsByClassName(`${delButtonsClass}`);
            // click on delete button of any list item
            delButtons[i].addEventListener("click", function (e) {
                let arrayIndex = i;
                if (list.contains(document.querySelector(`.${confirmButtonClass}`))) { 
                    // return if there's already confirm delete button
                    return
                } else if (!list.contains(document.querySelector(`.${confirmButtonClass}`))) {
                    // move item's toggle button to left
                    let toggle = this.parentElement.lastChild;
                    toggle.style.cssText = "margin-right: 121px; opacity: 0.25;";
                    // if there is not any confirm delete button > create one
                    let confirmButton = this.parentElement.appendChild(document.createElement("button"));
                    confirmButton.classList.add(`${confirmButtonClass}`);
                    confirmButton.innerText = "Delete";
                    confirmButton.style.animation = confirmButtonAnimation;
                    // handle confirm delete button's click
                    confirmButton.addEventListener("click", function () {
                        // enable alarm item's toggle button
                        this.style.cssText = "width: 100vw;";
                        this.parentElement.style.cssText = "transform: translateX(-100vw); transition: all 0.5s ease";
                        // remove item from list
                        setTimeout(() => {
                            this.parentElement.remove();
                            alarmStorage.splice(arrayIndex, 1);
                            localStorage.setItem("alarmStorage", alarmStorage.toString());
                            showEdit();
                        }, 500);
                    });
                    // if clicked anywhere but confirm delete button then hide and remove it
                    clickOutsideDeleteButton(); 
                }
            });
        }
    }
    
    // open modal
    alarmAddBtn.addEventListener("click", function () {
        document.querySelector(".alarm-popup").classList.add("opened");
        let delButtonsClass = "delete-buttons";
        // if "edit" button toggled, stop the action of editing
        if (alarmEditBtn.classList.contains("toggle-edit") === true) {
            setTimeout(() => {
                removeDeleteButtons(alarmEditBtn, delButtonsClass);
            }, 300);
        }
        loopScroll(date.getHours(), alarmListHour, 23);
        loopScroll(date.getMinutes(), alarmListMinute, 59);
    })
    
    alarmEditBtn.addEventListener("click", function () {
        let list = alarmsList;
        let button = this;
        let buttonClass = "toggle-edit";
        let listItems = document.getElementsByClassName("alarm-item");
        let delButtonsClass = "delete-buttons";
        let delButtonsAnimation = "itemsDeleteButtons 0.5s ease";
        let cssHideDelButtons = "opacity: 0; max-width: 0; min-width: 0; width: 0; margin-right: 0; visibility: hidden; transiton all 0.25s ease;";
        let confirmButtonClass = "confirm-delete";
        let confirmButtonAnimation = "confirmDelete 0.5s ease"
        toggleEdit(list, button, buttonClass, listItems, delButtonsClass, delButtonsAnimation, cssHideDelButtons, confirmButtonClass, confirmButtonAnimation);
    }); 
    
    // add new alarm to alarm list
    alarmSaveBtn.addEventListener("click", function () {
        addToList();
        // show edit button
        alarmEditEnable = true;
        showEdit();
        document.querySelector(".alarm-popup").classList.remove("opened");
        // for (let i = 0; i < document.getElementsByClassName("alarm-item").length; i++) {
        //     document.getElementsByClassName("alarm-item")[i].addEventListener("click", function (event) {
        //         if (event.target == this.querySelector(".alarm-time") || event.target == this.querySelector(".alarm-toggle")) {
        //             console.log(0);
        //             return
        //         } else if (event.target == this) {
        //             document.querySelector(".alarm-popup").classList.add("opened");
        //             let listItem = this;
        //             alarmSaveBtn.addEventListener("click", function () {
        //                 listItem.querySelector(".alarm-time").innerText = alarmListHour.querySelector(".active").innerText + ":" + alarmListMinute.querySelector(".active").innerText;
        //             })
        //         }
        //     });
        // }
    })

    // close modal
    alarmCancel.addEventListener("click", function () {
        document.querySelector(".alarm-popup").classList.remove("opened");
    })
}