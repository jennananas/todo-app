import Task from "./Task"
import Project from "./Project"
import Todo from "./Todo"
import Storage from "./Storage"
import {parseISO, getWeek} from "date-fns"

export default class UI {

    static onLoad(){
        Storage.getTodo().getProjects().forEach(project => {
            if (!document.getElementById(project.getName())){
                UI.createProjectDOM(project)
            } 
        })
        UI.displayProjectContent("Inbox")
        UI.setActiveProject(document.getElementById("Inbox"))
        UI.clickOnProjectEvent()
        UI.addTaskEvent()
        UI.addProjectEvent()
        UI.deleteProjectEvent()
        UI.clickOnProjectEvent()

    }

    static addProjectEvent(){
        document.querySelector(".btn-add").addEventListener("click", () => {
            const addProjectInput = document.getElementById("addProject")
            addProjectInput.style.display = "flex"
            addProjectInput.value = ""
            addProjectInput.focus()
            UI.submitProject()
        })
    }

    static submitProject(){
        document.getElementById("addProject").addEventListener("keydown", e => {
            e.stopImmediatePropagation()
            const errorMessage = document.querySelector("span.error.project")
            errorMessage.style.display = "none"
            if (e.key == "Escape"){
                e.target.value = ""
                document.getElementById("addProject").style.display = "none"
            }
            if (e.key == "Enter"){
                if (e.target.value == ""){
                    errorMessage.style.display = "flex"
                    errorMessage.textContent = "Name cannot be empty"
                }
                if (Storage.getTodo().getProject(e.target.value)){
                    errorMessage.style.display = "flex"
                    errorMessage.textContent = "Project already exists"
                } // add bad pattern
                else {
                    const newProjectName = e.target.value
                    const project = new Project(newProjectName)
                    Storage.addProject(project)
                    UI.createProjectDOM(project)
                    UI.clickOnProjectEvent()
                    UI.deleteProjectEvent()
                    UI.setActiveProject(document.getElementById(newProjectName))
                    UI.displayProjectContent(newProjectName)
                    document.getElementById("addProject").style.display = "none"
                }
            
            }
        })
    }

    static clickOnProjectEvent(){
        document.querySelectorAll("li.project").forEach(project => {
            project.addEventListener("click", e => {
                if (e.target.nodeName == "LI") {
                    const currentProjectName = e.target.id
                    UI.setActiveProject(e.target)
                    UI.displayProjectContent(currentProjectName)
                }
            })
        })
    }

    static createProjectDOM(project){
        let projectElem = document.createElement("li")
        projectElem.innerHTML = `
        <span class="material-symbols-outlined">inventory_2</span>
        ${project.getName()}
        <span class="material-symbols-outlined delete project">delete</span>
        `
        projectElem.id = project.getName()
        projectElem.classList.add("project")
        if (["Inbox", "Today", "This week"].includes(project.getName())){
            document.querySelector('ul.default').appendChild(projectElem)
        } else {
            document.querySelector('ul.custom').insertBefore(projectElem, document.querySelector(".project.input"))
        }

    }

    static deleteProjectEvent(){
        const deleteBtn = document.querySelectorAll("span.delete.project")
        deleteBtn.forEach(btn => btn.addEventListener("click", (e) => {
            e.stopImmediatePropagation()
            const projectName = e.target.parentNode.id
            console.log(projectName)
            Storage.getTodo().getProject(projectName).getTasks().forEach(task => {
                if (UI.isToday(projectName, task.name)){
                    Storage.removeTask("Today", task.name)
                }
                if (UI.isThisWeek(projectName, task.name)){
                    Storage.removeTask("This week", task.name)
                }
                Storage.removeTask("Inbox", task.name)
            })
            Storage.removeProject(projectName)
            e.target.parentNode.remove()
            UI.setActiveProject(document.getElementById("Inbox"))
            UI.displayProjectContent("Inbox")
        }))
        
    }

    static setActiveProject(projectNode){
        const projects = document.querySelectorAll(".projects")
        projects.forEach(container => {
                Array.from(container.children).filter(child => child.nodeName == "LI").forEach(child => child.classList.remove("active"))
            })
        projectNode.classList.add("active")
        document.querySelector("h2").textContent = projectNode.id
    }

    static displayProjectContent(projectName){
        
        Array.from(document.querySelector(".todolist").children).forEach(childNode => {
            if (!["INPUT", "SPAN"].includes(childNode.nodeName)){
                childNode.remove()
            }
        })

        const tasks = Storage.getTodo().getProject(projectName).getTasks()
        if (tasks.length == 0){
            UI.displayNoTaskMessage()
        }

        if (["Inbox", "Today", "This week"].includes(projectName)){
            document.querySelector("input.task").style.display = "none"
        } else {
            document.querySelector("input.task").style.display = "flex"
        }
        tasks.forEach(task => {
            if (!document.getElementById(task.name)){
                UI.createTaskDOM(task)
                if (["Inbox", "Today", "This week"].includes(projectName)){
                    // document.querySelector("span.task.delete").style.display = "none"
                }
            }
        })
    }

    static displayNoTaskMessage(){
        if (document.querySelector("p")){
            document.querySelector("p").remove()
        }
        const p = document.createElement("p")
            p.textContent = "No task yet."
            document.querySelector(".todolist").appendChild(p)
    }

