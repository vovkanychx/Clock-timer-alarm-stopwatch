import { checkTime, menu as menu } from "../js/script.js";

export function alarm() {
    const alarmAdd  = document.getElementById("alarm-add");
    const alarmEdit = document.getElementById("alarm-edit");
    const alarmCancel  = document.getElementById("alarm-cancel");
    const alarmSave = document.getElementById("alarm-save");
    const alarmList   = document.querySelector(".alarm-list");
    const alarmListHour   = document.getElementById("alarm-select-hour");
    const alarmListMinute = document.getElementById("alarm-select-minute");
    const alarmLabelInput = document.getElementById("alarm-input");
    const alarmClearInputButton = document.querySelector(".alarm-input-clear");
    const alarmSetSoundModal = document.querySelector(".alarm .set_sound")
    const alarmSetSoundButton = document.querySelector(".alarm-sound");
    const alarmSetSoundBackButton = document.getElementById("back_button");
    const alarmRingtonesList = document.querySelector(".alarm .set_sound-ringtones");
    const popup = document.getElementById("alarm_complete");
    const closeButton = document.getElementById("alarm_complete-close_button");
    const noRingtoneButton = document.getElementById("button_none");
    let alarmEditEnable = false;
    let inputVal;
    let selectedSound;
    let defaultSelectedSound = "Alarm";
 
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
        setInterval(startAlarm, 1000);
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
                if (mutation.type === "childList" && targetNode.scrollHeight > (targetNode.clientHeight - menu.offsetHeight)) {
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

    // create new alarm and add it to alarm list
    function addToList() {
        let li = alarmList.appendChild(document.createElement("li")); // list item (alarm)
        let alarmTime = li.appendChild(document.createElement("p")); // alarm time
        let createAlarmToggle = li.appendChild(document.createElement("button")); // alarm toggle button
        let alarmLabel = document.createElement("span"); // list item ringtone name
        createAlarmToggle.appendChild(document.createElement("span")).classList.add("circle"); // toggle button circle
        li.setAttribute("class", "alarm-item item"); // list item class
        li.setAttribute("ringtone-name", selectedSound.toLowerCase()); // set alarm selected sound to acces and play it when alarm is complete
        alarmTime.setAttribute("class", "alarm-time"); // alarm time class
        createAlarmToggle.setAttribute("class", "alarm-toggle toggle"); // alarm toggle button class
        let selectedHour = parseInt(document.getElementById("alarm-select-hour").querySelector(".active").innerText); // get hour from list of options
        let selectedMinute = parseInt(document.getElementById("alarm-select-minute").querySelector(".active").innerText); // get minute from list of options
        alarmTime.innerText = checkTime(selectedHour) + ":" + checkTime(selectedMinute); // show time
        alarmLabel.classList.add("ringtone-name");
        alarmLabel.innerText = inputVal; // show label set for alarm
        alarmTime.appendChild(alarmLabel);
        // add new item to alarmstorage
        alarmStorage.push(li.outerHTML);
        localStorage.removeItem("alarmStorage");
        localStorage.setItem("alarmStorage", alarmStorage.toString());
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
        for(let i = 0; i < lastItem; i++) {
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
        list.querySelectorAll(".active").forEach(active => { active.classList.remove("active") });
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

    // play sound when alarm is completed
    function completePopupPlaySound (alarmItem, audioElement) {
        if (selectedSound.toLowerCase() == noRingtoneButton.innerText.toLowerCase()) { return }
        let soundName = alarmItem.getAttribute("ringtone-name");
        audioElement.src = `https://vovkanychx.github.io/Clock-timer-alarm-stopwatch/ringtones/${soundName}.mp3`;
        audioElement.loop = true;
        audioElement.play();
    }

    // show popup
    function showCompletePopup(alarmItem) {
        const popupHeading = document.getElementById("alarm_complete-heading");
        const popupLabel = document.getElementById("alarm_complete-label");
        popupHeading.innerText = "Alarm";
        popupLabel.innerText = alarmItem.querySelector(".ringtone-name").innerText;
        popup.style.top = "0";
    }

    // close popup handler
    function closeCompletePopup(popupEl, audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
        const styleValue = getComputedStyle(popupEl).getPropertyValue("--completeHiddenValue");
        popupEl.style.top = styleValue;
    }

    // execute when alarm is completed
    function alarmComplete(alarmItem) {
        let audio = new Audio();
        completePopupPlaySound (alarmItem, audio);
        showCompletePopup(alarmItem);
        closeButton.addEventListener("click", () => {
            return closeCompletePopup(popup, audio);
        });
    }
    
    function startAlarm() {
        alarmList.querySelectorAll(".alarm-toggle").forEach((toggle, index) => {
            const date = new Date();
            let curHours = date.getHours();
            let curMinutes = date.getMinutes();
            let curSeconds = date.getSeconds();
            let alarmHours = parseInt(toggle.parentElement.querySelector(".alarm-time").innerText.split(":")[0]);
            let alarmMinutes = parseInt(toggle.parentElement.querySelector(".alarm-time").innerText.split(":")[1]);
            let alarmSeconds = 0;
            const isAlarmOff = (curHours == alarmHours && curMinutes == alarmMinutes && curSeconds == alarmSeconds);
            if (toggle.classList.contains("toggle") && isAlarmOff) {
                toggle.classList.remove("toggle");
                alarmStorage[index] = alarmList.getElementsByTagName("li")[index].outerHTML;
                localStorage.removeItem("alarmStorage");
                localStorage.setItem("alarmStorage", alarmStorage.toString());
                return alarmComplete(toggle.parentElement);
            } else {
                return
            }
        })
    }

    // make http request to retrieve data from repo/filter it and get list of ringtones names
    function getRingtonesList() {
        var ringtonesNamesArray = [];
        let call = new XMLHttpRequest();
        let url = 'https://api.github.com/repos/vovkanychx/Clock-timer-alarm-stopwatch/git/trees/master?recursive=1' // github API
        call.open("GET", url, true);
        call.onreadystatechange = function () {
            // status 200 - "OK", readyState 4 - request is finished and repsonse is ready
            if (this.readyState == 4 && this.status == 200) {
                    let repoListing = JSON.parse(this.responseText);
                    for (let key in repoListing.tree) {
                        let listing = repoListing.tree[key];
                        if (listing.path.includes("ringtones/")) {
                            let ringtoneName = listing.path.split("/")[1].split(".")[0]; // path: {path/filename.format} -> filename.format -> filename
                            ringtonesNamesArray.push(ringtoneName);
                        }
                    }
                    if (alarmRingtonesList.querySelectorAll("li").length === 0) {
                        appendItemsToRingtonesList(alarmRingtonesList, ringtonesNamesArray);
                    } else {
                        return;
                    }
                }
            }
        call.send();
    }
    getRingtonesList();
    
    // create and append li to ringtones list in DOM
    function appendItemsToRingtonesList(list, arr) {
        arr.forEach(item => {
            let li = document.createElement("li");
            // li.setAttribute("checked", false);
            let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.classList.add("set_sound-check_icon");
            svg.setAttribute("viewBox", "0 0 16 16");
            let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", "M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z");
            path.setAttribute("fill", "#ffa500"); 
            svg.appendChild(path);
            let button = document.createElement("button");
            li.appendChild(svg);
            li.appendChild(button);
            button.innerText = item;
            list.appendChild(li);
        })
        handleRingtoneClick();
    }

    // play/pause audio element (works on IOS aswell)
    function playAudio(htmlElement, soundName) {
        let ringtoneName = soundName.toLowerCase();
        let audioElement = document.createElement("audio");
        audioElement.setAttribute("id", `${ringtoneName}-ringtone`);
        let audioElementSource = document.createElement("source");
        audioElementSource.setAttribute("src", `https://vovkanychx.github.io/Clock-timer-alarm-stopwatch/ringtones/${ringtoneName}.mp3`);
        audioElementSource.setAttribute("type", "audio/mp3");
        audioElement.appendChild(audioElementSource);
        htmlElement.appendChild(audioElement);
        if (audioElement.paused) {
            alarmRingtonesList.querySelectorAll("audio").forEach(audio => {audio.pause(); audio.currentTime = 0;});
            audioElement.play();
        } else {
            audioElement.pause();
            audioElement.currentTime = 0;
        }
    }

    // execute code when clicked on ringtone in ringtones list
    function handleRingtoneClick() {
        alarmRingtonesList.querySelectorAll("li").forEach(li => {
            li.addEventListener("click", function (e) {
                e.preventDefault();
                // add checked attribute for li that was clicked
                li.parentElement.querySelectorAll("li").forEach(li => li.setAttribute("checked", false));
                li.setAttribute("checked", true);
                // add check icon to selected list item
                noRingtoneButton.querySelector("svg").style.visibility = "hidden";
                li.parentElement.querySelectorAll("svg").forEach(svg => svg.style.visibility = "hidden");
                li.querySelector("svg").style.visibility = "visible";
                selectedSound = li.innerText;
                alarmSetSoundButton.querySelector("span").innerText = selectedSound;
            });
            li.onclick = () => {
                let soundName = li.innerText;
                return playAudio(li, soundName);
            }
        })
    }

    function resetCheckedRingtone() {
        alarmRingtonesList.querySelectorAll("li").forEach((li, index) => {
            // li.setAttribute("checked", false);
            li.querySelector("svg").style.visibility = "hidden";
            if (index === 0) { 
                // li.setAttribute("checked", true);
                li.querySelector("svg").style.visibility = "visible";
            }
        });
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
        alarmAdd.style.visibility = "hidden";
        const date = new Date();
        loopScroll(date.getHours(), alarmListHour, 23);
        loopScroll(date.getMinutes(), alarmListMinute, 59);
        enableToggleAndSaveToStorage();
        alarmLabelInput.value = null;
        inputVal = "Alarm";
        alarmClearInputButton.style.display = "none";
        alarmSetSoundButton.querySelector("span").innerText = defaultSelectedSound;
        resetCheckedRingtone();
        selectedSound = defaultSelectedSound;
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
        noRingtoneButton.querySelector("svg").style.visibility = "hidden";
    })

    // close modal
    alarmCancel.addEventListener("click", function () {
        document.querySelector(".alarm-popup").classList.remove("opened");
        if (alarmList.childElementCount > 2) {
            alarmEdit.style.visibility = "visible";
            alarmAdd.style.visibility = "visible";
        } else if (alarmList.childElementCount === 2) {
            alarmEdit.style.visibility = "hidden";
            alarmAdd.style.visibility = "visible";
        } else {
            alarmEdit.style.visibility = "hidden";
            alarmAdd.style.visibility = "hidden";
        }
        document.querySelector(".alarm .block-top-title").style.visibility = "visible";
        selectedSound = defaultSelectedSound;
        noRingtoneButton.querySelector("svg").style.visibility = "hidden";
    })

    // add scrolling classes to menu and block-top
    alarmList.addEventListener("scroll", function () {
        document.querySelector(".alarm .block-top").classList.add("scrolling");
        document.querySelector(".alarm .block-top-title").classList.add("scrolling");
        if (this.scrollTop <= 0) {
            document.querySelector(".alarm .block-top").classList.remove("scrolling");
            document.querySelector(".alarm .block-top-title").classList.remove("scrolling");
        } 
        if (this.scrollTop >= (this.scrollHeight - this.offsetHeight)) {
            menu.classList.remove("scrolling");
        } else {
            menu.classList.add("scrolling");
        }
    })
    
    // show/hide clear button in alarm-options input
    alarmLabelInput.addEventListener("input", function (e) {
        switch (e.target.value) {
            case null:
                this.nextElementSibling.style.display = "none";
                inputVal = "Alarm";
                break;
            case "":
                this.nextElementSibling.style.display = "none";
                inputVal = "Alarm";
                break;
            case " ":
                this.nextElementSibling.style.display = "block";
                e.target.value = "";
                inputVal = "Alarm";
                break;
            default:
                this.nextElementSibling.style.display = "block";
                inputVal = e.target.value;
                break;
        }
    })
    
    // if input value starts with spacebars or was added spacebars to the start
    alarmLabelInput.addEventListener("keydown", e => {
        if (e.key == " " || e.code == "Space" || /^\s/.test(e.target.value)) {
            return e.target.value = e.target.value.trimStart();
        }
    })

    alarmClearInputButton.addEventListener("click", function () {
        this.style.display = "none";
        alarmLabelInput.value = null;
        alarmLabelInput.focus();
    })

    alarmSetSoundButton.addEventListener("click", function (e) {
        e.preventDefault();
        alarmSetSoundModal.style.left = "0";
    })

    noRingtoneButton.addEventListener("click", function (e) {
        alarmRingtonesList.querySelectorAll("svg").forEach( svg => svg.style.visibility = "hidden" );
        this.querySelector("svg").style.visibility = "visible";
        selectedSound = e.target.innerText;
        alarmSetSoundButton.querySelector("span").innerText = selectedSound;
    })

    alarmSetSoundBackButton.addEventListener("click", function (e) {
        alarmSetSoundModal.style.left = "100%";
        alarmRingtonesList.querySelectorAll("audio").forEach(audio => {audio.pause(); audio.currentTime = 0});
        console.log(selectedSound)
    })
    
    alarmSetSoundModal.addEventListener("scroll", function (e) {
        const alarmSetSoundHeader = document.querySelector(".alarm .set_sound-buttons");
        if (e.target.scrollTop > 0) {
            alarmSetSoundHeader.classList.add("scrolling");
        } else if (e.target.scrollTop <= 0) {
            alarmSetSoundHeader.classList.remove("scrolling");
        } 
    })
}