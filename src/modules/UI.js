import Task from "./Task"
import Project from "./Project"
import Todo from "./Todo"
import Storage from "./Storage"
import { add } from "lodash"
export default class UI {

    static getDefaultData(){
        let todolist = new Todo()
        if (localStorage.getItem("todolist")){
            todolist = Storage.getTodo().todolist
        }
        
        return {
            todolist
        }
    }

    static onLoad(){
        // const DefaultProject = new Project("Default")
        // Storage.addProject(DefaultProject)
        this.getDefaultData().todolist.getProjects().forEach(project => {
            if (!document.getElementById(project.getName())){
                UI.createProjectDOM(project)
            }
        })
        this.getDOMElements().defaultProjectDiv.firstElementChild.classList.add("active")
        this.getDOMElements().projectName.textContent = UI.getDOMElements().currentProject.id
        const currentProject = this.getDefaultData().todolist.getProject(UI.getDOMElements().currentProject.id)
        UI.displayProjectContent(currentProject)
        UI.addEventListener()
        
    }

        static createProjectDOM(project){
        let projectElem = document.createElement("li")
        projectElem.innerHTML = `
        <span class="material-symbols-outlined">inventory_2</span>
        ${project.getName()}
        <span class="material-symbols-outlined delete project">delete</span>
        `
        projectElem.id = project.getName()
        // projectElem.textContent = project.getName()
        if (["Inbox", "Today", "This week"].includes(project.getName())){
            this.getDOMElements().defaultProjectDiv.appendChild(projectElem)
        } else {
            this.getDOMElements().customProjectDiv.insertBefore(projectElem, document.querySelector(".project.input"))
        }
        UI.deleteProjectEvent()
            
    }

    static displayProjectContent(project){
        project.getTasks().forEach(task => {
            if (document.getElementById(task.name)){
                null
            } else {
                this.createTaskDOM(task)
            }
        })
    }



    static createTaskDOM(task){
        const tasksList = this.getDOMElements().tasksList
        const taskDiv = document.createElement("div")
        const taskName = task.getName()
        taskDiv.className = "task"
        taskDiv.innerHTML = `
            <input type="checkbox" id='${taskName}' class="task-item">
            <label for='${taskName}'>${taskName}</label>
            <span class="material-symbols-outlined delete task">
            delete
            </span>
        `
        tasksList.insertBefore(taskDiv, tasksList.lastElementChild.previousElementSibling)
        UI.deleteTaskEvent()

    }


    static setActive(projectSelected){ 
        const projects = document.querySelectorAll(".projects")
        projects.forEach(project => {
            Array.from(project.children).filter(child => child.nodeName == "LI").forEach(child => child.classList.remove("active"))
            // project.children.forEach(child => console.log(child))
        })
        projectSelected.classList.add("active")
    }

    static setTitle(project){ 
        const projectName = project.id
        this.getDOMElements().projectName.textContent = projectName
    }

    static resetTaskList(){ 
        const tasksList = this.getDOMElements().tasksList
        const childNodes = tasksList.childNodes
        Array.from(childNodes).map(child => child.tagName == "DIV" ? child.remove(): null)
    }
    

    static getDOMElements(){
        const projectName = document.querySelector(".main-content h2")
        const tasksList = document.querySelector(".todolist")
        const tasks = document.querySelectorAll(".task:not(input)")
        const taskInput = document.querySelector("input.task")
        const defaultProjectDiv = document.querySelector(".projects.default")
        const customProjectDiv = document.querySelector(".projects.custom")
        const btnAddProject = document.querySelector(".btn-add")
        const addProjectInput = document.querySelector(".input.project")
        const currentProject = document.querySelector(".active")
        const projects = document.querySelectorAll(".projects")
        const errorMessageTask = document.querySelector(".error.task")
        const errorMessageProject = document.querySelector(".error.project")
        const deleteBtn = document.querySelectorAll(".delete")

        return {
            projectName, 
            tasksList,
            tasks, 
            taskInput,
            defaultProjectDiv,
            customProjectDiv,
            btnAddProject,
            addProjectInput,
            currentProject,
            projects,
            errorMessageTask, deleteBtn, errorMessageProject
        }
    }

