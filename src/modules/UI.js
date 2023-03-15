import Task from "./Task"
import Project from "./Project"
import { zip } from "lodash"
import Todo from "./Todo"
export default class UI {

    // DEFAULT DATA
    static defaultData(){
        let todolist = new Todo()
        const defaultProject = new Project("Default")
        const defaultTask = new Task("Coder une todo-app")
        const secondTask = new Task("Faire les courses")
        const thirdTask = new Task("Faire du sport")
        todolist.addProject(defaultProject)
        todolist.getProject(defaultProject.name).addTask(defaultTask)
        todolist.getProject(defaultProject.name).addTask(secondTask)
        todolist.getProject(defaultProject.name).addTask(thirdTask)
        return {
            todolist
        }
    }

    // DISPLAY CONTENT
    static displayProjects(todolist){
        todolist.getProjects().forEach(project => {
            let projectElem = document.createElement("li")
            projectElem.textContent = project.getName()
            if (["Inbox", "Today", "This week"].includes(project.getName())){
                this.getDOMElements().defaultProjectDiv.appendChild(projectElem)
            } else {
                this.getDOMElements().customProjectDiv.prepend(projectElem)
            }
        })
        this.getDOMElements().defaultProjectDiv.firstElementChild.classList.add("active")
        this.getDOMElements().projectName.textContent = "Inbox"
    }

    static displayTasks(project){
        const tasks = project.getTasks()
        const tasksList = this.getDOMElements().tasksList
        const projectTitle = this.getDOMElements().projectName
        projectTitle.textContent = project.getName()
        const childNodes = tasksList.childNodes
        Array.from(childNodes).map(child => child.tagName =="INPUT" ? null : child.remove())
        tasks.forEach(task => {
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
            tasksList.insertBefore(taskDiv, tasksList.lastElementChild)
        })
    }

    // LOAD CONTENT
    static getCurrentProject(){
        const currentProject = this.getDOMElements().currentProject
        return {
            currentProject
        }
    }

    static setCurrentProject(){
        const projects = this.getDOMElements().projects
        projects.forEach(project => project.addEventListener("click", (e) => {
            let currentProject = this.getCurrentProject().currentProject
            if (e.target != currentProject){
                e.target.classList.add("active")
                currentProject.classList.remove("active")
            } 
        }))
    }

    static loadProjects(){
        const projects = this.getDOMElements().projects
        projects.forEach(project => project.addEventListener("click", (e) => {
            let currentProjectName = this.getDOMElements().currentProject.textContent
            let selectedProjectName = e.target.textContent
            if (currentProjectName != selectedProjectName){
                let currentProject = this.defaultData().todolist.getProject(selectedProjectName)
                this.setCurrentProject()
                this.displayTasks(currentProject)
                console.log(currentProject)
            }
            
        }))
    }

    static loadDefaultContent(){
        this.addEventListener()
        const todolist = this.defaultData().todolist
        this.displayProjects(todolist)

    }



    // // static loadTitle(project){
    // //     const projectName = this.getDOMElements().projectName
    // //     projectName.textContent = project.getName()
    // // }

    // static loadTasks(project){
    //     const tasks = project.getTasks()
    //     const tasksList = this.getDOMElements().tasksList
    //     tasks.forEach(task => {
    //         const taskDiv = document.createElement("div")
    //         taskDiv.className = "task"
    //         const taskDOM = document.createElement("input")
    //         taskDOM.setAttribute("type", "checkbox")
    //         taskDOM.setAttribute("id", task.getName())
    //         const taskLabel = document.createElement("label")
    //         taskLabel.setAttribute("for", task.getName())
    //         taskLabel.textContent = task.getName()
    //         taskDOM.className = "task-item"
    //         taskDiv.appendChild(taskDOM)
    //         taskDiv.appendChild(taskLabel)
    //         tasksList.insertBefore(taskDiv, tasksList.lastElementChild)
    //     })

    // }

    // static markAsDone(){
    //     const tasks = this.getDOMElements().tasks
    //     tasks.forEach(task => task.addEventListener("click", () => {
    //         task.firstElementChild.checked = task.firstElementChild.checked ? false : true
    //     }))
    // }

    // // Create

    // static displayProjectModal(){
    //     const addProjectInput = this.getDOMElements().addProjectInput
    //     this.getDOMElements().btnAddProject.addEventListener("click", () => {
    //         addProjectInput.style.display = "flex"
    //         addProjectInput.focus()
    //         console.log("click")
    //     })
    // }

    // static createProject(){

    // }

    // static addTask(project){
    //     const taskName = this.getDOMElements().taskInput
    //     taskName.addEventListener("keyup", (e)=> {
    //         if (e.key == "Enter") {
    //             console.log(taskName.value)
    //             const newTask = new Task(taskName.value)
    //             console.log(newTask)
    //             console.log(project)
    //         }
    //     })
    // }

    // static handleKeyboard(){
    //     document.addEventListener("keydown", (e)=> {
    //         if (e.key == "Enter"){
    //             if (e.target.className.includes("project")){
    //                 console.log(e.target)
    //             }
    //         }
    //     })
    // }

    // static displayTasks(projet){
    //     projet.addEventListener("click", ()=> {
    //         this.loadTasks(projet)
    //     })
    // }

    static addEventListener(){
        this.loadProjects()
        // this.markAsDone()
        // this.addTask(this.getDOMElements().projectName)
        // this.displayProjectModal()
        // this.handleKeyboard()
        // this.displayTasks()
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
            projects
        }
    }
    
}
