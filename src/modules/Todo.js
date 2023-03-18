import Project from "./Project"
export default class Todo {
    constructor(){
        this.projects = []
        this.projects.push(new Project('Inbox'))
        this.projects.push(new Project('Today'))
        this.projects.push(new Project('This week'))
    }

    setProjects(projects){
        this.projects = projects
    }

    getProjects(){
        return this.projects
    }

    getProject(projectName){
        return this.projects.find((project) => project.getName() == projectName)
    }

    addProject(projectToAdd){
        if (!(this.projects.find(project => project.getName() == projectToAdd.name))){
            return this.projects.push(new Project(projectToAdd.name))
        }
        
    }
}