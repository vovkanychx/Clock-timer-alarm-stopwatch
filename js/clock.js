import { checkTime, isScrollable, menu as menu } from "../js/script.js"

export function clock() {
    const sectionClock        = document.querySelector(".clock");
    const clockAddButton      = document.getElementById("clock-add")
    const clockEditButton     = document.getElementById("clock-edit")
    const clockPopUp          = document.querySelector(".timezone")
    const clockCancelButton   = document.getElementById("search-cancel")
    const timezoneList        = document.querySelector(".timezone-list")
    const timezoneSearch      = document.getElementById("search")
    const clearSearch         = document.getElementById("clear-search-input")
    const clockList           = document.querySelector(".clock-list")
    const timezoneFixedHeader = document.querySelector(".timezone-fixed-header")

    const lettersArray = [...Array(26).keys()].map(i => String.fromCharCode(i + 65))
    var jsonData
    let isNavigation = false
    let clockStorage = localStorage.getItem("clockStorage")
    clockStorage = clockStorage ? JSON.parse(clockStorage.split(',')) : []

    function hideButton(button) {
        button.style.visibility = "hidden"
    }

    function showButton(button) {
        button.style.visibility = "visible"
    }

    async function loadJSONdata() {
        // fetching the data
        let response = await fetch("https://vovkanychx.github.io/Clock-timer-alarm-stopwatch/js/data.json") //github page
        jsonData = await response.json()
    }

    function showJSONdata() {
        createTimezoneListItems(timezoneList);
        createTimezoneNavigation()
    }

    function removeTimezoneListChildren(list) {
        // remove all list items before appending new ones
        setTimeout(() => {
            list.replaceChildren()
        }, 250);
    }

    function createTimezoneListItems(list) {
        for (let index = 0; index < jsonData.length; index++) {
            let item = document.createElement("button")
            list.appendChild(item)
            item.setAttribute("class", "timezone-item")
            item.innerText = `${jsonData[index]?.city}, ${jsonData[index]?.country}`
            item.setAttribute("data-offset", `${jsonData[index]?.offset}`)
        }
        sortItemsAlphabetically(list)
        appendWrappersToList(list)
        wrapElements()
    }

    function sortItemsAlphabetically(list) {
        Array.from(list.children)
            .sort((a, b) => a.textContent.localeCompare(b.textContent))
            .forEach(li => {
                li.setAttribute("data-group", `${li.textContent.charAt(0).toUpperCase()}`)
                list.appendChild(li)
            })
    }

    function appendWrappersToList(list) {
        for (let i = 0; i < lettersArray.length; i++) {
            let container = document.createElement("li")
            container.setAttribute("id", lettersArray[i].toUpperCase())
            container.setAttribute("class", "timezone-wrapper")
            list.appendChild(container)
            let anchor = document.createElement("div")
            anchor.setAttribute("class", "timezone-anchor")
            anchor.innerText = container.getAttribute("id")
            container.appendChild(anchor)
        }
    }

    function wrapElements() {
        const timezoneItems = document.querySelectorAll("[data-group]")
        const timezoneWrappers = document.querySelectorAll(".timezone-wrapper")
        timezoneWrappers.forEach(wrapper => {
            timezoneItems.forEach(item => {
                if (item.getAttribute("data-group") === wrapper.getAttribute("id")) {
                    wrapper.appendChild(item)
                } else {
                    return false
                }
            })
            // if data.json has no city starting as some alphabet letter do not display wrapper
            if (wrapper.contains(wrapper.firstChild) && wrapper.childElementCount === 1) {
                wrapper.style.cssText = "visibility: hidden; max-height: 0; padding: 0; margin: 0"
            }
        })
    }

    function createTimezoneNavigation() {
        if (!isNavigation) {
            const timezoneNav = document.querySelector(".timezone-navigation")
            let navList = document.createElement("ul")
            navList.setAttribute("class", "timezone-navigation-list")
            timezoneNav.appendChild(navList)
            lettersArray.forEach(letter => {
                let li = document.createElement("li")
                navList.appendChild(li)
                let anchor = document.createElement("a")
                anchor.setAttribute("href", `#${letter}`)
                anchor.textContent = `${letter}`
                li.appendChild(anchor)
                anchor.addEventListener("click", e => {
                    e.preventDefault()
                    timezoneList.scrollTop = timezoneList.querySelector(`#${letter.toUpperCase()}`).offsetTop - document.querySelector(".timezone-wrap").offsetHeight
                })
            })
            isNavigation = true
        } else {
            return
        }
    }
    
    function showAnchorNav() {
        timezoneFixedHeader.style.visibility = "visible"
        document.querySelectorAll(".timezone-navigation a").forEach(a => a.style.display = "initial") // show nav
        document.querySelectorAll(".timezone-anchor").forEach(anchor => anchor.style.display = "flex") // show nav anchors
        document.querySelectorAll(".timezone-wrapper").forEach(wrapper => wrapper.style.marginBottom = "15px")
    }

    function hideAnchorNav() {
        timezoneFixedHeader.style.visibility = "hidden"
        document.querySelectorAll(".timezone-navigation a").forEach(a => a.style.display = "none") // hide nav
        document.querySelectorAll(".timezone-anchor").forEach(anchor => anchor.style.display = "none") // hide nav anchors
        document.querySelectorAll(".timezone-wrapper").forEach(wrapper => wrapper.style.marginBottom = "0")
    }

    function addOrCancelSameActions() {
        clockPopUp.classList.remove("opened")
        showButton(clockAddButton)
        removeTimezoneListChildren(timezoneList)
        timezoneSearch.value = null
        clearSearch.style.display = "none"
        timezoneFixedHeader.style.cssText = "display: none; visibility: hidden"
    }

    function createClockItem(list, item, city, date, offset) {
        // new item
        let clockItem = document.createElement("li")
        clockItem.setAttribute("class", "clock-item item")
        clockItem.setAttribute("data-offset", `${offset}`)
        // new item delete button
        let clockDeleteButton = document.createElement("button")
        clockDeleteButton.setAttribute("class", "remove-button")
        // new item wrapper for offset and city
        let clockItemWrap = document.createElement("div")
        clockItemWrap.setAttribute("class", "clock-box")
        // new item offset
        let clockItemOffset = document.createElement("span")
        clockItemOffset.setAttribute("class", "clock-offset")
        clockItemOffset.innerText = `${formatClockItemDay(item, date, offset)}, ${formatClockItemOffset(item, date, offset)}`
        // new item city
        let clockItemCity = document.createElement("p")
        clockItemCity.setAttribute("class", "clock-city")
        clockItemCity.innerText = `${city}`
        // new item time
        let clockItemTime = document.createElement("p")
        clockItemTime.setAttribute("class", "clock-time")
        clockItemTime.innerText = formatClockItemTime(item, date, offset)
        // new item move button
        let clockItemMove = document.createElement("div")
        clockItemMove.setAttribute("class", "clock-move")
        // new item remove confirm button
        let clockItemConfirm = document.createElement("button")
        clockItemConfirm.classList.add("remove-confirm")
        clockItemConfirm.innerText = "Delete"           
        // appending
        clockItemWrap.appendChild(clockItemOffset)
        clockItemWrap.appendChild(clockItemCity)
        clockItem.appendChild(clockDeleteButton)
        clockItem.appendChild(clockItemWrap)
        clockItem.appendChild(clockItemTime)
        clockItem.appendChild(clockItemMove)
        clockItem.appendChild(clockItemConfirm)
        list.appendChild(clockItem)
        clockItem.style.transition = "top none, transform 200ms ease-in-out"
        clockItem.style.top = (document.querySelectorAll(".clock-item").length - 1) * clockItem.offsetHeight + list.querySelector("h1").offsetHeight + "px"
    }

    function addNewClock() {
        const date = new Date()
        const timezoneItems = document.querySelectorAll(".timezone-item")
        for (let i = 0; i < timezoneItems.length; i++) {
            const item = timezoneItems[i];
            item.addEventListener("click", function () {
                let city = item.textContent.split(",")[0]
                let offset = item.getAttribute("data-offset")
                createClockItem(clockList, item, city, date, offset)
                // adding data to localstorage
                let object = {
                    offset: Number(item.getAttribute("data-offset")),
                    city: item.textContent.split(",")[0]
                }
                clockStorage.push(object)
                localStorage.setItem("clockStorage", JSON.stringify(clockStorage))
                // actions after added new item
                addOrCancelSameActions()
                showButton(clockEditButton)
            })
        }
    }
    
    function formatClockItemDay(item, date, offset) {
        let calculated = parseInt(offset) + (date.getHours() * 60)
        if (calculated >= 0 && calculated < 24 * 60) {
            return "Today"
        } else if (calculated < 0) {
            return "Yesterday"
        } else if (calculated >= 24 * 60) {
            return "Tomorrow"
        } else {
            return "No data"
        }
    }
    
    function formatClockItemOffset(item, date, offset) {
        // let itemOffset = (date.getHours() - date.getUTCHours()) * 60 - item.getAttribute("data-offset")
        let hour = Math.floor(offset / 60)
        let minute = Math.floor(offset % 60) === 0 ? '' : checkTime(Math.floor(offset % 60))
        let singularOrPlural 
        hour == 1 || hour == -1 || hour == 0 ? singularOrPlural = "HR" : singularOrPlural = "HRS"
        hour >= 0 ? hour = `+${hour}` : hour = `${hour}`
        if (Math.floor(offset % 60) === 0) {
            return `${hour}${singularOrPlural}`
        } else {
            return `${hour}:${minute}${singularOrPlural}`
        }
    }

    function formatClockItemTime(item, date, offset) {
        let hour = date.getUTCHours() + Math.floor(offset / 60)
        let minute = date.getUTCMinutes() + Math.floor(offset % 60)
        hour >= 23 ? hour = Math.abs(24 - hour) : hour = Math.abs(hour)
        minute >= 60 ? minute = Math.abs(60 - minute) : minute = Math.abs(minute)
        let time = `${checkTime(hour)}:${checkTime(minute)}`
        return time
    }

    function updateTime() {
        const date = new Date()
        const items = document.querySelectorAll(".clock-item")
        if (items.length <= 0) { return }
        items.forEach(item => {
            const offset = parseInt(item.getAttribute("data-offset"))
            item.querySelector(".clock-offset").innerText = `${formatClockItemDay(item, date, offset)}, ${formatClockItemOffset(item, date, offset)}`
            item.querySelector(".clock-time").innerText = formatClockItemTime(item, date, offset)
        })
    }

    setInterval(() => {
        updateTime()
    }, 1000);
    
    // store clock items in localstorage
    function appendSavedClocks() {
        if ((clockStorage != null || undefined) || clockStorage.length > 0) {
            let storage = JSON.parse(localStorage.getItem("clockStorage"))
            if (storage == null) return
            const date = new Date()
            storage.forEach(item => {
                createClockItem(clockList, item, item.city, date, item.offset)
            })
            clockList.childElementCount > 1 ? showButton(clockEditButton) : hideButton(clockEditButton)
            clockList.querySelectorAll("li").forEach(li => li.style.transition = "top 0s, transform 200ms ease-in-out")
        }
    }
    appendSavedClocks()

    function addMenuClass() {
        let isContentVisible = localStorage.getItem("show-content") == "clock";
        if (clockList.scrollHeight < (clockList.clientHeight - menu.offsetHeight) && isContentVisible) {
            menu.classList.remove("scrolling")
        } else {      
            menu.classList.add("scrolling")
        }
    }

    setTimeout(() => {
        addMenuClass()
    }, 0)

    function observeChanges() {
        // code here used from MDN Web Docs https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
        const targetNode = clockList
        // Options for the observer (which mutations to observe)
        const config = { attributes: false, childList: true, subtree: false }
        // Callback function to execute when mutations are observed
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === "childList" && isScrollable(targetNode, menu)) {
                    menu.classList.add("scrolling")
                } else {
                    menu.classList.remove("scrolling")
                }
            }
        };
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback)
        // Start observing the target node for configured mutations
        observer.observe(targetNode, config)
    }
    observeChanges()

    function dragAndDrop() {
        let posY = null //Mouse coordinates
        let diffY = null //So that mouse can drag item on the correct spot

        let mouseDown = false
        let selectedItem = null
        let resetTransition = false //Cooldown to prevent position errors
        let transitionTime = 250 //In milliseconds

        const myList = document.querySelector(".clock-list")
        const myListItems = document.querySelectorAll(".clock-item")
        const myListHeading = document.querySelector(".clock-list h1")
        const myListDraggables = document.querySelectorAll(".clock-move ")

        //Set fixed height of items container
        setTimeout(() => {
            if (clockStorage.length > 0) {
                myList.style.height = (myListItems.length * myListItems[0].offsetHeight) + myListHeading.offsetHeight + "px"
            }
        }, 0)

        function positionItems(insertIndex = null) {
            let itemsList = document.querySelectorAll(".clock-item")
            itemsList = Array.prototype.slice.call(itemsList)
            itemsList = itemsList.filter(item => item.getAttribute("selected") !== "yes")
            let indexCounter = 0
            itemsList.forEach(item => {
                if (insertIndex === indexCounter + 1) {
                    indexCounter++
                }
                item.style.top = (item.offsetHeight * indexCounter) + myListHeading.offsetHeight + "px"
                item.setAttribute("order", indexCounter + 1)
                indexCounter++
            })
        }
        setTimeout(() => {
            positionItems() 
        }, 0)

        function positionItemsInOrder() {
            let itemsList = document.querySelectorAll(".clock-item")
            itemsList = Array.from(itemsList).sort((a, b) => {
                return Number(a.getAttribute("order")) > Number(b.getAttribute("order")) ? 1 : -1
            })
            itemsList.forEach((item, index) => {
                if (item.getAttribute("selected") === "yes") {
                    item.removeAttribute("selected")
                    setTimeout(() => {
                        item.style.zIndex = "0"
                    }, transitionTime)
                }
                item.style.top = (item.offsetHeight * index) + myListHeading.offsetHeight + "px"
                item.setAttribute("order", index + 1)
            });
            resetTransition = true
            //When transition is over
            setTimeout(() => {
                while (myList.querySelector("li")) {
                    myList.removeChild(myList.lastChild)
                }
                itemsList.forEach((item) => {
                    myList.append(item)
                })
                resetTransition = false
            }, transitionTime)
        }

        myListDraggables.forEach(draggable => {
            draggable.addEventListener("mousedown", e => {
                if(!posY || resetTransition) return
                mouseDown = true
                selectedItem = e.target.parentElement
                diffY = posY - selectedItem.offsetTop
                let offsetY = posY - diffY
                selectedItem.style.top = offsetY + "px"
                selectedItem.style.zIndex = "1000"
                selectedItem.setAttribute("selected", "yes")
            })
            draggable.parentElement.addEventListener("mouseup", e => {
                mouseDown = false
                e.target.parentElement.style.removeProperty("z-index")
                positionItemsInOrder()
                setTimeout(() => {
                    clockStorage = []
                    document.querySelectorAll(".clock-item").forEach(item => {
                        let data = {
                            offset: Number(item.getAttribute("data-offet")), 
                            city: item.querySelector(".clock-city").innerText
                        }
                        clockStorage.push(data)
                    })
                    localStorage.setItem("clockStorage", JSON.stringify(clockStorage))
                }, transitionTime)
            })
        })

        sectionClock.addEventListener("mousemove", e => {
            posY = e.clientY - ((myList.offsetTop - myList.scrollTop) - window.scrollY) //ScrollY, so that a vertical scroll bar does not mess everything up
            if (!mouseDown) return
            let offsetY = posY - diffY
            selectedItem.style.top = offsetY + "px"
            let orderOfSelectedItem = Number(selectedItem.getAttribute("order"))
            //Test for new position
            if (orderOfSelectedItem !== 1) {
                let beforeItem = document.querySelector(`.clock-item[order*="${orderOfSelectedItem - 1}"]`)
                let beforeMiddle = posY < beforeItem.offsetTop + beforeItem.offsetHeight
                if (beforeMiddle) {
                    positionItems(orderOfSelectedItem - 1)
                    selectedItem.setAttribute("order", orderOfSelectedItem - 1)
                    return
                }
            }
            if (orderOfSelectedItem !== document.querySelectorAll(".clock-item").length) {
                let afterItem = document.querySelector(`.clock-item[order*="${orderOfSelectedItem + 1}"]`)
                let afterMiddle = posY >= afterItem.offsetTop + (afterItem.offsetHeight / 2) - (afterItem.offsetHeight / 2) 
                if (afterMiddle) {
                    positionItems(orderOfSelectedItem + 1)
                    selectedItem.setAttribute("order", orderOfSelectedItem + 1)
                    return
                }
            }
        })
    }
    dragAndDrop()
    
    clockAddButton.addEventListener("click", function (e) {
        clockPopUp.classList.add("opened")
        hideButton(e.target)
        hideButton(clockEditButton)
        loadJSONdata().then(showJSONdata).then(addNewClock)
        showAnchorNav()
        timezoneList.classList.remove("no-match")
        timezoneFixedHeader.style.visibility = "visible"
        timezoneList.scrollTop = 0
    })
    
    clockCancelButton.addEventListener("click", function (e) {
        clockList.childElementCount > 1 ? showButton(clockEditButton) : hideButton(clockEditButton)
        addOrCancelSameActions()
    })

    clockEditButton.addEventListener("click", function (e) {
        e.target.classList.toggle("edit-toggle")
        e.target.classList.contains("edit-toggle") ? e.target.innerText = "Done" : e.target.innerText = "Edit"
        const clockItems = document.querySelectorAll(".clock-item")
        clockItems.forEach((item, index) => {
            if (e.target.classList.contains("edit-toggle")) item.classList.remove("removing", "remove-confirm")
            item.classList.toggle("remove-item")
            item.querySelector(".remove-button").addEventListener("click", function (e) {
                if (clockList.contains(document.querySelector(".clock-item.remove-confirm.removing"))) {
                    return
                } else {
                    const removeConfirmBtn = e.target.parentElement.querySelector(".remove-confirm")
                    e.target.parentElement.classList.add("removing")
                    removeConfirmBtn.addEventListener("click", function (e) {
                        let transitionDuration = parseInt(window.getComputedStyle(document.querySelector(".clock")).getPropertyValue("--delete-transition"))
                        e.target.classList.add("removing")
                        e.target.parentElement.classList.add("removed")
                        setTimeout(() => {
                            e.target.parentElement.remove()
                            clockStorage.splice(index, 1)
                            localStorage.setItem("clockStorage", JSON.stringify(clockStorage))
                            clockList.querySelectorAll("li").forEach((li, index) => {
                                li.style.top = (li.offsetHeight * index) + clockList.querySelector("h1").offsetHeight + 'px'
                            })
                            clockList.childElementCount > 1 ? showButton(clockEditButton) : hideButton(clockEditButton)
                        }, transitionDuration + 50)
                    })
                }
            })
        })
        // disable editing of clockList when clicked on clockAddButton or any menu button except #clock menu button
        if (clockList.contains(document.querySelector(".remove-item"))) {
            window.addEventListener("click", e => {
                let menuItem = e.target.closest(".menu-item")
                if (e.target === clockAddButton || menuItem && menuItem !== document.querySelector("#clock.menu-item")) {
                    clockItems.forEach(item => {
                        item.classList.remove("remove-item", "removing")
                        clockEditButton.classList.remove("edit-toggle")
                        clockEditButton.innerText = "Edit"
                    })
                }
            })
        }
    })

    timezoneList.addEventListener("scroll", function (e) {
        const anchors = document.querySelectorAll(".timezone-anchor")
        const listTop = document.querySelector(".timezone-wrap")
        anchors.forEach(anchor => {
            if (e.target.scrollTop >= (anchor.offsetTop - listTop.offsetHeight)) {
                timezoneFixedHeader.style.display = "block"
                timezoneFixedHeader.textContent = anchor.textContent
            } else {
                anchor.classList.remove("scrolling")
            }
        })
        // add/remove styling to search box in timezone list when scrolling
        if (e.target.scrollTop > 0) {
            listTop.classList.add("scrolling")
        } else if (e.target.scrollTop === 0 || e.target.scrollTop < 0) {
            listTop.classList.remove("scrolling")
            timezoneFixedHeader.style.display = "none"
        }
    }, false)

    timezoneSearch.addEventListener("keyup", function (e) {
        const timezoneItems = document.querySelectorAll(".timezone-item")
        let hasAnyMatch = false
        // case insensitive search
        for (let i = 0; i < timezoneItems.length; i++) { 
            if (!timezoneItems[i].innerHTML.toLowerCase().match(new RegExp(e.target.value, "i"))) { 
                // if no match
                timezoneItems[i].style.display = "none"
            } else { 
                // if any match
                hasAnyMatch = true
                timezoneItems[i].style.display = "block"
                timezoneList.classList.remove("no-match")
                clearSearch.style.display = "inline-block"
                hideAnchorNav()
            }
        }
        if (e.target.value == null || e.target.value == "" || e.target.value.length == 0) { 
            // show/hide clear search button
            clearSearch.style.visibility = "hidden"
            timezoneList.scrollTop = 0
            showAnchorNav()
        } else if (e.target.value === " ") {
            hasAnyMatch = false
            timezoneList.classList.add("no-match")
            timezoneItems.forEach(item => item.style.display = "none")
            hideAnchorNav()
        } else {
            clearSearch.style.visibility = "visible"
            clearSearch.addEventListener("click",  function () {
                e.target.value = null
                clearSearch.style.visibility = "hidden"
                timezoneList.classList.remove("no-match")
                timezoneItems.forEach(item => item.style.display = "block")
                timezoneList.scrollTop = 0
                // show list items after click on button to clear search value
                showAnchorNav()
            })
        }
        //if searching result has no matches show user that nothing is found
        if (!hasAnyMatch) {
            timezoneList.classList.add("no-match")
            hideAnchorNav()
        }
    })

    clockList.addEventListener("scroll", function () {
        const clockHeader =  document.querySelector(".clock .block-top")
        const clockHeaderTitle = document.querySelector(".clock .block-top-title")
        clockHeader.classList.add("scrolling")
        clockHeaderTitle.classList.add("scrolling")
        if (this.scrollTop <= 0) {
            clockHeader.classList.remove("scrolling")
            clockHeaderTitle.classList.remove("scrolling")
        }
        if (this.scrollTop >= (this.scrollHeight - this.offsetHeight)) {
            menu.classList.remove("scrolling")
        } else {
            menu.classList.add("scrolling")
        }
    })

    // hide confirm-delete button if not clicked on this button
    window.addEventListener("click", function (e) {
        this.document.querySelectorAll(".clock-item").forEach(item => {
            if (item.classList.contains("removing")) {
                if (e.target !== item.querySelector(".remove-button")) {
                    item.classList.remove("removing")
                }
            }
        })
    })
}