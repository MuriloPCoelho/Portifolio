const addButton = document.querySelectorAll(".addTaskButton")
const columns = document.querySelectorAll(".column")
const buttons = document.querySelectorAll(".addTaskAreaButton")
const closeButtons = document.querySelectorAll(".closeTaskAreaButton")

addButton.forEach(button => {
    button.addEventListener("mouseover", (e) => {
        for(let child of button.children) {
            child.classList.add("active")
        }
    })

    button.addEventListener("mouseout", (e) => {
        for(let child of button.children) {
            child.classList.remove("active")
        }
    })

    button.addEventListener("click", (e) => {
        toggleArea(button.parentNode)
    })
})

document.addEventListener("dragstart", (e) => {
    e.target.classList.add("dragging")
})

document.addEventListener("dragend", (e) => {
    e.target.classList.remove("dragging")
})

columns.forEach((item) => {
    item.addEventListener("dragover", (e) => {
        const dragging = document.querySelector(".dragging")
        const applyAfter = getNewPosition(item, e.clientY)

        if (applyAfter) {
            applyAfter.insertAdjacentElement("afterend", dragging)
        } else {
            item.prepend(dragging)
        }
    })
})

function getNewPosition(column, posY) {
    const tasks = column.querySelectorAll(".task:not(.dragging)")
    let result;

    for (let taskSelected of tasks){
        const box = taskSelected.getBoundingClientRect()
        const boxCenterY = box.y + box.height / 2

    if (posY >= boxCenterY) {
        result = taskSelected
    } 
    }
    return result
}

buttons.forEach(button => {
    button.addEventListener("click", (e) => {
        const addTaskAreaButton = button.parentNode.parentNode.children[button.parentNode.parentNode.children.length - 2]
        createNewTask(button.parentNode.parentNode , addTaskAreaButton, button.parentNode.children[0].value)
        button.parentNode.children[0].value = ""
    })
})

function createNewTask(column, addTaskButton, taskName) {
    if (taskName == "") {
        alert("É necessário colocar um nome para tarefa")
    } else {
        const task = document.createElement("div")
        const taskText = document.createElement("div")
        const textContent = document.createTextNode(taskName)
        const options = document.createElement("div")
        const editIcon = document.createElement("img")
        const deleteIcon = document.createElement("img")
    
        task.className = "task"
        task.draggable = "true"
        taskText.className = "taskText"
        taskText.appendChild(textContent)
        task.appendChild(taskText)
        task.appendChild(options)
        options.appendChild(editIcon)
        options.appendChild(deleteIcon)
        options.className = "options"
        editIcon.src = "./img/edit.svg"
        editIcon.className = "icon editIcon"
        deleteIcon.src = "./img/delete.svg"
        deleteIcon.className = "icon deleteIcon"
        column.insertBefore(task, addTaskButton)
    
        toggleArea(column)
    }

}

function toggleArea(column) {
    const addTaskButton = column.querySelector(".addTaskButton")
    const addTaskArea = column.querySelector(".addTaskArea")
    addTaskButton.classList.toggle("disabled")
    addTaskArea.classList.toggle("disabled")
}

closeButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        toggleArea(button.parentNode.parentNode)
        button.parentNode.children[0].value = ""
    })
})