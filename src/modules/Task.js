import { parseJSON } from "date-fns";
import format from "date-fns/format";

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