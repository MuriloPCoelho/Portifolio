const searchBar = document.querySelector("#searchBar")
const headerAddTaskButton = document.querySelector("#headerAddTask")
const modal = document.querySelector(".modal")
const modalContent = document.querySelector(".modalContent")
const modalTaskTitle = document.querySelector("#modalTaskTitle")
const modalTaskDescription = document.querySelector("#modalTaskDescription")
const modalCancelButton = document.querySelector(".modalCancelButton")
const modalAddTaskButton = document.querySelector(".modalAddButton")
modalAddTaskButton.onclick = modalAddTask()
const themeButton = document.querySelector("#changeTheme")
const list = document.querySelector("#taskList")
let currentTheme = "light"

setLastTheme()
getSavedTasks()

function idGenerator() {
    let counter = localStorage.getItem("Current id") === null ? 0 : localStorage.getItem("Current id")
    localStorage.setItem("Current id", Number(counter)+1)

    return counter
}

//clean search bar
searchBar.addEventListener("blur", (e) => {
    searchBar.value = ""
    searchBar.placeholder = ""
})
//open search bar
searchBar.addEventListener("click", (e) => {
    searchBar.placeholder = "Search"
})

//open modal
headerAddTaskButton.addEventListener("click", (e) => {
    modal.classList.add("openModal")
    modalContent.classList.remove("closeModalContent")
    modalContent.classList.add("openModalContent")
})

//verify if task title is empty
modalTaskTitle.addEventListener("keyup", (e) =>{
    if (modalTaskTitle.value !== "") {
        modalAddTaskButton.classList.remove("buttonDisabled")
    }
})

//close modal
modalCancelButton.addEventListener("click", (e) => {
    closeModal()
})

//enable to press enter on modal title to ad a task
modalTaskTitle.addEventListener("keypress", (keyPressed) => {
    if (keyPressed.key === "Enter") {
        modalAddTask()
    }
})

//enable to press enter on modal description to ad a task
modalTaskDescription.addEventListener("keypress", (keyPressed) => {
    if (keyPressed.key === "Enter") {
        modalAddTask()
    }
})

//add a task
function modalAddTask() {
    if (modalTaskTitle.value !== "") {
        addTask(modalTaskTitle.value, modalTaskDescription.value, idGenerator(), currentTheme)
        closeModal()
    }
}

//theme button animation
themeButton.addEventListener("click", (e) => {
    changeTheme()
})

function changeTheme() {
    let changebleTheme = document.querySelectorAll(`.${currentTheme}`)
    changebleTheme.forEach((element) => {
        const light = element.classList.toggle("light")
        const dark = element.classList.toggle("dark")

        if(light) {
            currentTheme = "light"
        } else if (dark) {
            currentTheme = "dark"
        }
    })

    changeIcons(currentTheme)
    saveLastTheme()
}

function changeIcons(theme) {
    const editIcons = document.querySelectorAll(".editIcon")
    const deleteIcons = document.querySelectorAll(".deleteIcon")

    editIcons.forEach((icon) => {
        icon.src = `../img/edit-${theme}.svg`
    })

    deleteIcons.forEach((icon) => {
        icon.src = `../img/delete-${theme}.svg`
    })
    
}

//close modal function
function closeModal() {
    modalTaskTitle.value = "" 
    modalTaskDescription.value = "" 
    modalAddTaskButton.classList.add("buttonDisabled")
    modalContent.classList.remove("openModalContent")
    modalContent.classList.add("closeModalContent")
    setTimeout(() => {
        modal.classList.remove("openModal")
    }, 200)
}

//build the HTML structure
function buildHTML(tag, taskClass, parent) {
    const element = document.createElement(tag)
    element.className = taskClass
    parent.appendChild(element)

    return element
}

