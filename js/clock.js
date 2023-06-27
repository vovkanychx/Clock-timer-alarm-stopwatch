import { checkTime } from "../js/script.js"

export function clock() {
    const clockAddButton = document.getElementById("clock-add")
    const clockEditButton = document.getElementById("clock-edit")
    const clockPopUp = document.querySelector(".timezone")
    const clockCancelButton = document.getElementById("search-cancel")
    const timezoneList = document.querySelector(".timezone-list")
    const timezoneSearch = document.getElementById("search")
    const clearSearch = document.getElementById("clear-search-input")
    const clockList = document.querySelector(".clock-list")
    const timezoneFixedHeader = document.querySelector(".timezone-fixed-header")
    var jsonData
    const lettersArray = [...Array(26).keys()].map(i => String.fromCharCode(i + 65))
    let isNavigation = false

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

    function addNewClock() {
        const date = new Date()
        const timezoneItems = document.querySelectorAll(".timezone-item")
        for (let i = 0; i < timezoneItems.length; i++) {
            const item = timezoneItems[i];
            item.addEventListener("click", function () {
                // new item
                let clockItem = document.createElement("li")
                clockItem.setAttribute("class", "clock-item item")
                // new item wrapper for offset and city
                let clockItemWrap = document.createElement("div")
                clockItemWrap.setAttribute("class", "clock-box")
                // new item offset
                let clockItemOffset = document.createElement("span")
                clockItemOffset.setAttribute("class", "clock-offset")
                clockItemOffset.innerText = `${formatClockItemDay(item, date)}, ${formatClockItemOffset(item, date)}`
                // new item city
                let clockItemCity = document.createElement("p")
                clockItemCity.setAttribute("class", "clock-city")
                clockItemCity.innerText = `${item.textContent.split(",")[0]}`
                // new item time
                let clockItemTime = document.createElement("p")
                clockItemTime.setAttribute("class", "clock-time")
                clockItemTime.innerText = formatClockItemTime(item, date)
                // appending
                clockItemWrap.appendChild(clockItemOffset)
                clockItemWrap.appendChild(clockItemCity)
                clockItem.appendChild(clockItemWrap)
                clockItem.appendChild(clockItemTime)
                clockList.appendChild(clockItem)

                addOrCancelSameActions()
                showButton(clockEditButton)
            })
        }
    }
    
    function formatClockItemDay(item, date) {
        let itemOffset =  item.getAttribute("data-offset")
        let calculated = parseInt(itemOffset) + (date.getUTCHours() * 60)
        if (calculated >= 0 && calculated <= 24 * 60) {
            return "Today"
        } else if (calculated < 0) {
            return "Yesterday"
        } else if (calculated > 24 * 60) {
            return "Tomorrow"
        } else {
            return "No data"
        }
    }

    function formatClockItemOffset(item, date) {
        // let itemOffset = (date.getHours() - date.getUTCHours()) * 60 - item.getAttribute("data-offset")
        let itemOffset = parseInt(item.getAttribute("data-offset"))
        let hour = Math.floor(itemOffset / 60)
        let minute = Math.floor(itemOffset % 60) === 0 ? '' : checkTime(Math.floor(itemOffset % 60))
        let singularOrPlural 
        hour == 1 || hour == -1 || hour == 0 ? singularOrPlural = "HR" : singularOrPlural = "HRS"
        hour >= 0 ? hour = `+${hour}` : hour = `${hour}`
        if (Math.floor(itemOffset % 60) === 0) {
            return `${hour}${singularOrPlural}`
        } else {
            return `${hour}:${minute}${singularOrPlural}`
        }
    }

    function formatClockItemTime(item, date) {
        let itemOffset = parseInt(item.getAttribute("data-offset"))
        let hour = date.getUTCHours() + Math.floor(itemOffset / 60)
        let minute = date.getUTCMinutes() + Math.floor(itemOffset % 60)
        hour >= 23 ? hour = Math.abs(24 - hour) : hour = Math.abs(hour)
        minute >= 60 ? minute = Math.abs(60 - minute) : minute = Math.abs(minute)
        let time = `${checkTime(hour)}:${checkTime(minute)}`
        return time
    }

    clockAddButton.addEventListener("click", function (e) {
        clockPopUp.classList.add("opened")
        hideButton(e.target)
        hideButton(clockEditButton)
        loadJSONdata().then(showJSONdata).then(addNewClock)
        timezoneList.classList.remove("no-match")
        timezoneFixedHeader.style.visibility = "visible"
        timezoneList.scrollTop = 0
    })
    
    clockCancelButton.addEventListener("click", function (e) {
        clockList.childElementCount > 1 ? showButton(clockEditButton) : hideButton(clockEditButton)
        addOrCancelSameActions()
    })

    timezoneList.addEventListener("scroll", function (e) {
        const anchors = document.querySelectorAll(".timezone-anchor")
        const listTop = document.querySelector(".timezone-wrap")
        anchors.forEach(anchor => {
            if (e.target.scrollTop >= anchor.offsetTop) {
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
}