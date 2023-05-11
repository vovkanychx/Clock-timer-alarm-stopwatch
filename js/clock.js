import { checkTime } from "../js/script.js";
export function clock() {
    const clockEdit     = document.getElementById("clock-edit");
    const clockAdd      = document.getElementById("clock-add");
    const searchInput   = document.getElementById("search");
    const cancelSearch  = document.getElementById("search-cancel");
    const clearSearch   = document.getElementById("clear-search-input");
    const timeZoneList  = document.querySelector(".timezone-list");
    const timeZoneItem  = document.getElementsByClassName("timezone-item");
    const timeZoneNav   = document.querySelector(".timezone-navigation");
    const clockList     = document.querySelector(".clock-list");
    let GMToffsetArray        = [];
    let unSortedCities        = [];
    let formatedGMTArray      = [];
    let unformatedGMTArray    = [];
    let clockItemsArray       = [];
    let clockEditEnable = false;

    var clockStorage  = localStorage.getItem("clockStorage");
    var storageOffset = localStorage.getItem("clockOffset");
    var storageCity   = localStorage.getItem("clockCity");
    var storageDay    = localStorage.getItem("clockDay");
    var storageTime   = localStorage.getItem("clockTime");
    clockStorage  = clockStorage ? clockStorage.split(",") : [];
    storageOffset = storageOffset ? storageOffset.split(",") : [];
    storageCity   = storageCity ? storageCity.split(",") : [];
    storageDay    = storageDay ? storageDay.split(",") : [];
    storageTime   = storageTime ? storageTime.split(",") : [];

    window.addEventListener("load", function () {
        if (localStorage.getItem("clockStorage") !== null) {
            clockEditEnable = true;
            const date = new Date();
            Array.from(localStorage.getItem("clockStorage").split(">,")).forEach((item, index) => {
                let offset = Number(localStorage.getItem("clockOffset").split(",")[index]);
            });
        } else {
            return clockEditEnable = false;
        }
        showEdit();
        setInterval(refreshTime, 1000);
    });
    
    clockAdd.addEventListener("click", function () {
        document.querySelector(".timezone.fade-up").classList.add("opened");
        document.querySelector(".block-top").style.visibility = "hidden";
        clearSearch.style.visibility = "hidden";
        //make http request for json data
        const xmlhttp = new XMLHttpRequest();
        
        xmlhttp.onload = function() {
            const jsonData = JSON.parse(this.responseText);
            //create list with list items as "city, country"
            let listItem = "<span class='separator'>";
            for (let i in jsonData) {
                listItem += `<li class="timezone-item">
                                <span>${jsonData[i].city}</span>, ${jsonData[i].country}
                            </li>`;
                unSortedCities.push(jsonData[i].city);
                GMToffsetArray.push(jsonData[i].offset);
            }
            listItem += "</span>";
            timeZoneList.innerHTML = listItem;
            addCityToList();
            Array.from(timeZoneList.getElementsByTagName("li"))
                .sort((a, b) => a.textContent.localeCompare(b.textContent))
                .forEach(li => { timeZoneList.appendChild(li);
            }); //sort cities alphabetically in list
            alphabetFilter();
        }
        xmlhttp.open("GET", "js/data.json");
        xmlhttp.send();
        let delButtonsClass = "delete-buttons";
        // if "edit" button toggled, stop the action of editing
        if (clockEdit.classList.contains("toggle-edit") === true) {
            clockEdit.classList.remove("toggle-edit");
            setTimeout(() => {
                removeDeleteButtons(clockEdit, delButtonsClass);
            }, 300);
        }
    });

    cancelSearch.addEventListener("click", function () {
        document.querySelector(".timezone.fade-up").classList.remove("opened");
        document.querySelector(".block-top").style.visibility = "visible";
        timeZoneList.classList.remove("no-match");
        searchInput.value = null;
    });

    clockEdit.addEventListener("click", function () {
        let list = clockList;
        let button = this;
        let buttonClass = "toggle-edit";
        let listItems = document.getElementsByClassName("clock-item");
        let delButtonsClass = "delete-buttons";
        let delButtonsAnimation = "itemsDeleteButtons 0.5s ease";
        let cssHideDelButtons = "opacity: 0; max-width: 0; min-width: 0; width: 0; margin-right: 0; visibility: hidden; transiton all 0.25s ease;";
        let confirmButtonClass = "confirm-delete";
        let confirmButtonAnimation = "confirmDelete 0.5s ease"
        toggleEdit(list, button, buttonClass, listItems, delButtonsClass, delButtonsAnimation, cssHideDelButtons, confirmButtonClass, confirmButtonAnimation);
    });

    function toggleEdit(list, button, buttonClass, listItems, delButtonsClass, delButtonsAnimation, cssHideDelButtons, confirmButtonClass, confirmButtonAnimation) {
        if (button.classList.contains(`${buttonClass}`)) { // if edit was already clicked 
            button.innerText = "Edit";
            button.classList.remove(`${buttonClass}`);
            // hide delete buttons
            Array.from(listItems).forEach(item => {
                item.getElementsByTagName("button")[0].style.cssText = cssHideDelButtons;
                setTimeout(() => {
                    item.getElementsByTagName("button")[0].remove();
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
            let itemToDelete = i;
            let delButtons = document.getElementsByClassName(`${delButtonsClass}`);
            // click on delete button of any list item
            delButtons[i].addEventListener("click", function (e) {
                if (list.contains(document.querySelector(`.${confirmButtonClass}`))) {
                    // return if there's already confirm delete button
                    return
                } else if (!list.contains(document.querySelector(`.${confirmButtonClass}`))) {
                    // move item's toggle button to left
                    let toggle = this.parentElement.lastChild;
                    toggle.style.cssText = "margin-right: 121px;";
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
                            clockItemsArray.splice(itemToDelete, 1);
                            formatedGMTArray.splice(itemToDelete, 1);
                            unformatedGMTArray.splice(itemToDelete, 1);
                            storageOffset.splice(itemToDelete, 1);
                            localStorage.setItem("clockOffset", storageOffset.toString());
                            clockStorage.splice(itemToDelete, 1);
                            localStorage.removeItem("clockStorage");
                            localStorage.setItem("clockStorage", clockStorage.toString());
                            showEdit();
                        }, 500);
                    });
                    // if clicked anywhere but confirm delete button then hide and remove it
                    clickOutsideDeleteButton(); 
                }
            });
        }        
    }

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
                            item.parentElement.getElementsByTagName("p")[1].style.cssText = "margin-right: 0;";
                            setTimeout(() => {
                                item.remove();
                            }, 500);
                        })
                    }
                }
            } else { click = 0 }
        });
    } 

    //remove delete buttons on each list item
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

    //show clock edit button
    function showEdit() {
        (clockList.childElementCount == 0) ? clockEditEnable = false : clockEditEnable = true;
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
            timeZoneItem[i].addEventListener("click", function () {
                formatClockLabel();
                let item = clockList.appendChild(document.createElement("li"));
                item.className = "clock-item item";
                item.innerHTML = 
                    `<div class="clock-box">
                        <span class="clock-label" title="UTC: ${clockLabelOffset}">${clockLabelDay}, ${checkTime(clockLabelOffset)}</span>
                        <p class="clock-city">${unSortedCities[i]}</p>
                    </div>
                    <p class="clock-time">${res}</p>`;
                formatedGMTArray.push(clockLabelOffset);
                unformatedGMTArray.push(GMToffsetArray[i]);
                clockItemsArray.push(item);
                // add item to an array and clockstorage
                clockStorage.push(item.outerHTML);
                localStorage.setItem("clockStorage", clockStorage.toString());
                storageOffset.push(GMToffsetArray[i]);
                localStorage.setItem("clockOffset", storageOffset.toString());
                document.querySelector(".timezone.fade-up").classList.remove("opened");
                document.querySelector(".block-top").style.visibility = "visible";
                searchInput.value = null;
                showEdit();
            });
            //format clockitem time, clockLabelDay, and time difference
            function formatClockLabel () {
                const date = new Date();
                let h = date.getUTCHours() + Math.floor(GMToffsetArray[i] / 60);
                let m = (Math.floor(GMToffsetArray[i] % 60) == 0) ? date.getUTCMinutes() : (date.getUTCMinutes() + (Math.floor(GMToffsetArray[i] % 60)));    
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
                return res = `${checkTime(Math.abs(h))}:${checkTime(Math.abs(m))}`;
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

    let alphabet = [...Array(26).keys()].map(i => String.fromCharCode(i + 65)); // create array of letters
    function alphabetFilter() { // timezone list navigation by alphabet letter
        if (document.querySelectorAll(".timezone-navigation-list").length === 1) // stop executing if list was already created
        { return appendLetters() } 
        else
        {  
            timeZoneNav.appendChild(document.createElement("ul")).classList.add("timezone-navigation-list");
            let list = document.querySelector(".timezone-navigation-list");
            let i = 0; // append list of letters to popup
            do {
                let li = list.appendChild(document.createElement("li"));
                let a = li.appendChild(document.createElement("a"));
                a.setAttribute("href", `#${alphabet[i]}`);
                a.innerText = alphabet[i];
                i++;
            } while (i < alphabet.length);
            appendLetters();
        }
    }

    function appendLetters() {
        let citiesSorted = []; // sort cities alphabetically
        document.querySelectorAll(".timezone-list li").forEach(item => { 
            citiesSorted.push(item.innerText.split(",")[0].split(" ")[0].split("-")[0]); // add to array only the 1st word of the city's name
        });
        function find(...letters){ // find matches between each city name and each letter in alphabet
            return citiesSorted.filter(w => letters.every(l => w.includes(l))); // e.g. find("K") returns list of cities names starting with K
        }
        let indexArray = []
        for (let i = 0; i < alphabet.length; i++) { 
            let el = find(alphabet[i])[0]; // get first city that matches letter search (e.g. find("K")[0] returns "Kabul")
            indexArray.push(citiesSorted.indexOf(el)); // array of indexes of first letter occurance in cities names (e.g. "Baghdad" -> 30)   
        }
        for (let i = 0; i < indexArray.length; i++) { // append anchors to timezone-list
            if (find(alphabet[i])[0] === undefined) 
                { continue } // pass iteration if there's no city name match by letter (e.g. no city with starting letter "X")
            let node = document.createElement("div");
            timeZoneList.insertBefore(node, timeZoneList.getElementsByTagName("li")[indexArray[i]]);
            node.textContent = alphabet[i];
            node.className = "timezone-anchor";
            node.setAttribute("id", `${alphabet[i]}`);
        }
        document.querySelectorAll(".timezone-navigation a").forEach(anchor => {
            anchor.addEventListener("click", (e) => {
                e.preventDefault();
                if (document.querySelector(`#${anchor.textContent}`) === null) 
                    { return }
                document.querySelector(".timezone-list").scrollTop = document.querySelector(`#${anchor.textContent}`).offsetTop - 100;
            });
        })
    }

    searchInput.addEventListener("keyup", function () { // searchbar, function triggers when user starts typing
        let hasAnyMatch = false;
        for (let i = 0; i < timeZoneItem.length; i++) { // case insensitive search
            if (!timeZoneItem[i].innerHTML.toLowerCase().match(new RegExp(searchInput.value, "i"))) { // no match
                timeZoneItem[i].style.display = "none";
            } else { // match
                hasAnyMatch = true;
                timeZoneItem[i].style.display = "list-item";
                timeZoneList.classList.remove("no-match");
                hideAnchorNav();
            }
        }
        if (searchInput.value == null || searchInput.value == "") { // show/hide clear search button
            clearSearch.style.visibility = "hidden";
            showAnchorNav();
        } else {
            clearSearch.style.visibility = "visible";
            clearSearch.onclick = () => {
                searchInput.value = null;
                clearSearch.style.visibility = "hidden";
                timeZoneList.classList.remove("no-match");
                Array.from(timeZoneList.getElementsByTagName("li")).
                    forEach((element) => {element.style.display = "list-item";
                }); // show list items after click on button to clear search value
                showAnchorNav();
            }
        }
        //if searching result has no matches show user that nothing is found
        if (!hasAnyMatch) {
            timeZoneList.classList.add("no-match");
            hideAnchorNav();
        }
        function showAnchorNav() {
            document.querySelectorAll(".timezone-navigation a").forEach(a => a.style.display = "initial"); // show nav
            document.querySelectorAll(".timezone-anchor").forEach(anchor => anchor.style.display = "flex"); // show nav anchors
        }
        function hideAnchorNav() {
            document.querySelectorAll(".timezone-navigation a").forEach(a => a.style.display = "none"); // hide nav
            document.querySelectorAll(".timezone-anchor").forEach(anchor => anchor.style.display = "none"); // hide nav anchors
        }
    });
}