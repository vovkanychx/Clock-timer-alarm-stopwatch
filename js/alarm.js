import { checkTime } from "../js/script.js";
export function alarm() {
    const alarmAdd  = document.getElementById("alarm-add");
    const alarmEdit = document.getElementById("alarm-edit");
    const alarmCancel  = document.getElementById("alarm-cancel");
    const alarmSave = document.getElementById("alarm-save");
    const alarmList   = document.querySelector(".alarm-list");
    const alarmListHour   = document.getElementById("alarm-select-hour");
    const alarmListMinute = document.getElementById("alarm-select-minute");
    let alarmEditEnable = false;
 
    var alarmStorage = localStorage.getItem("alarmStorage");
    alarmStorage = alarmStorage ? alarmStorage.split(',') : [];

    window.addEventListener("load", function () {
        if (localStorage.getItem("alarmStorage") !== null) {
            alarmEditEnable = true;
            Array.from(localStorage.getItem("alarmStorage").split(",")).forEach(item => {
                let li = alarmList.appendChild(document.createElement("li")); // list item
                li.outerHTML = item;
            })
        } else {
            return alarmEditEnable = false;
        }
        showEdit();
        enableToggleAndSaveToStorage();
    });

    function enableToggleAndSaveToStorage() {
        alarmList.querySelectorAll(".alarm-toggle").forEach((button, index) => {
            button.addEventListener("click", () => {
                button.classList.toggle("toggle");
                alarmStorage[index] = alarmList.getElementsByTagName("li")[index].outerHTML;
                localStorage.removeItem("alarmStorage");
                localStorage.setItem("alarmStorage", alarmStorage.toString());
            });
        });
    }

    function observeChanges() {
        // code here used from MDN Web Docs https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
        const targetNode = alarmList;
        // Options for the observer (which mutations to observe)
        const config = { attributes: false, childList: true, subtree: false };
        // Callback function to execute when mutations are observed
        const callback = (mutationList, observer) => {
            const menu = document.querySelector("menu");
            for (const mutation of mutationList) {
                if (mutation.type === "childList") {
                    enableToggleAndSaveToStorage();
                }
                if (mutation.target.children.length > 2) {
                    alarmEdit.style.visibility = "visible";
                    alarmAdd.addEventListener("click", () => setTimeout(() => {
                        alarmAdd.style.visibility = "hidden"
                        alarmEdit.style.visibility = "hidden";
                    }, 150));
                } else {
                    alarmEdit.style.visibility = "hidden";
                }
                if (mutation.type === "childList" && targetNode.scrollHeight > targetNode.clientHeight + 60) {
                    menu.classList.add("scrolling");
                } else {
                    menu.classList.remove("scrolling");
                }
            }
        };
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);
        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    }
    observeChanges();

    setTimeout(() => {
        if (alarmList.scrollHeight > alarmList.clientHeight) {document.querySelector("menu").classList.add("scrolling")}
    }, 20);

    // create new alarm and add it to alarm list
    function addToList() {
        let li = alarmList.appendChild(document.createElement("li")); // list item
        let alarmTime = li.appendChild(document.createElement("p")); // list item time
        let createAlarmToggle = li.appendChild(document.createElement("button")); // list item toggle button
        createAlarmToggle.appendChild(document.createElement("span")).classList.add("circle");
        li.setAttribute("class", "alarm-item item");
        alarmTime.setAttribute("class", "alarm-time");
        createAlarmToggle.setAttribute("class", "alarm-toggle toggle");
        let selectedHour = parseInt(document.getElementById("alarm-select-hour").querySelector(".active").innerText); // get hour from list of options
        let selectedMinute = parseInt(document.getElementById("alarm-select-minute").querySelector(".active").innerText); // get minute from list of options
        li.querySelector(".alarm-time").innerText = checkTime(selectedHour) + ":" + checkTime(selectedMinute);
    }

    function showEdit() {
        (alarmList.childElementCount !== 0) ? alarmEditEnable = true : alarmEditEnable = false;
        if (alarmEditEnable === true) {
            alarmEdit.style.visibility = "visible";
        } else if (alarmEditEnable === false) {
            alarmEdit.style.visibility = "hidden";
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

    // listen for click outside of delete confirm button
    function clickOutsideDeleteButton() {
        let click = 0;
        window.addEventListener("click", function(e){
            click++;
            if (alarmList.querySelector(".confirm-delete") != null) {
                if (click == 2) {
                    if (alarmList.querySelector(".confirm-delete").contains(e.target)) { // Clicked the delete button
                        return
                    } else { // Clicked outside the delete button
                        Array.from(alarmList.getElementsByClassName("confirm-delete")).forEach(item => {
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
        const elementHeight = list.getElementsByTagName("li")[0].offsetHeight;
        const cloneUpperDiv = list.querySelector(".clone.upper");
        const cloneUpperDivMargin = parseFloat(window.getComputedStyle(cloneUpperDiv).getPropertyValue("margin"));
        const cloneUpperDivHeight = cloneUpperDiv.offsetHeight + cloneUpperDivMargin;
        list.scrollTop = ((cloneUpperDivHeight + (startPosition * elementHeight)) - ((list.offsetHeight / 2) - (elementHeight / 2)))
        list.addEventListener("wheel", function (e) {
            e.preventDefault();
            if (e.deltaY < 0) { 
                // scrolling up
                if (counter == 0) {
                    removeActiveClass(list);
                    counter = topValue;
                    scrollAddClass(list, counter)
                } else {
                    counter--;
                    removeActiveClass(list);
                    scrollAddClass(list, counter)
                }
            } else if (e.deltaY > 0) {
                // scrolling down
                if (counter == topValue) {
                    removeActiveClass(list);
                    counter = 0;
                    scrollAddClass(list, counter)
                } else {
                    counter++;
                    removeActiveClass(list);
                    scrollAddClass(list, counter)
                }
            }
        });
        function scrollAddClass(list, counter) {
            list.scrollTop = (counter * elementHeight) + elementHeight;
            list.getElementsByTagName("li")[counter].classList.add("active");
        }
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
            let delButtons = list.getElementsByClassName(`${delButtonsClass}`);
            // click on delete button of any list item
            delButtons[i].addEventListener("click", function (e) {
                let arrayIndex = i;
                if (list.contains(list.querySelector(`.${confirmButtonClass}`))) { 
                    // return if there's already confirm delete button
                    return
                } else if (!list.contains(list.querySelector(`.${confirmButtonClass}`))) {
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
    alarmAdd.addEventListener("click", function () {
        document.querySelector(".alarm-popup").classList.add("opened");
        document.querySelector(".alarm .block-top-title").style.visibility = "hidden";
        let delButtonsClass = "delete-buttons";
        // if "edit" button toggled, stop the action of editing
        if (alarmEdit.classList.contains("toggle-edit") === true) {
            setTimeout(() => {
                removeDeleteButtons(alarmEdit, delButtonsClass);
            }, 300);
        }
        const date = new Date();
        loopScroll(date.getHours(), alarmListHour, 23);
        loopScroll(date.getMinutes(), alarmListMinute, 59);
        enableToggleAndSaveToStorage();
    })
    
    alarmEdit.addEventListener("click", function () {
        let list = alarmList;
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
    alarmSave.addEventListener("click", function () {
        addToList();
        // show edit button
        alarmEditEnable = true;
        showEdit();
        alarmAdd.style.visibility = "visible";
        document.querySelector(".alarm-popup").classList.remove("opened");
        document.querySelector(".alarm .block-top-title").style.visibility = "visible";

    })

    // close modal
    alarmCancel.addEventListener("click", function () {
        document.querySelector(".alarm-popup").classList.remove("opened");
        if (alarmList.childElementCount > 2) {
            alarmEdit.style.visibility = "visible";
            alarmAdd.style.visibility = "visible";
        } else {
            alarmEdit.style.visibility = "hidden";
            alarmAdd.style.visibility = "hidden";
        }
        document.querySelector(".alarm .block-top-title").style.visibility = "visible";
    })

    alarmList.addEventListener("scroll", function () {
        document.querySelector(".alarm .block-top").classList.add("scrolling");
        document.querySelector(".alarm .block-top-title").classList.add("scrolling");
        if (this.scrollTop <= 0) {
            document.querySelector(".alarm .block-top").classList.remove("scrolling");
            document.querySelector(".alarm .block-top-title").classList.remove("scrolling");
        } 
        if (this.scrollTop >= (this.scrollHeight - this.offsetHeight)) {
            document.querySelector("menu").classList.remove("scrolling");
        } else {
            document.querySelector("menu").classList.add("scrolling");
        }
    })
}