//create task function
function addTask(title, description, identifier, theme) {
    const listItem = buildHTML("li", `task ${theme}`, list)
    listItem.id = identifier

    const taskArea = buildHTML("div", "taskArea", listItem)

    const checkBox = buildHTML("div", `checkbox ${theme}`, taskArea)
    checkBox.addEventListener("click", (e) => {
        finishTask(listItem, title, description)
    })

    const checkIcon = buildHTML("img", "checkIcon", checkBox)
    checkIcon.src = "img/check.svg"

    const taskTitle = buildHTML("h3", "taskTitle", taskArea)
    taskTitle.innerHTML = title

    const descriptionArea = buildHTML("div", "descriptionArea", taskArea)

    const taskDescription = buildHTML("span", "taskDescription", descriptionArea)
    taskDescription.innerHTML = description

    const taskDate = buildHTML("span", "taskDate", descriptionArea)
    taskDate.innerHTML = new Date(Date.now()).toLocaleDateString()

    const taskOptions = buildHTML("span", "taskOptions", taskArea)

    const editButton = buildHTML("span", "editButton", taskOptions)
    editButton.addEventListener("click", (e) => {
        editTask(editButton, editArea, editTitle, editDescription)
    })

    const editIcon = buildHTML("img", "editIcon", editButton)
    editIcon.src = `img/edit-${theme}.svg`

    const deleteButton = buildHTML("span", "deleteButton", taskOptions)
    deleteButton.addEventListener("click", (e) => {
        deleteTask(listItem)
    })

    const deleteIcon = buildHTML("img", "deleteIcon", deleteButton)
    deleteIcon.src = `img/delete-${theme}.svg`

    const editArea = buildHTML("div", "editArea hidden", listItem)

    const editTitle = buildHTML("input", `editTitle ${theme}`, editArea)
    editTitle.type = "text"

    const editDescription = buildHTML("textarea", `editDescription ${theme}`, editArea)

    const editButtonsArea = buildHTML("div" ,"editButtonsArea", editArea)

    const editCancelButton = buildHTML("button", `editCancelButton ${theme}`, editButtonsArea)
    editCancelButton.innerHTML = "Cancel"
    editCancelButton.addEventListener("click", (e) => {
        cancelEdit(editArea, taskArea)
    })

    const editSaveButton = buildHTML("button", "editSaveButton", editButtonsArea)
    editSaveButton.innerHTML = "Save"
    editSaveButton.addEventListener("click", (e) => {
        saveEdit(editTitle.value, editDescription.value, taskTitle, taskDescription,  editArea, taskArea, taskDate)
    })

    saveTask(title, description, identifier)
}

function deleteTask(listItem) {
    listItem.parentNode.removeChild(listItem) 
    localStorage.removeItem(listItem.id)   
}

//edit a task
function editTask(child, area, title, description) {
    child.parentNode.parentNode.classList.add("hidden")
    area.classList.remove("hidden")

    title.value = child.parentNode.parentNode.querySelector("h3.taskTitle").innerHTML
    description.value = child.parentNode.parentNode.querySelector("span.taskDescription").innerHTML

}

//cancel task edit
function cancelEdit(editArea, taskArea) {
    editArea.classList.add("hidden")
    taskArea.classList.remove("hidden")
}

//save task edit
function saveEdit(editedTitle, editedDescription, title, description,  editArea, taskArea, taskDate) {
    title.innerHTML = editedTitle
    description.innerHTML = editedDescription
    taskDate.innerHTML = new Date(Date.now()).toLocaleDateString()

    const editedTask = {
        title: editedTitle,
        description: editedDescription,
        identifier: taskArea.parentNode.id
    }

    localStorage.setItem(taskArea.parentNode.id, JSON.stringify(editedTask)) 
    cancelEdit(editArea, taskArea)
}

//
function finishTask(listItem, title, description) {
    console.log(listItem, title, description)
    listItem.classList.add("finished")
    setTimeout(() => {
        deleteTask(listItem)
    }, 250)
}

function saveTask(taskTitle, taskDescription, taskIdentifier) {
    const taskData = {
        title: taskTitle,
        description: taskDescription,
        identifier: taskIdentifier
    }
    localStorage.setItem(taskIdentifier, JSON.stringify(taskData))  
}

function getSavedTasks() {
    Object.keys(localStorage).sort().forEach((savedTask) => {
        if(savedTask !== "Current id" && savedTask !== "theme") {
            const title = JSON.parse(localStorage.getItem(savedTask)).title
            const description = JSON.parse(localStorage.getItem(savedTask)).description
            const identifier = JSON.parse(localStorage.getItem(savedTask)).identifier

            addTask(title, description, identifier, currentTheme)
        }
    })
}

function saveLastTheme() {
    localStorage.setItem("theme", currentTheme)
}

function setLastTheme() {
    if(currentTheme !== localStorage.getItem("theme")) {
        changeTheme()
    }
}