import { isString, isNumber, isBoolean, hasShape, isArrayOf, isOneOf, isNull } from "./verification"

export const taskComment = {
    content: isString,
    date: isString
}
export const taskLinkedTaskTypes = {
    taskKey: isNumber,
    boardKey: isNumber
}
export const taskLabelTypes = {
    background: isString,
    fontColor: isString,
    text: isString
}
export const taskChecklistItemTypes = {
    key: isNumber,
    checklistKey: isNumber,
    content: isString,
    checked: isBoolean,
    isEditing: isBoolean
}
export const taskChecklistTypes ={
    title: hasShape({
        content:isString, 
        isEditing:isBoolean
    }),
    key: isNumber,
    color: isString,
    currentKey: isNumber,
    completedTasks: isNumber,
    content: isArrayOf(hasShape(taskChecklistItemTypes))
}
export const attachedFilesTypes = {
    name:isString,
    link:isString
}
export const taskTypes = {
    key: isNumber,
    boardKey: isNumber,
    currentChecklistKey: isNumber,

    body: isString,
    description: isString,
    cardColor: isString,
    fontColor: isString,

    isEditing: isBoolean,
    isComplete: isBoolean,
    dialogOpen: isBoolean,
    important: isBoolean,
    warning: isBoolean,
    payment: isBoolean,
    vacation: isBoolean,
    social: isBoolean,
    work: isBoolean,
    travel: isBoolean,

    comments: isArrayOf(hasShape(taskComment)),
    checklists: isArrayOf(hasShape(taskChecklistTypes)),
    displayImageUrls: isArrayOf(isString),
    
    attachedFiles: isArrayOf(hasShape(attachedFilesTypes)),
    attachment: isBoolean,

    labels: isArrayOf(hasShape(taskLabelTypes)),
    linkedTasks: isArrayOf(hasShape(taskLinkedTaskTypes)),

    dueDate: isOneOf(isString, isNull),
    dateCreated: isString,
    lastEdited: isString,
}

export const boardTypes = {
    rowKey: isNumber,
    key: isNumber,
    title: isString,
    hideCompleteTasks: isBoolean,
    isArchived: isBoolean,
    tasks: isArrayOf(hasShape(taskTypes))
}
export const rowTypes = {
    key: isNumber,
    title: isString,
    description: isString,
    boards: isArrayOf(isNumber),
    expanded: isBoolean,
    position: isNumber
}