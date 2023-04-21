import Todo from "./Todo";
import Project from "./Project";
import Task from "./Task";

export default class Storage {

    static saveData(todo){
        localStorage.setItem("todolist", JSON.stringify(todo))
    }

    static getTodo(){ // on crée une todo vide ou on en crée une à partir des données stockées
        const todolist = Object.assign(new Todo(), JSON.parse(localStorage.getItem("todolist")))
        todolist.setProjects( 
            todolist.getProjects()
            .map(project => Object.assign(new Project(), project))
        )
        
        todolist.getProjects()
        .forEach(project => {
            project.setTasks(
                project.getTasks()
                .map(task =>  Object.assign(new Task(), task))
            )
        });

        return todolist
        
    }

    static addProject(project){
        const todo = Storage.getTodo()
        todo.addProject(project)
        Storage.saveData(todo)
    }

    static addTask(projectName, task){
        const todo = Storage.getTodo()
        todo.getProject(projectName).addTask(task)
        Storage.saveData(todo)
    }

    static removeTask(projectName, taskName){
        const todo = Storage.getTodo()
        todo.getProject(projectName).removeTask(taskName)
        Storage.saveData(todo)

    }

    static removeProject(projectName){
        const todo = Storage.getTodo()
        todo.getProject(projectName).getTasks().forEach(task => {
            Storage.removeTask("Inbox", task)
        })
        todo.removeProject(projectName)
        Storage.saveData(todo)
    }

    static updateDueDate(projectName, taskName, dueDate){
        const todo = Storage.getTodo()
        todo.getProject(projectName).getTask(taskName).setDueDate(dueDate)
        Storage.saveData(todo)
    }


}