    static addEventListener(){
        this.getDOMElements().projects.forEach(
            (project) => project.addEventListener("click", (e) => {
                // console.log(e.target.nodeName)
                if (e.target.nodeName != "SPAN"){
                    // console.log(e.target)
                    UI.setActive(e.target.closest("li"))
                    UI.handleProjectClick(e.target.closest("li"))
                }
            })
            )
        this.getDOMElements().btnAddProject.addEventListener("click", () => {
            const addProjectInput = document.getElementById("addProject")
            addProjectInput.style.display = "flex"
            addProjectInput.focus()
            addProjectInput.addEventListener("keydown", e => {
                this.getDOMElements().errorMessageProject.textContent = ""
                if (e.key == "Escape"){
                    e.target.value = ""
                    addProjectInput.style.display = "none"
                    this.getDOMElements().errorMessageProject.style.display = none
                } else if (e.key == "Enter") {
                    const newProjectName = e.target.value
                    if (this.getDefaultData().todolist.getProject(newProjectName)){
                        this.getDOMElements().errorMessageProject.textContent = "Project already exists"
                    } else {
                        let validation = UI.checkInput(newProjectName)
                    if (!validation) {
                        const newProject = new Project(newProjectName)
                        UI.createProjectDOM(newProject)
                        Storage.addProject(newProject)
                        e.target.value = ""
                        addProjectInput.style.display = "none"
                        this.getDOMElements().errorMessageProject.textContent = ""
                    // this.getDOMElements().errorMessageProject.style.display = none
                    } else {
                        // this.getDOMElements().errorMessageProject.textContent = validation
                        }
                    }
                    
                } else {
                    this.getDOMElements().errorMessageProject.textContent = ""
                    // this.getDOMElements().errorMessageProject.style.display = none
                }
            })
            
        })
        this.getDOMElements().taskInput.addEventListener("keydown", (e) => {
            if (e.key == "Enter"){
                const currentProjectName = UI.getDOMElements().currentProject.id
                const currentProject = this.getDefaultData().todolist.getProject(currentProjectName)
                const newTaskName = e.target.value
                if (currentProject.getTask(newTaskName)){
                    this.getDOMElements().errorMessageTask.style.display = "flex"
                    this.getDOMElements().errorMessageTask.textContent = "Task already exists" 
                    
                }
                else { // On ajoute la tache
                    let inputValidation = UI.checkInput(newTaskName)
                    if (!inputValidation){
                        const newTask = new Task(newTaskName)
                        currentProject.addTask(newTask)
                        UI.getDOMElements().taskInput.value = ""
                        UI.createTaskDOM(newTask)
                        UI.addEventListener()
                        Storage.addTask(currentProject.name, newTask)
                    } else {
                        this.getDOMElements().errorMessageTask.textContent = inputValidation
                    } 
                }
            } else {
                this.getDOMElements().errorMessageTask.textContent = ""
                this.getDOMElements().errorMessageTask.style.display = "none"
            }

            
    })
}


    static checkInput(inputValue){
        if (inputValue.trim().length == 0){
            return "Name can't be empty"
        }
        if (!inputValue.match(/^[\w'"\s]*$/g)){
            return "Use only alpha numeric characters"
        } else {
            return false
        }
    }



    static hideDiv(div){
        div.display = "none"
    }


    static handleProjectClick(projectClicked){
        UI.setTitle(projectClicked)
        const currentProject = UI.getDefaultData().todolist.getProject(projectClicked.id)
        UI.resetTaskList()
        UI.displayProjectContent(currentProject)
        // Add Event Listener delete span
        this.deleteTaskEvent()

    }

    static deleteTaskEvent(){
        const currentProject = this.getDOMElements().currentProject.id
        const deleteBtn = document.querySelectorAll(".delete.task")
        deleteBtn.forEach(btn => btn.addEventListener("click", (e) => {
            const taskName = e.target.previousElementSibling.getAttribute("for")
            Storage.removeTask(currentProject, taskName)
            e.target.parentNode.remove()
        }))
    }

    static deleteProjectEvent(){
        const deleteBtn = document.querySelectorAll(".delete.project")
        deleteBtn.forEach(btn => btn.addEventListener("click", e => {
            const projectName = e.target.parentNode.id
            Storage.removeProject(projectName)
            e.target.parentNode.remove()
            const defaultProject = document.getElementById("Inbox")
            UI.handleProjectClick(defaultProject)
        }))
    }

}