    static createTaskDOM(task){
        const tasksList = document.querySelector(".todolist")
        const taskDiv = document.createElement("div")
        const taskName = task.getName()
        const today = new Date().toJSON().slice(0, 10)
        taskDiv.className = "task"
        taskDiv.innerHTML = `
            <input type="checkbox" id='${taskName}' class="task-item">
            <label for='${taskName}'>${taskName}</label>
            <label for="dueDate"></label>
            <input type="date" id="dueDate" name="dueDate" value='${task.getDueDate()}' min='${today}'>

            
        `
        tasksList.prepend(taskDiv)
        UI.deleteTaskEvent()
        UI.updateDueDate()
    }
    static deleteTaskEvent(){
        const project = document.querySelector("h2").textContent
        const task = document.querySelectorAll("div.task")
        task.forEach(btn => btn.addEventListener("click", (e) => {
            e.stopImmediatePropagation()
            const taskName = e.target.firstElementChild.id
            Storage.removeTask("Inbox", taskName)
            
            if (UI.isToday(project, taskName)){
                Storage.removeTask("Today", taskName)
            }
            if (UI.isThisWeek(project, taskName)){
                Storage.removeTask("This week", taskName)
            }
            Storage.removeTask(project, taskName)
            e.target.remove()
            if (Storage.getTodo().getProject(project).getTasks().length == 0){
                UI.displayNoTaskMessage()
            }
        }))
    }

    static isToday(project, taskName){
        const today = new Date().toJSON().slice(0,10)
        return Storage.getTodo().getProject(project).getTask(taskName).getDueDate() === today

    }

    static isThisWeek(project, taskName){
        const currentWeek = getWeek(new Date())
        return getWeek(parseISO(Storage.getTodo().getProject(project).getTask(taskName).getDueDate()),1) === currentWeek
    }

    static updateDueDate(){
        document.querySelectorAll("input[type='date']").forEach(date => date.addEventListener("input", e => {
            e.stopImmediatePropagation()
            const projectName = document.querySelector("h2").textContent
            const taskName= e.target.parentNode.firstElementChild.id
            const date = e.target.value
            const year = date.slice(0,4)
            const month = date.slice(5,7)
            const day = date.slice(8,10)
            let newDueDate = new Date(Date.UTC(year, month-1, day)).toJSON().slice(0,10)
            const today = new Date().toJSON().slice(0,10)
            const previousDueDate = Storage.getTodo().getProject(projectName).getTask(taskName).getDueDate()
            Storage.updateDueDate("Inbox", taskName, newDueDate)
            Storage.updateDueDate(projectName, taskName, newDueDate)
 
            if (UI.isToday(projectName, taskName)){
                Storage.addTask("Today", Storage.getTodo().getProject(projectName).getTask(taskName))
            }
            if (UI.isThisWeek(projectName, taskName)){
                if (Storage.getTodo().getProject("This week").getTask(taskName)){
                    Storage.updateDueDate("This week", taskName, newDueDate)
                } else {
                    Storage.addTask("This week", Storage.getTodo().getProject(projectName).getTask(taskName))
                }
            }
            if ((previousDueDate === today) && Storage.getTodo().getProject("Today").getTask(taskName)){
                Storage.removeTask("Today", taskName)
            }
            if (getWeek(parseISO(newDueDate)) !== getWeek(parseISO(today)) && (Storage.getTodo().getProject("This week").getTask(taskName) )){
                Storage.removeTask("This week", taskName)
            }
            
        }))
    }

    static addTaskEvent(){
        document.querySelector("input[type='text'].task").addEventListener("keydown", e => {
            e.stopPropagation()
            const currentProjectName = document.querySelector("h2").textContent
            const errorMessage = document.querySelector("span.task.error")
            errorMessage.style.display = "none"
            if (e.key == "Enter"){
                if (e.target.value == "") {
                    errorMessage.style.display = "flex"
                    errorMessage.textContent = "Name cannot be empty"
                }
                if (Storage.getTodo().getProject(currentProjectName).getTask(e.target.value)){
                    errorMessage.style.display = "flex"
                    errorMessage.textContent = "Task already exists"
                }
                else {
                    const newTaskName = e.target.value
                    const task = new Task(newTaskName)
                    UI.createTaskDOM(task)
                    Storage.addTask(currentProjectName, task)
                    UI.updateInbox()
                    if (UI.isToday(currentProjectName, newTaskName)){
                        Storage.addTask("Today", task)
                    }
                    if (UI.isThisWeek(currentProjectName, newTaskName)){
                        Storage.addTask("This week", task)
                    }
                    e.target.value = ""
                    if (document.querySelector("p")){
                        document.querySelector("p").remove()
                    }
                }

                // bad pattern

            }
        })
    }

    static updateInbox(){
        Storage.getTodo().getProjects().forEach(project => {
            project.getTasks().forEach(task => {
                Storage.addTask("Inbox", task)
            })
        })
    }

    static getTodayTasks(){
        Storage.getTodo().getProjects().forEach(project => {
        project.getTodayTasks().forEach(task => {
            Storage.addTask("Today", task)
        }) 
        })
    }

    static getWeekTasks(){
        Storage.getTodo().getProjects().forEach(project => {
            if (!["Inbox", "This week", "Today"].includes(project.name)){
                project.getWeekTasks().forEach(task => {
                    Storage.addTask("This week", task)
                })
            }
            })
    }


}


