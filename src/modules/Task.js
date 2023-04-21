export default class Task {
    constructor(name, dueDate = new Date().toJSON().slice(0,10)) {
        this.name = name;
        this.dueDate = dueDate

    }

    getName() {
        return this.name
    }

    setName(name){
        this.name = name
    }

    getDueDate() {
        return this.dueDate
    }

    setDueDate(dueDate){
        this.dueDate = dueDate
    }

}