import Task from "./Task"
export default class Project {
    constructor(name){
        this.name = name
        this.tasks = []
    }

    getName() {
        return this.name
    }

    setName(name){
        this.name = name
    }

    getTasks() {
        return this.tasks
    }

    setTasks(tasks){
        this.tasks = tasks
    }

    addTask(taskToAdd){
        if (!(this.tasks.find(task => task.getName() == taskToAdd.name))){
            return this.tasks.push(taskToAdd)
        }
        
    }

    getTask(taskName){
        return this.tasks.find(task => task.getName() === taskName)
    }




}