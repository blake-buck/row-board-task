export interface Row{
    key:number,
    title:string,
    description:string,
    boards:number[],
    expanded:boolean,
    position:number
}

export interface Board{
    rowKey:number,
    key:number,
    title:string,
    hideCompleteTasks:boolean,
    isArchived:boolean,
    tasks:Task[]
}

export interface Task{
    key:number,
    boardKey:number,
    currentChecklistKey:number,

    body:string,
    description:string,
    cardColor:string,
    fontColor:string,

    // This could also stand to be one array of booleans
    isEditing:boolean,
    isComplete:boolean,
    important:boolean,
    warning:boolean,
    payment:boolean,
    vacation:boolean,
    social:boolean,
    work:boolean,
    travel:boolean,

    comments:TaskComment[],
    checklists:TaskChecklist[],
    displayImageUrls:string[],

    attachedFiles:{name:string, link:string}[],
    attachment:boolean,

    labels:TaskLabel[],
    linkedTasks:any[],

    //Figure out how to import Moment into this shared folder
    dueDate:any | null,
    dateCreated:any,
    lastEdited:any,

    dialogOpen:boolean
}

export interface TaskComment{
    content:string,
    date:string
}

export interface TaskChecklist{
    title:{content:string, isEditing:boolean},
    key:number,
    color:string,
    currentKey:number,
    completedTasks:number,
    content:TaskChecklistItem[]
}

export interface TaskChecklistItem{
    key:number,
    checklistKey:number,
    content:string,
    checked:boolean,
    isEditing:boolean
}

export interface TaskLabel{
    background:string,
    fontColor:string,
    text:string
}

export interface TaskLinkedTask{
    taskKey:number,
    boardKey:number
}