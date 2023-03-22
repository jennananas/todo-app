import Task from "./Task"
import Project from "./Project"
import Todo from "./Todo"
import Storage from "./Storage"
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
        `
        projectElem.id = project.getName()
        // projectElem.textContent = project.getName()
        if (["Inbox", "Today", "This week"].includes(project.getName())){
            this.getDOMElements().defaultProjectDiv.appendChild(projectElem)
        } else {
            this.getDOMElements().customProjectDiv.prepend(projectElem)
        }
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
            <span class="material-symbols-outlined delete">
            delete
            </span>
        `
        tasksList.insertBefore(taskDiv, tasksList.lastElementChild.previousElementSibling)
    }


    static setActive(project){ 
        const currentProject = this.getDOMElements().currentProject
        if (project.textContent == currentProject.textContent){
            null
        } else {
            project.classList.add("active")
            currentProject.classList.remove("active")
        }
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
        const errorMessage = document.getElementById("validation-error")
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
            errorMessage, deleteBtn
        }
    }

    static addEventListener(){
        this.getDOMElements().projects.forEach(
            (project) => project.addEventListener("click", (e) => {
                UI.handleProjectClick(e.target.closest("li"))
            })
            )
        // this.getDOMElements().btnAddProject.addEventListener("click", UI.displayProjectModal())
        this.handleKeyboard()
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

    static setErrorMessage(div, message){
        return div.textContent = message
    }


    static submitTaskModal(currentProject,newTaskName){
        console.log(currentProject)
        if (currentProject.getTask(newTaskName)){
            this.setErrorMessage(this.getDOMElements().errorMessage, "Already exist")
        } else {
            const newTask = new Task(newTaskName)
            currentProject.addTask(newTask)
            this.getDOMElements().taskInput.value = ""
            UI.createTaskDOM(newTask)
            UI.addEventListener()
            Storage.addTask(currentProject.name, newTask)

        }
    }

    static hideDiv(div){
        div.display = "none"
    }


    static handleProjectClick(projectClicked){
        UI.setActive(projectClicked)
        UI.setTitle(projectClicked)
        const currentProject = UI.getDefaultData().todolist.getProject(projectClicked.id)
        UI.resetTaskList()
        UI.displayProjectContent(currentProject)
        // Add Event Listener delete span
        this.deleteItem()

    }

    static deleteItem(){
        const currentProject = this.getDOMElements().currentProject.id
        const deleteBtn = document.querySelectorAll(".delete")
        deleteBtn.forEach(btn => btn.addEventListener("click", (e) => {
            const taskName = e.target.previousElementSibling.getAttribute("for")
            Storage.removeTask(currentProject, taskName)
            e.target.parentNode.remove()
        }))
    }
    static handleKeyboard(){
        document.addEventListener("keydown", (e) => {
            if (e.key == "Enter"){
                const currentProjectName = UI.getDOMElements().currentProject.id
                const currentProject = this.getDefaultData().todolist.getProject(currentProjectName)
                if (e.target.classList.contains("task")){
                    let inputValidation = UI.checkInput(e.target.value)
                    if (!inputValidation){
                        this.submitTaskModal(currentProject, e.target.value)
                        this.deleteItem()
                    } else {
                        this.setErrorMessage(this.getDOMElements().errorMessage, inputValidation)
                    }  
                } 
            } else {
                this.setErrorMessage(this.getDOMElements().errorMessage, "")
                this.hideDiv(this.getDOMElements().errorMessage)
            }

    })
}


}