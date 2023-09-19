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
    let clickCount = 0
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
        let response = await fetch("../js/data.json")
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
        // appending
        clockItemWrap.appendChild(clockItemOffset)
        clockItemWrap.appendChild(clockItemCity)
        clockItem.appendChild(clockDeleteButton)
        clockItem.appendChild(clockItemWrap)
        clockItem.appendChild(clockItemTime)
        clockItem.appendChild(clockItemMove)
        list.appendChild(clockItem)
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
                    offset: item.getAttribute("data-offset"),
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
        }
    }
    appendSavedClocks()

    function dragAndDrop() {
        let down = false
        let moveBtnIndex = 0
        const moveButtons = document.querySelectorAll(".clock-move")
        moveButtons.forEach((button, index) => {
            moveButtons[index].addEventListener("mousedown", e => {
                down = true
                moveBtnIndex = index
            })
        })

        sectionClock.addEventListener("mousemove", e => {
            e.preventDefault()
            if (down) {
                let button = moveButtons[moveBtnIndex]
                let parent = button.parentElement
                let box = parent.getBoundingClientRect().top
                parent.style.top = `${e.clientY - e.pageY}px`
            }
        })

        window.addEventListener("mouseup", e => {
            down = false
        })
    }
    dragAndDrop()
    
    // add scrolling class to menu if clocklist is scrollable
    setTimeout(() => {
        if (clockList.scrollHeight > clockList.clientHeight) {
            menu.classList.add("scrolling")
        }
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

    document.addEventListener("keypress", (e) => {
        if (e.code == "KeyR") {
            localStorage.removeItem("clockStorage")
        } else { return false }
    })
    
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
            item.classList.toggle("remove-item")
            item.querySelector(".remove-button").addEventListener("click", function (e) {
                if (clockList.contains(document.querySelector(".remove-confirm"))) {
                    return
                } else {
                    const removeConfirmBtn = document.createElement("button")
                    removeConfirmBtn.setAttribute("class", "remove-confirm")
                    removeConfirmBtn.innerText = "Delete"
                    item.appendChild(removeConfirmBtn)
                    this.parentElement.classList.add("removing")
                    removeConfirmBtn.addEventListener("click", function (e) {
                        this.classList.add("removing")
                        this.parentElement.classList.add("removed")
                        console.log(clockStorage)
                        setTimeout(() => {
                            this.parentElement.remove()
                            clockStorage.splice(index, 1)
                            localStorage.setItem("clockStorage", JSON.stringify(clockStorage))
                            console.log(clockStorage)
                            clockList.childElementCount > 1 ? showButton(clockEditButton) : hideButton(clockEditButton)
                            clickCount = 0
                            // reset clickCount to instantly acces new confirmDelete button
                        }, 500);
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
        const removeConfirm = document.querySelector(".remove-confirm")
        let isShown = sectionClock.contains(removeConfirm)
        // if deleteConfirm is shown on page
        if (isShown && e.target !== removeConfirm) {
            clickCount++
            // add 1 to clickCount
            if (clickCount > 1) {
                // if clickCount > 1 and not clicked on deleteConfirm then remove it
                removeConfirm.parentElement.classList.remove("removing")
                removeConfirm.classList.add("hide-remove-confirm")
                setTimeout(() => {
                    removeConfirm.remove()
                }, 500);
                // reset clickCount to be able instantly call removeConfirm button
                return clickCount = 0
            }
        }
    })
}