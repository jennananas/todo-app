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
        const defaultTasks = ["Coder une todo-app", "Faire les courses", "Faire du sport"]
        const defaultProject = new Project("Default")
        todolist.addProject(defaultProject)
        defaultTasks.map(task => {
            todolist.getProject(defaultProject.name).addTask(new Task(task))
        })
        Storage.saveData(todolist)

        return {
            todolist
        }
    }

    static onLoad(){
        this.getDefaultData().todolist.getProjects().forEach(project => {
            UI.createProjectDOM(project)
        })
        this.getDOMElements().defaultProjectDiv.firstElementChild.classList.add("active")
        this.getDOMElements().projectName.textContent = UI.getDOMElements().currentProject.textContent
        const currentProject = this.getDefaultData().todolist.getProject(UI.getDOMElements().currentProject.textContent)
        UI.displayProjectContent(currentProject)
        UI.addEventListener()
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

    static createProjectDOM(project){
        let projectElem = document.createElement("li")
        projectElem.textContent = project.getName()
        if (["Inbox", "Today", "This week"].includes(project.getName())){
            this.getDOMElements().defaultProjectDiv.appendChild(projectElem)
        } else {
            this.getDOMElements().customProjectDiv.prepend(projectElem)
        }
    }

    static createTaskDOM(task){
        const tasksList = this.getDOMElements().tasksList
        const taskDiv = document.createElement("div")
        taskDiv.className = "task"
        const taskDOM = document.createElement("input")
        taskDOM.setAttribute("type", "checkbox")
        taskDOM.setAttribute("id", task.getName())
        const taskLabel = document.createElement("label")
        taskLabel.setAttribute("for", task.getName())
        taskLabel.textContent = task.getName()
        taskDOM.className = "task-item"
        taskDiv.appendChild(taskDOM)
        taskDiv.appendChild(taskLabel)
        tasksList.insertBefore(taskDiv, tasksList.lastElementChild.previousElementSibling)
    }

    static setActive(project){ // Met le projet sélectionné en gras
        const currentProject = this.getDOMElements().currentProject
        if (project.textContent == currentProject.textContent){
            null
        } else {
            project.classList.add("active")
            currentProject.classList.remove("active")
        }
    }
    static setTitle(project){ // Change le titre du main content
        const projectName = project.textContent
        this.getDOMElements().projectName.textContent = projectName
    }

    static resetTaskList(){ // Efface les tâches de l'ancien projet 
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
            errorMessage
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
        if (currentProject.getTask(newTaskName)){
            this.setErrorMessage(this.getDOMElements().errorMessage, "Already exist")
        } else {
            const newTask = new Task(newTaskName)
            currentProject.addTask(newTask)
            this.getDOMElements().taskInput.value = ""
            UI.createTaskDOM(newTask)
            Storage.addTask(currentProject.name, newTask)

        }
    }

    static hideDiv(div){
        div.display = "none"
    }


    static handleProjectClick(projectClicked){
        UI.setActive(projectClicked)
        UI.setTitle(projectClicked)
        const currentProject = UI.getDefaultData().todolist.getProject(projectClicked.textContent)
        UI.resetTaskList()
        UI.displayProjectContent(currentProject)
    }

    static handleKeyboard(){
        document.addEventListener("keydown", (e) => {
            if (e.key == "Enter"){
                const currentProjectName = UI.getDOMElements().currentProject.textContent
                const currentProject = this.getDefaultData().todolist.getProject(currentProjectName)
                if (e.target.classList.contains("task")){
                    let inputValidation = UI.checkInput(e.target.value)
                    if (!inputValidation){
                        this.submitTaskModal(currentProject, e.target.value)
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