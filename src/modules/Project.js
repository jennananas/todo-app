import Task from "./Task"
import { getWeek, parseISO } from 'date-fns'
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

    removeTask(taskName){
        this.tasks = this.tasks.filter((task) => task.name !== taskName)
    }

    getTodayTasks(){
        return this.tasks.filter(task => task.dueDate === new Date().toJSON().slice(0,10))
        
    }
    getWeekTasks(){
        const currentWeek = getWeek(new Date())
        return this.tasks.filter(task => getWeek(parseISO(task.dueDate),1) === currentWeek)
    }




}